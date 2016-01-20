var sankeyObject = function(width) {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [],
        curvature = .35;

    sankey.nodeWidth = function(_) {

        if (!arguments.length) {
            return nodeWidth;
        } else {
            nodeWidth = +_;
        }

    };

    sankey.nodePadding = function(_) {

        if (!arguments.length) {
            return nodePadding;
        } else {
            nodePadding = +_;
        }

    };

    sankey.nodes = function(_) {

        if (!arguments.length) {
            return nodes;
        } else {
            nodes = _;
        }

    };

    sankey.links = function(_) {

        if (!arguments.length) {
            return links;
        } else {
            links = _;
        }

    };

    sankey.size = function(_) {

        if (!arguments.length) {
            return size;
        } else {
            size = _;
        }

    };

    sankey.layout = function() {

        computeNodeLinks();
        addTagArrays();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths();
        computeLinkDepths();

    };

    sankey.curvature = function(_) {
        
        if (!arguments.length) {
            return curvature;
        } else {
            curvature = +_;
        }
    };

    sankey.relayout = function() {

        computeLinkDepths();

    };

    sankey.linkPath = function() {

        var curvature = sankey.curvature();

        function link(d) {

            var x0 = d.source.x + d.source.dx, 
                x1 = d.target.x, 
                xi = d3.interpolateNumber(x0, x1), 
                x2 = xi(curvature), 
                x3 = xi(1 - curvature), 
                y0 = d.source.y + d.sy + d.dy / 2, 
                y1 = d.target.y + d.ty + d.dy / 2; 
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;

        }

        return link;

    };


    function computeNodeLinks() {

        nodes.forEach(function(node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function(link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") {
                source = link.source = nodes[link.source];
            }
            if (typeof target === "number") {
                target = link.target = nodes[link.target];
            }
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });

    }

    function addTagArrays() { 

        nodes.forEach(function(node) {
            node.sTag = [];
            node.tTag = [];
        });
        links.forEach(function(link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") {
                source = link.source;
            }
            if (typeof target === "number") {
                target = link.target;
            }
            //console.log("link",source.num);
            source.tTag.push(link.tt);
            target.sTag.push(link.st);
        });

    }

    function computeNodeValues() {// somewhere rows should be figured out

        nodes.forEach(function(node) { // returns the node values.  Max is used to cancel duplicates
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value)
            );
        });

    }

      // var moveSourcesRight = function () {
      //   nodes.forEach(function(node) {
      //     if (!node.targetLinks.length) {
      //       node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      //     }
      //   });
      // }

    var moveSinksRight = function (x) { //this happenes : x the number of columns

        nodes.forEach(function(node) {// node is each one
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });

    }

    var scaleNodeBreadths = function (kx) { // in this case kx is 910

        nodes.forEach(function(node) {
            node.x *= kx;
        });

    }

    function computeNodeBreadths() { //pusts the x value on the node
    
        var remainingNodes = nodes,
            nextNodes,
            x = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function(node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function(link) {
                    nextNodes.push(link.target);
                });
            });
      
        remainingNodes = nextNodes;
      
        ++x;
        }

        //
        moveSinksRight(x);

        scaleNodeBreadths((width - nodeWidth) / (x - 1)); // origin of kx is width(940) - nodeWidth(30) / 1

    }

    function descendByKey(array, key) { //used to sort an object from largest number to smallest

        var result = array.sort(function(a, b) {
            var x = a[key],
                y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });

        return result;

    }

    function ascendByKey(array, key) { //used to sort an object from smallest number to largest

        var result = array.sort(function(a, b) {
            var x = a[key],
                y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

        return result;

    }

    function computeNodeDepths() {

        var nodeColumns = d3.nest() // this doesn't work
            .key(function(d) { return d.x; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function(d) { return d.values; });


        function initializeNodeDepth() {
            
            var ky = d3.min(nodeColumns, function(nodes) { // comes up with a number to calulate a constant to size by
                return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
            });

            //console.log(ky); // ky becomes 4.226550311220813e-8 for this particular graph
            nodeColumns.forEach(function(nodes) {
                //console.log("nodes",nodes.count ); //dy gets added here for nodes
                nodes.forEach(function(node, i) {
                    node.y = i;
                    node.count = i;
                    node.dy = node.value * ky;
                });
            });

            //console.log(nodeColumns);

            links.forEach(function(link) {
                link.dy = link.value * ky; //dy gets added here for links
            });

        }

        function resolveCollisions() {
            nodeColumns.forEach(function(nodes) {
                var node,
                    dy,
                    y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                //nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) { 
                        node.y += dy; 
                    }
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];

                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) { 
                            node.y -= dy; 
                        }
                        else { 
                            y0 = node.y; 
                        }
                        // or y0 = node.y; 
                    }
                }
            });
        }
        // nodeColumns[2][0].x = 303.3333333333333;
        //console.log( nodeColumns[2] );
        descendByKey(nodeColumns[0], "value");

        descendByKey(nodeColumns[1], "value");

        descendByKey(nodeColumns[2], "value");

        //nodeColumns[1].concat( nodeColumns[2] );


        //
        initializeNodeDepth();
        resolveCollisions();

    }

    function computeLinkDepths() { 

        nodes.forEach(function(node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
            ////console.log("this is where order is done",node.sourceLinks);
        });

        nodes.forEach(function(node) {
            var sy = 0, ty = 0;
            node.sourceLinks.forEach(function(link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function(link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;

        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }

    }

    // function center(node) {
    //   return node.y + node.dy / 3;
    // }

    function value(link) {

        return link.value;

    }

    return sankey;

};

// testValue = sankey.nodes()

// testValue.forEach( function (node, i) {

//     if ( testValue[i].tTag.length === 0 ) {
//         //console.log(testValue[i].tTag);
//         rightTotal += testValue[i].value;
//     }

// });

// testValue.forEach( function (node, i) {

//     if ( testValue[i].sTag.length > 0 && testValue[i].tTag.length > 0) {
//         middleTotal += testValue[i].value;
//     }

// });

// console.log( "sankeyTotal",sankeyTotal );

// console.log( "rightTotal", rightTotal );

// console.log( "middleTotal", middleTotal );

// console.log( "1. sankeyTotal - middleTotal", sankeyTotal - middleTotal );

// console.log( "2. middleTotal - rightTotal", middleTotal - rightTotal );

// console.log( "3. sankeyTotal - rightTotal", sankeyTotal - rightTotal );


export { sankeyObject };

