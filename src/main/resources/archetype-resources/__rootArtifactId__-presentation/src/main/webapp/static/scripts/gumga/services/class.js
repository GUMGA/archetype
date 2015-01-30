define([], function () {
    function e() {
    }
    return e.create = function (e) {
        e.hasOwnProperty("constructor") || (e.constructor = function () {
        });
        var t = e.constructor, n = e.extends || this, r = e.prototype || {}, i = t.prototype;
        t.prototype = Object.create(n.prototype), t.prototype.constructor = t, t.super = n.prototype, e.$inject && (t.$inject = e.$inject);
        for (var s in i)
            t.prototype[s] = i[s];
        for (var s in r)
            t.prototype[s] = r[s];
        return t
    }, e
});