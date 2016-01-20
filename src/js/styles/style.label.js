// labelStyles = {}; // label styles
import { width } from './../globals';


var font_size = function ( d ) {
    if ( d.dy > 50 ) { 
        return '15px';
    } else if ( d.dy <= 1.5 ) {
        return '0px';
    } else if ( d.dy <= 3 ) {
        return '8px';
    } else if ( d.dy <= 4 ) {
        return '9.5px';
    } else if ( d.dy <= 8 ) {
        return '11px';
    } else if ( d.dy <= 20 ) {
        return '12.5px';
    } else {
        return '13px';
    }
};
var font_size_hover_group = function ( d ) {
    if ( d.dy > 50 ) { 
        return '17px';
    } else if ( d.dy <= 1.5 ) {
        return '9px';
    } else if ( d.dy <= 3 ) {
        return '10px';
    } else if ( d.dy <= 4 ) {
        return '10px';
    } else if ( d.dy <= 8 ) {
        return '13px';
    } else if ( d.dy <= 20 ) {
        return '14px';
    } else {
        return '16px';
    }
};


var font_color = function ( d ) {
  ////console.log("new d.dy",d.dy);
    if ( d.dy > 50 ) { 
        return "#000010";
    } else if ( d.dy <= 1.5 ) {
        return "#9AADB2"; //B7CDD4 B4CAD1 9AADB2
    } else if ( d.dy <= 3 ) {
        return "#343F47";
    } else if ( d.dy <= 8 ) {
        return "#252D33";
    } else if ( d.dy <= 20 ) {
        return "#14191C";
    } else {
        return "#111417";
    }
};

var font_opacity = function ( d ) { 
    if ( d.dy < 1.5 ) { 
        return 0 ; 
    } 
};

var labelStyles = {

    font_size : font_size,

    font_size_hover_group : font_size_hover_group,

    font_color: font_color,

    font_opacity: font_opacity,

    label_style : {
        "font-size": font_size,
        "fill": "#000010",
        "pointer-events": "none",
        "z-index": 10,
        "text-shadow": 0 + "" +1 + "px " + 0 + " #fff"
    }
};


labelStyles.filterWidth =  function ( d ) { return d.x < width / 2; }

export { labelStyles }