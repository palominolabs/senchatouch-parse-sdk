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
        sortParam: 'order',
        reader: {
            type: 'json',
            rootProperty: 'results'
        }
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

            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam();

        if (me.getEnablePagingParams()) {
            if (pageParam && page !== null) {
                params[pageParam] = page;
            }

            if (startParam && start !== null) {
                params[startParam] = start;
            }

            if (limitParam && limit !== null) {
                params[limitParam] = limit;
            }
        }

        if (sortParam && sorters && sorters.length > 0) {
            params[sortParam] = me.encodeSorters(sorters);
        }

        if (filterParam && filters && filters.length > 0) {
            params[filterParam] = me.encodeFilters(filters);
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
     * @override
     */
    getHeaders: function () {
        return Ext.applyIf(this.callParent(arguments) || {}, Ext.ux.parse.data.ParseConnector.getRequiredHeaders());
    }
});