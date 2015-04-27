/**
 * Filter General Controller
 */
define(['./model'],function(FilterModel) {


    return function() {
        this.fields = [];
        this.selectedItems = [];

        this._isInvalidConditions = function(conditions) {
            if (!conditions) return true;
            if (!conditions.accepted) return true;
            return conditions.accepted.length === 0;
        };

        this._isDuplicatedField = function(field) {
            return (this._indexOf(field) >= 0);
        };

        this._indexOf = function(field) {
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].name == field) {
                    return i;
                }
            }
            return -1;
        };

        this._sortItemsByLabel = function() {
            this.fields.sort(function(a, b){
                return (a.label > b.label) ? 1 : -1;
            });
        };

        this.add = function(config) {
            if (!config.name) throw "Field value is required";
            if (this._isDuplicatedField(config.name)) throw "Duplicated filter field name";
            if (this._isInvalidConditions(config.conditions)) throw "Accepted conditions are required";

            config.label = config.label || config.name;
            config.conditions['default'] = config.conditions['default'] || config.conditions.accepted[0].type;

            this.fields.push(config);

            this._sortItemsByLabel();
        };

        this.get = function() {
            var filters = [];

            for (var i = 0; i < this.selectedItems.length; i++) {
                filters.push(this.selectedItems[i].get());
            }

            return filters;
        };

        this.set = function(filters) {


            if (!angular.isArray(filters))
                filters = [];

            this.selectedItems = [];

            for (var i = 0; i < filters.length; i++) {
                var f = filters[i];

                if (!f.field)
                    throw "The filter needs the field that will be filtered.";

                var index = this._indexOf(f.field);
                if (index < 0) throw "The field "+f.field+" does not exist!";

                var item = this.fields[index];
                this.addSelection(new FilterModel(item, f.condition, f.value, f.logicalOp));
            }

        };

        this.select = function(fieldName) {

            var index = this._indexOf(fieldName);
            if (index < 0) throw "The field "+fieldName+" does not exist!";

            var item = this.fields[index];

            var selection = new FilterModel(item);

            this.addSelection(selection);

        };

        this.addSelection = function(filter) {
            this.selectedItems.push(filter);
        };

        this.unselect = function(index) {
            this.selectedItems.splice(index, 1);
        };

    };

});