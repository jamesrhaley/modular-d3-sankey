export function numSort(a, b) {

    return a - b;

}

export function stringSort(a, b) {

    return a - b;

}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//used to sort an object from smallest number to largest
export function ascendByKey(array, key) {

    var result = array.sort(function(a, b) {
        var x = a[key],
            y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    return result;

}

//used to sort an object from largest number to smallest
export function descendByKey(array, key) {

    var result = array.sort(function(a, b) {
        var x = a[key],
            y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });

    return result;

}

//******************************************
//**
//**
//**  creates a nested object from from a key 
//**  that you choose.  The values of the key
//**  become the keys of the new object
//**

export function groupObjectByProperty(list, key) {

    var hash = {},
        len = list.length,
        i = 0;

    for ( i = 0; i < len; i++ ){
        var keyOfObject = list[i][key];

        if (!(keyOfObject in hash)) {
            hash[ keyOfObject ] = [];
        }

        hash[ keyOfObject ].push( list[i] );
    }

    return hash;

}

//******************************************
//**
//**
//**  creates a nested array from an object
//**  while using the keys of the object to create each array
//**

export function objectToNestArray( hash ) {

    return Object.keys( hash ).map( function ( key ) {
         return hash[ key ];
    });

}

//******************************************
//**
//**
//**  creates a nested object from from a key 
//**  that you choose.  The values of the key
//**  become the keys of the new object
//**


export function grouped( list, key ) {

    var hash = groupObjectByProperty( list, key );

    var obj = objectToNestArray( hash );

    return obj;

}

//******************************************
//**
//**  
//**  
//**  
//**  
//**

export function groupedAndSort( list, groupKey, sortKey, direction ) {

    var nestArray = {},
        message = "direction must be up or down, you have broken sort method in loop",
        sorter = direction === "up" ? ascendByKey 
                    : direction === "down" ? descendByKey 
                    : console.log(message);

    nestArray = grouped( list, groupKey );

    nestArray.forEach( function ( obj, count ) {
        sorter( obj, sortKey); 
    });

    return nestArray;

}

export function isEven( n ) {

    return !isNaN( n ) && (n % 2 == 0);

}