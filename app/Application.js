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
 * An override to the Ext.app.Application class which initializes the Parse connection before stores are
 * ... instantiated, so that autoLoading works.
 *
 * @author Tyler Wolf
 */
Ext.define("Ext.ux.parse.app.Application", {
    override: 'Ext.app.Application',

    requires: [
        'Ext.ux.parse.data.ParseConnector'
    ],

    /**
     * @override
     */
    instantiateStores: function () {
        var me = this;
        me.initializeParseConnector();
        me.callParent(arguments);
    },

    /**
     * Initializes the Parse connector with the configuration specified by this.parseConfig
     */
    initializeParseConnector: function () {
        Ext.ux.parse.data.ParseConnector.initialize(this.parseConfig);
    }

});