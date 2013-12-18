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
 * A proxy for communicating with Parse's REST API.
 *
 * @author Tyler Wolf
 */
Ext.define('Ext.ux.parse.data.proxy.Parse', {
    extend: 'Ext.data.proxy.Rest',
    alias : 'proxy.parse',

    requires: [
        'Ext.ux.parse.data.ParseConnector'
    ],

    config: {
        reader: {
            type: 'json',
            rootProperty: 'results'
        }
    },

    /**
     * @override
     */
    getHeaders: function () {
        return Ext.applyIf(this.callParent(arguments) || {}, Ext.ux.parse.data.ParseConnector.getRequiredHeaders());
    }
});