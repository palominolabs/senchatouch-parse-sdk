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
 * A singleton for creating batch requests to Parse.
 *
 * @author Hayden Gomes
 */
Ext.define('Ext.ux.parse.data.ParseBatch', {
    singleton: true,

    requires: [
        'Ext.ux.parse.ParseAjax',
        'Ext.ux.parse.data.ParseConnector'
    ],

    conn: Ext.ux.parse.data.ParseConnector,

    /**
     * Generates update request object to be used in Parse batch requests
     * @param {String} className name of class to be updated
     * @param {String} classItemId id of class item to be updated
     * @param {Object} updates changes to be made to class item
     * @returns {{method: String, path: String, body: Object}} update object
     */
    generateUpdateRequest: function (className, classItemId, updates) {
        return {
            method: 'PUT',
            path: ['/' + this.conn.getApiVersion(), 'classes', className, classItemId].join('/'),
            body: updates
        }
    },

    /**
     * Makes batch request to Parse
     * Batch requests could theoretically be comprised of a variety of PUTs,
     * GETs, DELETEs, and POSTs, however response processing is left up to
     * the callbacks.
     * @param {Object/Object[]} requests array of requests to be batched together
     * @param {Object} [options] Options including all standards supported by Ext.data.Connection.request
     */
    makeBatchRequest: function (requests, options) {
        var requestOptions = {
            url: '/batch',
            method: 'POST',
            jsonData: {
                requests: Ext.Array.from(requests)
            }
        };
        Ext.applyIf(requestOptions, options);

        Ext.ux.parse.ParseAjax.request(requestOptions);
    }
});