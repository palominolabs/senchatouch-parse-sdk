/**
 * Copyright 2013 Palomino Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Encapsulates the information necessary to connect with Parse, and provides utilities for
 * properly constructing requests with this information.
 *
 * @author Tyler Wolf
 */
Ext.define("Ext.ux.parse.data.ParseConnector", {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    singleton: true,

    API_DOMAIN: 'https://api.parse.com',

    DEFAULT_API_VERSION: 1,

    /**
     * The Parse session token for the authenticated user
     * @private
     */
    _sessionToken: null,

    /**
     * The Parse user objectId for the authenticated user
     * @private
     */
    _userId: null,

    /**
     * The Parse user data object for the authenticated user
     * @private
     */
    _userData: null,

    /**
     * The authenticated user's third-party auth data
     * @private
     */
    _authData: null,

    /**
     * @event login
     * Fires whenever the user successfully logs into Parse.
     * Does not fire when signup occurs, although the user is logged in
     * at signup.
     */

    /**
     * @event signup
     * Fires whenever the user successfully signs up in Parse
     */

    /**
     * @event loginFailed
     * Fires whenever the login attempt to Parse fails
     */

    /**
     * Initializes the connection information required to communicate with Parse.
     * @param {Object} options Configuration options
     * @param {String} options.applicationId The ID of the Parse application.
     * @param {String} options.apiKey The public key to use to sign requests.
     * @param {Number} [options.apiVersion=1] The Parse API version.  Defaults to 1.
     * @return {Ext.ux.parse.data.ParseConnector} this
     */
    initialize: function(options) {
        var me = this;

        options = options || {};

        me._verifyRequiredInitKeys(options);

        me.apiVersion = options.apiVersion || me.DEFAULT_API_VERSION;
        me.applicationId = options.applicationId;
        me.apiKey = options.apiKey;
        me.urlRoot = me.API_DOMAIN;

        return me;
    },

    /**
     * Returns the Parse API version
     * @return {Number} Parse API version
     */
    getApiVersion: function() {
        return this.apiVersion;
    },

    /**
     * Returns the Parse application ID
     * @return {String} Parse application ID
     */
    getApplicationId: function() {
        return this.applicationId;
    },

    /**
     * Returns the API key for the Parse application
     * @return {String} API key
     */
    getApiKey: function() {
        return this.apiKey;
    },

    /**
     * Returns the root URL for the Parse REST API call
     * @return {String} The root URL
     */
    getUrlRoot: function() {
        return this.urlRoot;
    },

    /**
     * Returns the user ID for the active user
     * @returns {String} The active user's ID
     */
    getUserId: function() {
        return this._userId;
    },

    /**
     * Returns the user data for the active user
     * @returns {Object} The active user's data
     */
    getUserData: function() {
        return this._userData;
    },

    /**
     * Returns the session token for the active user
     * @returns {String} The active user's session token
     */
    getSessionToken: function() {
        return this._sessionToken;
    },

    /**
     * Assembles an object containing the required headers required for communication with Parse's
     * REST API
     * @return {Object} Headers
     */
    getRequiredHeaders: function() {
        var me = this,
            sessionToken = me.getSessionToken(),
            headers = {
            'X-Parse-Application-Id': me.getApplicationId(),
            'X-Parse-REST-API-Key': me.getApiKey()
        };

        if (sessionToken) {
            headers['X-Parse-Session-Token'] = sessionToken;
        }

        return headers;
    },

    /**
     * Returns user's current authentication status
     * @returns {Boolean} True iff the user is logged in
     */
    isAuthenticated: function () {
        var me = this;
        return !Ext.isEmpty(me._sessionToken) && !Ext.isEmpty(me._userId);
    },

    /**
     * Logs in Facebook user to Parse. If there is no registered user with the given
     * Facebook credentials, then it creates a new entry for them. For signups,
     * userData is included in the database, however it does not currently update
     * for existing users.
     * @param {String} fbId ID returned from Facebook authentication
     * @param {String} fbAccessToken token returned from Facebook authentication
     * @param {Number} fbExpiresIn duration in seconds returned from Facebook authentication
     * @param {Object} [userData] optional userData to also be included for signup user data population
     */
    signupOrLoginWithFacebook: function (fbId, fbAccessToken, fbExpiresIn, userData) {
        var me = this,
            jsonData = userData || {};

        me._authData = {
            facebook: {
                id: fbId,
                access_token: fbAccessToken,
                expiration_date: Ext.Date.add(new Date(), Ext.Date.SECONDS, fbExpiresIn)
            }
        };

        Ext.apply(jsonData, {authData: me._authData});

        Ext.ux.parse.ParseAjax.request({
            url: '/users',
            jsonData: jsonData,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                me._userId = json.objectId;
                me._sessionToken = json.sessionToken;
                me._userData = json;

                if (response.status == 200) {
                    me.fireEvent('login');
                } else if (response.status == 201) {
                    me.fireEvent('signup');
                }
            },
            failure: function (response) {
                me.fireEvent('loginFailed');
            }
        });
    },

    /**
     * Iterates over the keys in the supplied object and asserts that all required keys are present
     * @param {Object} options The options passed to init
     * @private
     */
    _verifyRequiredInitKeys: function(options) {
        var suppliedKeys = Ext.Object.getKeys(options),
            requiredKeys = this._getRequiredInitKeys();

        Ext.Array.forEach(requiredKeys, function(item, index, allItems) {
            this._verifyRequiredKey(suppliedKeys, item);
        }, this);
    },

    /**
     * Verifies that key is supplied in keys
     * @param {String} keys The supplied keys
     * @param {String} key A required key
     * @private
     */
    _verifyRequiredKey: function(keys, key) {
        if (!Ext.Array.contains(keys, key)) {
            throw new Error(["[", Ext.getDisplayName(arguments.callee), "] A Parse", key, "must be specified"].join(' '));
        }
    },

    /**
     * Returns an array of the required keys for the init options
     * @return {Array} Array of required key names for the initialize options
     * @private
     */
    _getRequiredInitKeys: function() {
        return ['applicationId', 'apiKey'];
    }
});