// helpers
var node_stroke_width = function ( d ) {
    var value = parseFloat(d.dy) * 100,
        num = ( value < 270 ) ? "6px" : "2px";

    return num;
};

//styles
var nodeStyle = {
    node_base : {
        "stroke-opacity": 1.0,
        "fill-opacity": 0.8,
        "shape-rendering": "crispEdges",
        "overflow": "visible",
        "stroke-width": "1px",
        "z-index": 1000
    },

    node_hovered : {
        "fill-opacity": 0.7,
        "stroke-width": node_stroke_width,
        "z-index": -100
    },

    node_not_hovered : {
        "stroke-width": "1px",
        "stroke-opacity": 1.0,
        "fill-opacity": 1e-6
    },

    node_from_link : {
        "stroke-width": "1px",
        "stroke-opacity": 1.0,
        "fill-opacity": 0.6
    },


    node_not_from_link : {
        "stroke-opacity": 0.6,
        "stroke-width": "1px",
        "fill-opacity": 1e-6
    },

    node_return : {
        "fill-opacity": 0.8,
        "stroke-opacity": 1.0,
        "stroke-width": "1px"
    }
}

export { nodeStyle }