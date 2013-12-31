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
 * A utility class for working with Parse Relations.
 *
 * @author Tyler Wolf
 */
Ext.define("Ext.ux.parse.util.Relation", {
    singleton: true,

    /**
     * Generates the operation object for adding one or more objects to a relation field.
     * @param {String} className The Parse class name of the object being added.
     * @param {Number/Number[]} relationIds The IDs of the object or objects being added.
     * @returns {Object} The operation object.  Suitable for being assigned to the field of the model
     * corresponding to the relation.
     */
    generateAddRelationPointer: function (className, relationIds) {
        return Ext.ux.parse.util.Relation._generateRelationPointerOperation(className, relationIds, 'AddRelation');
    },

    /**
     * Generates the operation object for removing one or more objects from a relation field.
     * @param {String} className The Parse class name of the object being removed.
     * @param {Number/Number[]} relationIds The IDs of the object or objects being removed.
     * @returns {Object} The operation object.  Suitable for being assigned to the field of the model
     * corresponding to the relation.
     */
    generateRemoveRelationPointer: function (className, relationIds) {
        return Ext.ux.parse.util.Relation._generateRelationPointerOperation(className, relationIds, 'RemoveRelation');
    },

    /**
     * Helper function for composing a relation update operation object
     * @param {String} className The Parse class name of the object being added or removed.
     * @param {Number/Number[]} relationIds The IDs of the object or objects being added or removed.
     * @param {String} operation The operation name.
     * @returns {{__op: *, objects: Array}} The operation object.
     * @private
     */
    _generateRelationPointerOperation: function (className, relationIds, operation) {
        var relationIdArray = Ext.Array.from(relationIds),
            relationPointerArray = [];

        Ext.Array.each(relationIdArray, function (relationId) {
            relationPointerArray.push(Ext.ux.parse.util.Relation._generateRelationPointer(className, relationId));
        });

        return {
            '__op': operation,
            'objects': relationPointerArray
        };
    },

    /**
     * Helper function for constructing a relation update object pointer representation.
     * @param {String} className The Parse class name of the object being added or removed.
     * @param id The ID of the object being added or removed.
     * @returns {{__type: string, className: *, objectId: *}} The object pointer representation.
     * @private
     */
    _generateRelationPointer: function (className, id) {
        return {
            '__type': 'Pointer',
            'className': className,
            'objectId': id
        };
    }

});