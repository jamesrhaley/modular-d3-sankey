import { margin, width, height } from './globals';
import myData from './data';
import theTip from './theTip';
import { sankeyObject } from './sankey';
import dataModel from './model';
import { linkStyles as pS } from './styles/style.link.js';
import BudgetLinks from './BudgetLinks';
import { nodeStyle  as rS } from './styles/style.node.js';
import BudgetNodes from './BudgetNodes';
import { labelStyles  as lS } from './styles/style.label.js';
import Labels from './Labels';
import {
    numSort,
    numberWithCommas,
    groupedAndSort,
    isEven
} from './utilities.js';


d3.sankey = sankeyObject;

//***************** set up variables *****************************// 


// var margin = {top: 50, right: 210, bottom: 10, left: 10},
//     width = 1160 - margin.left - margin.right,
//     height = 630 - margin.top - margin.bottom;

 
//***************** sankey plugin ********************************// 

var sankey, chart, obj, tip, tip2, fullValue, graph_links, 
    pick_all_rect, graph_labels, graph_rects, graph_headers, 
    all_Lables, catagory, current_info, allLinks, allNodes;

var format = function(d) { return "$" + numberWithCommas(d); };

//---------------- activate sankey plugin --------------------------

var sankeyTotal = 0;
var rightTotal = 0;
var middleTotal = 0;

obj = dataModel(myData);

sankey =  d3.sankey(width);

sankey.nodeWidth( 30 );

sankey.nodePadding( 4 );

sankey.size( [ width, height ] );

sankey.nodes( obj.eachNode );

sankey.links( obj.eachLink );

sankey.curvature( .01 );

sankey.layout();

fullValue = sankey.nodes();

fullValue.forEach( function (node, i) {

    if ( fullValue[i].sTag.length === 0 ) {
        sankeyTotal += fullValue[i].value;
    }

});


//---------------- create layout for the chart ------------------------------------

function Svg() {

    var svg = d3.select("#chart").append("svg")
            .attr({
                "width": width + margin.left + margin.right,
                "height": height + margin.top + margin.bottom
            })
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    return svg;

}

chart = new Svg();

  //---------------- activate theTip -------------------------------


function floorFigure(figure, decimals){
    if (!decimals) {
        decimals = 2;
    }
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};


tip = new theTip(width);

var grandTotal = sankeyTotal;

tip.attr( 'class', 'theTip' )
    .html( function ( d ) {
        var template_node = [ 
            "<span class='titleTip'>",
            d.name.toUpperCase(),
            "</span>",
            "<div class='drawline'></div>",
            "<span class='totalTip'><strong>Total: </strong>", 
            format(d.value),
            "</span><br>",
            "<span class='totalTip inRed'>",
            floorFigure(d.value/grandTotal*100, 3),
            "%",
            "<span class='budget'> of Budget </span>",
            "</span>"
        ];

        var print = template_node.join("");

        return print;

});

tip2 = new theTip(width);

tip2.attr( 'class', 'theTip' )
    .html( function ( d ) {
        var template_link = [
            "<span class='titleTip'>", 
            d.sourceName.toUpperCase(), 
            " → ", 
            d.targetName, 
            "</span>",
            "<div class='drawline'></div>",
            "<span class='totalTip'><strong>Total: </strong>", 
            format(d.value),
            "</span><br>",
            "<span class='totalTip inRed'>",
            floorFigure(d.value/grandTotal*100, 3),
            "%",
            "<span class='budget'> of Budget </span>",
            "</span>"
        ];

        var print = template_link.join("");

        return print;
            
});

// add tooltips to the chart
chart.call( theTip );

//---------------- links -----------------------------------------------------

graph_links = new BudgetLinks(
    chart,
    "#chart",
    sankey.links(), 
    sankey.linkPath(), 
    pS.link_init_style
);

graph_links
    .on( "mouseover", mouseover )
    .on( 'mouseout', mouseout )
    .on( 'mouseenter', tip2.show )
    .on( 'mouseleave', tip2.hide )
    .on( "touchstart", tip.show );

allLinks = d3.selectAll( "path" );

//---------------- nodes --------------------------------------------------------
// ***** all parts of the graph_rects creation ****** (rect)

graph_rects = new BudgetNodes(
    chart,
    "#chart",
    sankey.nodes()
);

//make the nodes
graph_rects
    .attr({ 
        "class": "node",
        "height": function ( d ) { return d.dy; },
        "width": sankey.nodeWidth() 
    })
    .style( "fill", function ( d, i ) { return d.theColor; } )
    .style( "stroke", function ( d ) { return d.strokeColor; } )
    .style( rS.node_base );


graph_rects.on( "mouseover", mouseover )
    .on( "mouseout", mouseout )
    .on( "mouseenter", tip.show )
    .on( "mouseleave" , tip.hide )
    .on( "touchstart", tip.show );

pick_all_rect = d3.selectAll( "rect" );



//---------------- labels --------------------------------------------------------
// ***** all parts of the graph_labels creation ****** (text)

graph_labels = new Labels(
    chart,
    'text',
    sankey.nodes()
);

graph_labels.append("text")
    .attr("class", "labels")
    .attr( "x", -6 )
    .attr( "y", function ( d ) { 
        if ( d.dy > 1.5 ) { 
            return d.dy / 2; 
        } else { 
            return 4 ; } 
    })
    .attr( "dy", ".35em" )
    .attr( "text-anchor", "end" )
    .attr( "transform", null )
    .text( function ( d ) { return d.name; } )
    .style( lS.label_style )
    // affects what side text is shown
    .filter( lS.filterWidth ) 
    .attr( "x", 6 + sankey.nodeWidth() )
    .attr( "text-anchor", "start" );

all_Lables = d3.selectAll( "text" );


var catagory = ["Revenue Source", "Fund", "Agency"];

graph_headers = new Labels(
    chart,
    'text',
    sankey.nodes()
);

graph_headers.append( "text" )
    .attr( "x", sankey.nodeWidth() )
    .attr( "text-anchor", "end" )
    .attr( "transform", null )
    .text( function ( d, i ) { if ( d.y === 0 ) { return catagory.shift(); } } )
    .attr( "y", function ( d ) { return d.y - 1 + "em" ; } )
    .style( "font-size", 24 + "px" )
    .style( "font-weight", 500)
    .filter( function( d ) { return d.x < width / 1.2; } ) 
    .attr( "x", 0 )
    .attr( "text-anchor", "start" );


var graph_values = new Labels(
    chart,
    'text',
    sankey.nodes()
);

var column_totals = new Array()



column_totals.push( sankeyTotal ); 
column_totals.push( middleTotal ); 
column_totals.push( rightTotal );

// console.log(column_totals);

graph_values.append( "text" )
    .attr( "x", sankey.nodeWidth() )
    .attr( "text-anchor", "end" )
    .attr( "transform", null )
    .text( function ( d, i ) { if ( d.y === 0 ) { return format( column_totals.shift() ); } } )
    .attr( "y", function ( d ) { return d.y - .4 + "em" ; } )
    .style( "font-size", "16px" )
    .style( "font-weight", 100)
    .filter( function( d ) { return d.x < width / 1.2; } ) 
    .attr( "x", 0 )
    .attr( "text-anchor", "start" );


//*************************** transitions ************************************

// link transitions *******************************************************


var durationHelp = function ( obj ) { // function affects the duration of transition for smaller links {thin links change fast}
        var dyValue = obj.dy * 100,
            timer = ( dyValue < 270 ) ? 70 : 400;

        return timer
    }


var link_over = function ( its, data, other_links, filtered_Nodes ) {

    var currentLink = data,
        targetLink = its,
        allNodes = d3.selectAll("rect"),
        locationSource = currentLink.sourceName,
        locationTarget = currentLink.targetName;
  
    targetLink.transition().duration( durationHelp( currentLink ))
        .style( pS.link_hovered );

    d3.timer.flush();

    other_links = d3.selectAll( "path" ).filter( function ( d ) { return d !== currentLink; } );
  
    other_links.transition().delay( 650 ).duration( 200 )
        .style( pS.link_not_hovered );

    filtered_Nodes = allNodes.filter( function ( d ) { // returns true or false making node lighten.  I need a better method
        var result1 = d.name === locationSource,
            result2 = d.name === locationTarget;
        if ( result1 ) { 
            return false;
        } else if ( result2 ) {
            return false;
        } else {
            return true;
        }
    });

    filtered_Nodes.transition( "node" )
            .duration( 750 )
        .style( rS.node_not_from_link );

    label_over_with_link( data );

}

var link_out = function ( its ) {
    
    var allLink = d3.selectAll( "path" ),
        allNodes = d3.selectAll( "rect" ),
        targetLink = its,
        other_links;
        //value;

    targetLink.transition()
        .style( pS.link_reset_style_1 )
            .duration(1500)
        .style( pS.link_reset_style_2 );

    d3.timer.flush();

    other_links = allLink.filter( function(d) { return d !== its.datum(); } );

    other_links.transition().duration( 900 )
        .style( pS.link_init_style );

    allNodes.transition( "node"  ).duration( 1500 )
        .style( rS.node_base );
    
    //value = current_info.getState()

    label_out_link();

}

// node transitions *******************************************************

var later = function ( data, locationName, other_nodes, filtered_Links, not_filtered_links ) {

    not_filtered_links = allLinks.filter( function ( d ) {
        var result1 = d.sourceName === locationName,
            result2 = d.targetName === locationName;
        if (!result1) { 
            return true;
        } else if (!result2) {
            return true;
        } else {
            return false;
            }
    });

    not_filtered_links.transition().delay( 150 ).duration( 850 )
        .style( pS.link_not_from_node );

    filtered_Links = allLinks.filter( function ( d ) {
        var result1 = d.sourceName === locationName,
            result2 = d.targetName === locationName;
        if (result1) { 
            return true;
        } else if (result2) {
            return true;
        } else {
            return false;
            }
    });

    filtered_Links.transition().delay( 110 ).duration( 850 )
        .style( pS.link_from_node );

    // loops through and returns true when not compValue
    other_nodes = pick_all_rect.filter( function ( d ) {
        return d !== data; 
    });

    other_nodes.transition( "node" ).delay( 300 ).duration( 800 )
        .style( rS.node_not_hovered );

}

var node_over = function ( its, data, other_nodes, filtered_Links, not_filtered_links ) {

    var locationName = data.name,
        i = 0;

    its.transition( "node" ).duration( 2 )
        .style( rS.node_hovered );

    d3.timer.flush();

    later( data, locationName, other_nodes, filtered_Links, not_filtered_links );


    label_over_with_node( data );
}

var node_out = function ( its ) {

    var allLinks = d3.selectAll( "path" ),
        othter_nodes,
        i = 0;

    its.transition( "node" ).duration( 250 )
        .style( rS.node_return );

    d3.timer.flush();

    allLinks.transition().delay( 110 ).duration( 940 )
        .style( pS.link_init_style );

    othter_nodes = pick_all_rect.filter( function ( d ) { return d !== its.datum(); });

    othter_nodes.transition( "node" ).delay( 500 )
        .style( rS.node_return );

    label_out_node();

}

// label transitions *******************************************************

var label_over_with_link = function ( data ) {

    //var data = its.datum(),
    // get source and targets
    var keep_label = [].concat( data.st, data.tt ).sort( numSort ),
        j = 0,
        m = 0,
        show_label,
        hide_label,

        hide = function (d) {
            var t = {};

                if ( d.num === keep_label[j] ) {
                    j++;
                } else {
                    t = d;
                    return t;
                }
        },

        show = function (d) {
                var t = {};

                if ( d.num === keep_label[m] ) {
                    m++;
                    return d;
                } else {
                    t = d;
                }
        };


    show_label = all_Lables.filter( show );

    //console.log( "show_label",all_Lables );

    show_label.transition( "text" ).delay( 900 )
        .style({
            "font-size": "17px", 
            "fill": "#000010",
            "pointer-events": "none"
        })
            .attr({
                "x": -6,
                "text-anchor": "end",
                "transform": null 
            })
        //seem to affect what side text is shown
        .filter( lS.filterWidth ) 
            .attr({ 
                "x": 6 + sankey.nodeWidth(),
                "text-anchor": "start", 
                "pointer-events": "none"
            });

    hide_label = all_Lables.filter( hide );

    hide_label.transition( "text" ).delay( 900 ).style({ "fill-opacity": 0, "pointer-events": "none" });

}

var calcDistanceAndSplit = function ( list2D, value ) {

    var lastY = 0,
        list = [],
        count = 0;

    list2D.forEach( function ( obj) {
        obj.forEach( function ( innerObj ) {
            //console.log( innerObj.y - lastY < value );
            if ( ( innerObj.y - lastY < value ) && ( innerObj.y - lastY > 0 ) ) {
                if ( isEven( count ) ) {
                    list.push( innerObj.num );
                    count++;
                } else {
                    count = 0;
                }
            } else {
                count = 0;
            }
            lastY = innerObj.y
        });
    });

    return list;

}

var label_over_with_node = function ( data ) {

    var keep_label = [].concat( data.num, data.sTag, data.tTag ).sort( numSort ),
        len = keep_label.length,
        size = (len > 7) ? lS.font_size_hover_group : "17px",
        j = 0,
        l = 0,
        m = 0,
        dataToFilter = [],
        show_label,
        hide_label,

        hide =  function (d) {
                        
                    var t = {};

                    if ( d.num === keep_label[j] ) {
                        j++;
                    } else {
                        t = d;
                        return t;
                    }
                },

        show =  function (d) {
                    
                    var t = {};

                    if ( d.num === keep_label[m] ) {
                        m++;
                        t = d;
                        dataToFilter.push( t );
                        return t;
                    } 
                };

    hide_label = all_Lables.filter( hide );

    hide_label.transition("text").delay( 1100 )
        .style({
            "fill-opacity": 0,
            "pointer-events": "none"
        });

    show_label = all_Lables.filter( show );

    if ( len < 12 ) {

        show_label.transition( "text" ).delay( 1100 )
            .style({
                "font-size": size, 
                "fill": "#000010",
                "pointer-events": "none"
            });

    } else {

        var sortedNumberList = groupedAndSort( dataToFilter, "x", "y", "up" ),

            sendOpposite = calcDistanceAndSplit( sortedNumberList, 10 ).sort( numSort ),

            otherway,

            change = function ( obj ) {

                        var g = {};

                        if ( obj.num === sendOpposite[l] ) {
                            l++;
                            g = obj;
                            return g;
                        }
                    };

        otherway = show_label.filter( change );

        show_label.transition("text").delay( 1100 )
            .style({
                "font-size": size,
                "fill": "#000010",
                "pointer-events": "none"
            });

        if ( data.x > width / 2 || data.x === 0 ) {

            otherway.transition("text").delay( 1100 )
                .attr({ 
                    "y": function ( d ) { return d.dy / 2; },
                    "x": -6, 
                    "text-anchor": "end"
                })
                .style({
                    "font-size": size,
                    "fill": "#000010",
                    "pointer-events": "none"
                });

        } else {

            otherway.transition("text").delay( 1100 )
                .attr({ 
                    "y": function ( d ) { return d.dy / 2; },
                    "x": 6 + sankey.nodeWidth(),
                    "text-anchor": "start" 
                })
                .style({ 
                    "font-size": size, 
                    "fill": "#000010",
                    "pointer-events": "none"
                });

        }
    }
}

function label_out_link() {
    
    all_Lables
        .transition( "text" ).delay( 200 )
                .style({ 
                    "fill-opacity": 1,
                     "font-size": lS.font_size,
                     "fill": lS.font_color,
                     "pointer-events": "none"
                 })
                .attr({
                    "x": -6,
                    "text-anchor": "end",
                    "transform": null 
                })
            .filter( lS.filterWidth ) 
                .attr({
                    "x": 6 + sankey.nodeWidth(),
                    "text-anchor": "start"
                });

}

function label_out_node() {

    all_Lables
        .transition( "text" ).delay( 200 )
            .style({ 
                "fill-opacity": 1, 
                "font-size": lS.font_size, 
                "fill": lS.font_color,
                "pointer-events": "none"
            })
        .transition()
                .attr({
                    "x": -6,
                    "text-anchor": "end",
                    "transform": null 
                })
            .filter( lS.filterWidth ) 
                .attr({
                    "x": 6 + sankey.nodeWidth(),
                    "text-anchor": "start" 
                });

}


//********************** controller ***************************
//
//
//
//************************************************************

function focus_on(its) {
    var data = its.datum();

    if ( data.type !== "link" ) {
        node_over( its, data );
    }
    else {
        link_over( its, data );
    }
}

function focus_out( its ) {

    if ( its.datum().type !== "link" ) {
        node_out( its );
    }
    else {
        link_out( its );
    }
}


function mouseover() {

    var target = d3.select( this );

    focus_on( target );
}

function mouseout() {

    var target = d3.select( this );

    focus_out( target );
}



