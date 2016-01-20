//********************** model *******************************
//
//
//
//************************************************************


function dataModel(d1) {
    var color = d3.scale.category20();
    var obj =   { 
                    "eachNode" : [], 
                    "eachLink" : [], 
                    "fullList" : [] 
                },
        
        next = d1;

   //  var next = d1.filter( function ( row ) {
        
   //      return (row[ "source" ] === "ELEMENTARY and SECONDARY EDUCATION");// && (row[ "value" ] < 100000);

    // });

    var next = d1.filter( function ( row ) {

        return row[ "value" ] > 0;
    });

    next.sort(function(a, b){
        return b.value - a.value;
    });

    next.forEach( function ( d ) {
        obj.eachNode.push({  "name": d.source });
        obj.eachNode.push({  "name": d.target });
        obj.eachLink.push({     
                            "source": d.source,
                            "target": d.target,
                            "sourceName": d.source,
                            "targetName": d.target,
                            "st": undefined,
                            "tt": undefined,
                            "theColor": undefined,
                            "num": 0,
                            "type": "link",
                            "value": +d.value 
                        });
    });

        // return only the distinct / unique eachNode
    obj.eachNode = d3.keys( d3.nest()
        .key(function (d) { return d.name; })
        .map( obj.eachNode )
    );

    // loop through each link replacing the text with its index from node
    obj.eachLink.forEach( function ( d, i ) {
        obj.eachLink[ i ].source = obj.eachNode.indexOf( obj.eachLink[ i ].source );
        obj.eachLink[ i ].theColor = obj.eachLink[ i ].source;
        obj.eachLink[ i ].target = obj.eachNode.indexOf( obj.eachLink[ i ].target );
        obj.eachLink[ i ].num = i;
    });

    obj.eachLink.forEach( function ( d, i ) {
        obj.eachLink[ i ].st = obj.eachLink[ i ].source
        obj.eachLink[ i ].tt = obj.eachLink[ i ].target
        //console.log(d);
    });

    // adds the colors to the nodes
    obj.eachNode.forEach(function ( d, i ) {
        obj.eachNode[ i ] =  { 
                                "name": d,
                                "theColor": color(i),
                                "strokeColor": undefined,
                                "num": i 
                            };
    });

    obj.eachNode.forEach( function ( d, i ) {
        var result = d3.rgb( obj.eachNode[ i ].theColor ).darker( 0.3 );
        obj.eachNode[ i ].strokeColor = result;
    });


        // function to get all of the colors to the links
    obj.eachLink.forEach( function ( d, i ) {
        obj.eachLink[ i ].theColor = obj.eachNode[ obj.eachLink[ i ].theColor ].theColor;
    });

  return obj;

}

export default dataModel;