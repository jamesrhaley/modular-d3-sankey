// helpers
var link_stroke_width = function ( d ) {
    return Math.max( 2, d.dy );
};

var link_stroke_width_hover = function( d ) {
    return Math.max( 4, d.dy );
};

var link_color = function (d, i) {
    if ( d.value > 3000000 ) {
        return d.theColor;
    } else {
        return d3.rgb( d.theColor ).darker( 2.5 );
    }
};

//styles
var linkStyles = {
    link_init_style : { 
        "fill": "none", 
        "stroke-opacity": 0.15, 
        "stroke-width": link_stroke_width, 
        "stroke": link_color
    },

    link_reset_style_1 : { 
        "stroke-opacity": 0.15
    },

    link_reset_style_2 : { 
        "stroke-width": link_stroke_width, 
        "stroke": link_color 
    },

    link_hovered :       {
        "stroke-opacity": 0.6,
        "stroke-width": link_stroke_width_hover
    },

    link_not_hovered :   {
        "stroke-width": link_stroke_width, 
        "stroke-opacity": 0.05
    },

    link_from_node :     {
        "stroke-opacity": 0.5,
        "stroke-width": link_stroke_width
    },

    link_not_from_node : {
        "stroke-opacity": 0,
        "stroke-width": link_stroke_width
    }
};

export { linkStyles };