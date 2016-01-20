// create the base code that forms off of the rects
function BudgetNodes(object ,objclass, data) {

    var theNode = object.selectAll(objclass)
            .data(data)
        .enter().append( "rect" )
            // .attr( "class", "node" )
            .attr( "transform", 
                function ( d ) { return "translate(" + d.x + "," + d.y + ")"; 
            });

    return theNode;

}

export default BudgetNodes;