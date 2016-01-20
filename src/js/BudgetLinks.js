// create the base code that forms off of the links
function BudgetLinks(object ,objclass, data, linkPath, linkStyle) {

    var theLink = object.selectAll(objclass)
            .data( data )
        .enter().append( "path" )
            .attr({ 
                "class": "link",
                "d": linkPath
            })
            .style( linkStyle )
            .sort( function( a, b ) { return b.dy - a.dy; } );
            
    return theLink;

} 

export default BudgetLinks