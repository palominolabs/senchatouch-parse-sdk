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
 * A utility class for working with Parse Arrays.
 *
 * @author Hayden Gomes
 */
Ext.define('Ext.ux.parse.util.Array', {
    singleton: true,

    requires: [
        'Ext.ux.parse.ParseAjax'
    ],

    /**
     * Makes request to add items to existing Array column of Parse class
     * @param {String} className name of class that contains property 'propertyName'
     * @param {String} classItemId ID of the specific class item to update
     * @param {String} propertyName name of array property in className to make additions to
     * @param {Array} itemsToAdd array of items to add to the existing array
     * @param {Object} [options] Options including all standards supported by Ext.data.Connection.request
     */
    addToArray: function (className, classItemId, propertyName, itemsToAdd, options) {
        var requestOptions = {
            url: '/classes/' + className + '/' + classItemId,
            method: 'PUT',
            jsonData: {}
        };

        Ext.applyIf(requestOptions, options);

        requestOptions.jsonData[propertyName] = {
            __op: 'Add',
            objects: itemsToAdd
        };

        Ext.ux.parse.ParseAjax.request(requestOptions)
    }
});