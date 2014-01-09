/**
 * Copyright 2014 Palomino Labs, Inc.
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
 * An alternative reader for the Parse proxy that extends the standard JSON reader
 *
 * Sencha Touch uses the root parameter for identifying the key in JSON responses
 * that actual model data is contained in. It assumes that all responses will have
 * the same root.
 *
 * However, Parse has varied response JSON formats depending on whether multiple
 * entries are being returned. For individual entries, the data is directly in
 * the response object. For multiple entries, a 'results' array is included in
 * the response with all of the entries in the requested sort order. Additionally,
 * Parse returns nothing for a successful delete.
 *
 * Parse GET response format for single entry:
 * { "objectId": "Ed1nuqPvcm", ..., "createdAt": "2011-08-20T02:06:57.931Z" }
 *
 * Parse GET response format multiple entries:
 * { "results": [ { item1data... },{ item2data... }... ], "count": 25 }
 *
 * Parse creation POST response format:
 * { "createdAt": "2011-08-20T02:06:57.931Z", "objectId": "Ed1nuqPvcm" }
 *
 * Parse update PUT response format:
 * { "updatedAt": "2011-08-21T18:02:52.248Z" }
 *
 * Parse DELETE response format:
 * {}
 *
 * This custom reader handles both potential roots by overriding the JSON reader
 * getRoot functionality. It first checks for the 'results' root, and then if
 * the returned root is null, it will replace it with the data object if it exists.
 *
 * For deletes, Sencha Touch expects the deleted entries to be returned as part of
 * a successful request. Because Parse returns nothing, this reader must mimic the
 * expected behavior by populating the response data for deletes. This is done by
 * overriding getResponseData to return the records included in the request in
 * place of actual response data.
 *
 * @author Hayden Gomes
 */
Ext.define('Ext.ux.parse.data.reader.Parse', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.parse',

    config: {
        rootProperty: 'results',
        totalProperty: 'count'
    },

    /**
     * Returns root object of entries in response data from Parse query.
     * @param {Object} data data object extracted from JSON response from Parse.
     * @return {Object} root of entries in response data.
     * @override
     */
    getRoot: function (data) {
        var me = this,
            root = me.callParent(arguments);

        if (!root && data){
            root = data;
        }
        return root;
    },

    /**
     * Returns response data from Parse query.
     * @param {Object} response response object for request.
     * @return {Object} data of entries in response.
     * @override
     */
    getResponseData: function(response) {
        if (response && response.request && response.request.options && response.request.options.method == 'DELETE') {
            return response.request.options.records;
        } else {
            return this.callParent(arguments);
        }
    }
});
