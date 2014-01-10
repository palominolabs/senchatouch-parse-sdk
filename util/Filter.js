/**
 * Copyright 2013-2014 Palomino Labs, Inc.
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
 * A singleton for constructing filters for Parse queries.
 *
 * @author Hayden Gomes
 */
Ext.define('Ext.ux.parse.util.Filter', {
    singleton: true,

    generatePointerFilter: function (propertyName, className, objectId) {
        return new Ext.util.Filter({
            property: propertyName,
            value: {
                __type: 'Pointer',
                className: className,
                objectId: objectId
            }
        });
    },

    generateInQueryFilter: function (propertyName, className, filter) {
        var value = {
            '$inQuery': {
                className: className
            }
        };

        if (filter) {
            value['$inQuery'].where = this._convertFilterToJson(filter);
        }

        return new Ext.util.Filter({
            property: propertyName,
            value: value
        });
    },

    generateOrFilter: function (filters) {
        var me = this,
            convertedFilters = [];
        Ext.Array.forEach(filters, function(filter) {
            convertedFilters.push(me._convertFilterToJson(filter));
        }, me);

        return new Ext.util.Filter({
            property: '$or',
            value: convertedFilters
        });
    },

    _convertFilterToJson: function (filter) {
        var jsonFilter = {};
        jsonFilter[filter.getProperty()] = filter.getValue();
        return jsonFilter;
    }
});