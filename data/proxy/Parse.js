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
 * Configurations:
 * @param {String/String[]} includeKeys key or keys for pointers to be included with this proxy's queries
 *
 * @author Tyler Wolf
 */
Ext.define('Ext.ux.parse.data.proxy.Parse', {
    extend: 'Ext.data.proxy.Rest',
    alias : 'proxy.parse',

    requires: [
        'Ext.ux.parse.data.ParseConnector',
        'Ext.ux.parse.data.reader.Parse'
    ],

    config: {
        // Used with Parse's "include" property for inlining pointer data
        includeParam: 'include',
        includeKeys: null,

        sortParam: 'order',
        pageParam: false,
        skipParam: 'skip',
        countParam: 'count',
        filterParam: 'where',

        reader: 'parse'
    },

    /**
     * @override
     */
    getParams: function(operation) {
        var me = this,
            params = {},
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),

            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            skipParam = me.getSkipParam(),
            countParam = me.getCountParam(),
            includeParam = me.getIncludeParam(),
            includeKeys = me.getIncludeKeys();

        if (me.getEnablePagingParams()) {
            if (skipParam && page !== null && limit !== null) {
                params[skipParam] = (page - 1) * limit;
            }

            if (startParam && start !== null) {
                params[startParam] = start;
            }

            if (limitParam && limit !== null) {
                params[limitParam] = limit;
            }

            if (countParam) {
                params[countParam] = 1;
            }
        }

        if (sortParam && sorters && sorters.length > 0) {
            params[sortParam] = me.encodeSorters(sorters);
        }

        if (filterParam && filters && filters.length > 0) {
            params[filterParam] = me.encodeFilters(filters);
        }

        if (includeParam && includeKeys) {
            var includeKeyArray = Ext.Array.from(includeKeys);
            params[includeParam] = includeKeyArray.join(',');
        }

        return params;
    },

    /**
     * @override
     */
    encodeSorters: function(sorters) {
        var sortStrings = [];

        Ext.Array.each(sorters, function (sorter) {
            if (sorter.getDirection().toUpperCase() == 'DESC') {
                sortStrings.push('-' + sorter.getProperty());
            } else {
                sortStrings.push(sorter.getProperty());
            }
        });

        return sortStrings.join(',');

    },

    /**
     *  @override
     */
    encodeFilters: function(filters) {
        var filterObject = {};

        Ext.Array.each(filters, function (filter) {
            filterObject[filter.getProperty()] = filter.getValue();
        });

        return Ext.encode(filterObject);
    },

    /**
     * @override
     */
    getHeaders: function () {
        return Ext.applyIf(this.callParent(arguments) || {}, Ext.ux.parse.data.ParseConnector.getRequiredHeaders());
    }
});