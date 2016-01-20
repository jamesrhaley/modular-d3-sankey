var theTip = function(width) {
    var theTip = {},
        html = "",
        the_Doc = document,
        the_Doc_El = the_Doc.documentElement,
        the_Doc_Make_El = d3.select("body").append("div"),
        j = [],
        i, m = Math.max(the_Doc_El.clientWidth, window.innerWidth || 0),
        b = (m / 2) - (width / 2),
        e = (b <= 170) ? b : 170,
        initTip = function() {
            var n = the_Doc_Make_El;
            n.style({
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                boxSizing: "border-box"
            });
            return n.node()
        },
        node = initTip(),
        k = d3.select(node);
    theTip.show = function() {
        var p = d3.mouse(k.node().parentElement),
            o = (p[0]) - 250,
            n = (p[1]) - 120,
            u = b - 170,
            s = (o <= 0) ? 0 : (o >= u) ? o : u,
            t = (n >= 100) ? n : (p[1]) + 50,
            q = Array.prototype.slice.call(arguments),
            r = html.apply(this, q);
        k.html(r).style({
            opacity: 1,
            "pointer-events": "all",
            top: t + "px",
            left: s + "px"
        })
    };
    theTip.hide = function() {
        k.style({
            opacity: 0,
            "pointer-events": "none"
        })
    };
    theTip.html = function(n) {
        if (!arguments.length) {
            return html
        }
        html = null || d3.functor(n)
    };
    theTip.style = function(p, o) {
        if (arguments.length < 2 && typeof p === "string") {
            return k.style(p, o)
        }
        j = Array.prototype.slice.call(arguments);
        d3.selection.prototype.style.apply(k, j)
    };
    theTip.attr = function(p, o) {
        if (arguments.length < 2 && typeof p === "string") {
            return k.attr(p, o)
        }
        j = Array.prototype.slice.call(arguments);
        d3.selection.prototype.attr.apply(k, j);
        return theTip
    };
    return theTip
};

export default theTip;