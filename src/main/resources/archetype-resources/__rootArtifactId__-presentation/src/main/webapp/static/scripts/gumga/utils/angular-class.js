define(["require", "gumga-class"], function (e) {
    var t = function () {
    };
    return t.create = function (t) {
        var n = t.extends;
        if (n) {
            t.$inject = (t.$inject || []).concat(n.$inject);
            if (n.prototype.initialize) {
                var r = n.prototype.initialize, i = t.prototype.initialize || function () {
                };
                t.prototype.initialize = function () {
                    r.call(this), i.call(this)
                }
            }
        }
        return t.constructor = function () {
            var e = this.constructor.$inject;
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                this[n] = arguments[t]
            }
            this.initialize && this.initialize()
        }, e("gumga-class").create(t)
    }, t
});