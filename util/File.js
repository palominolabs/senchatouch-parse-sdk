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
            } else if (file.mozSlice && typeof file.mozSlice === 'function') {
                requestOptions.binaryData = file.mozSlice();
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

    uploadBlob: function (blob, filename, fileType, options) {
        if (blob && filename && fileType) {
            var requestOptions = {
                url: this.FILE_URL_PATH + filename,
                headers: {
                    'Content-Type': fileType
                },
                method: 'POST',
                binaryData: blob
            };

            Ext.applyIf(requestOptions, options);
            Ext.ux.parse.ParseAjax.request(requestOptions);
        } else {
            if (options.failure) {
                options.failure("ParseLibError: Unable to parse file", options);
            }
        }
    },

    uploadDataURI: function (dataURI, filename, fileType, options) {
        if (dataURI && filename && fileType) {
            var dataUriRegexp = /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);(charset=[a-zA-Z0-9\-\/\s]*,)?base64,(\S+)/,
            matches = dataUriRegexp.exec(dataURI),
            base64Source,
            requestOptions;

            if (matches && matches.length > 0) {
                // if data URI with charset, there will have 4 matches.
                if (matches.length === 4) {
                    base64Source = matches[3];
                } else {
                    base64Source = matches[2];
                }
            } else {
                if (options.failure) {
                    options.failure("Unable to parse base64 data", options);
                }
            }
            requestOptions = {
                url: this.FILE_URL_PATH + filename,
                method: 'POST',
                jsonData: {
                    'base64': base64Source,
                    '_ContentType': fileType
                }
            };

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
