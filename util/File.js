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
 * A singleton for uploading files to Parse.
 *
 * @author Hayden Gomes
 */
Ext.define('Ext.ux.parse.util.File', {
    singleton: true,

    requires: [
        'Ext.ux.parse.ParseAjax'
    ],

    FILE_URL_PATH: '/files/',

    /**
     *
     * @param {File} file a Javascript File object to be uploaded
     * @param {Object} [options] Options including all standards supported by Ext.data.Connection.request
     */
    uploadFile: function (file, options) {
        if (file && file.name && file.type) {
            var requestOptions = {
                url: this.FILE_URL_PATH + file.name,
                headers: {
                    'Content-Type': file.type
                },
                method: 'POST'
            };

            if (file.slice && typeof file.slice === 'function') {
                requestOptions.binaryData = file.slice();
            } else if (file.webkitSlice && typeof file.webkitSlice === 'function') {
                requestOptions.binaryData = file.webkitSlice();
            } else if (options.failure) {
                options.failure("Unable to splice blob from file", options);
                return;
            }

            Ext.applyIf(requestOptions, options);
            Ext.ux.parse.ParseAjax.request(requestOptions);
        } else {
            if (options.failure) {
                options.failure("ParseLibError: Unable to parse file", options);
            }
        }
    },

    generateImageField: function (imageName, imageUrl) {
        return {
            name: imageName,
            url: imageUrl,
            __type: 'File'
        }
    }
});
