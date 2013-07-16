'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// // angular.module('myApp.services', [], function($provide){
//   $provide.factory('Pdx911',function($resource) {
// 	console.log("pdx911 factory called");
// 	    // Using the Angular resource call avoids some timing issues
//     // I was having.  Plus it's nice to use standards.
//     var Pdx911 = $resource('/api/pdx911',{method:'JSON'});

//     // // Get 911 data from server and tell it to load markers once
//     // // the data has arrived
//     return(Pdx911);

// });
// });
myApp.factory('Pdx911',function($resource) {
	console.log("pdx911 factory called");
	    // Using the Angular resource call avoids some timing issues
    // I was having.  Plus it's nice to use standards.
   var Pdx911 = $resource('/api/pdx911',{method:'JSON'});

    // // Get 911 data from server and tell it to load markers once
    // // the data has arrived
    return(Pdx911);
});