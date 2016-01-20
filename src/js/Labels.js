function Labels(object, objclass, data) {

    var theLabel = object.append( "g" ).selectAll(objclass)
            .data(data)
        .enter().append( "g" )
            .attr({
                "class": "words",
                "transform":
                function ( d ) { 
                    return "translate(" + d.x + "," + d.y + ")"; 
                }
            });

    return theLabel;

}

export default Labels