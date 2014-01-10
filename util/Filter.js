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

    /**
     * Generate a filter for a pointer relation field
     * This filter allows you to filter for entries associated with a given Parse pointer
     * All stores that this filter are applied to must have remoteFilter configured to true
     * @param {String} propertyName name of the field in the class you want to filter by
     * @param {String} className name of the class of the pointer
     * @param {String} objectId ID of the pointer object to filter for
     * @returns {Ext.util.Filter}
     */
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

    /**
     * Generate a Parse $inQuery filter
     * This filter type allows you to filter by the results of a subquery
     * All stores that this filter are applied to must have remoteFilter configured to true
     * @param {String} propertyName Name of the class property to filter by
     * @param {String} className Name of class for the subquery
     * @param {Ext.util.Filter} [filter] Optional filter to apply to subquery
     * @returns {Ext.util.Filter}
     */
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

    /**
     * Generate a Parse $or filter
     * This filter allows you to query with two or more filters or'd together
     * All stores that this filter are applied to must have remoteFilter configured to true
     * @param {Ext.util.Filter[]} filters an array of filters to be or'd together
     * @returns {Ext.util.Filter}
     */
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

    /**
     * Converts an existing Ext.util.Filter into a simple JS {property: value}
     * object. This is needed for forming subqueries
     * @param {Ext.util.Filter} filter to be converted
     * @returns {Object}
     * @private
     */
    _convertFilterToJson: function (filter) {
        var jsonFilter = {};
        jsonFilter[filter.getProperty()] = filter.getValue();
        return jsonFilter;
    }
});