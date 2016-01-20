import theTip from './theTip';

//---------------- activate theTip ------------------------------------

export function makeTips(width, sankeyTotal){
    function floorFigure(figure, decimals){
        if (!decimals) decimals = 2;
        var d = Math.pow(10,decimals);
        return (parseInt(figure*d)/d).toFixed(decimals);
    };


    var tip1 = new theTip(width);

    var grandTotal = sankeyTotal;

    tip1.attr( 'class', 'theTip' )
        .html( function ( d ) {
            var template_node =   [ 
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
                        ],
                print = template_node.join("");

            return print;

    });

    var tip2 = new theTip(width);

    tip2.attr( 'class', 'theTip' )
        .html( function ( d ) {
            var template_link =   [
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
                        ],
                print = template_link.join("");

            return print;
                
    });

    return {
        one: tip1,
        two: tip2

    }
}