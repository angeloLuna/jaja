// (function() {
//   'use strict';

//   angular
//     .module('jelpMi')
//     .factory('datosService', datosService);

//   datosService.$inject = ['$firebaseArray', 'firebaseDataService'];


//   function datosService($firebaseArray, firebaseDataService) {

//     var datos = null;
    
//     var service = {
//       personales: personales,
//       getPersonalesByUser: getPersonalesByUser
//     };

//     return service;

//     var personales = {
//       uid: uid,
//       email: email,
//       nombre: nombre,
//       apellido: apellido,
//       cumple: cumple,
//       calle: calle,
//       numExt: numExt,
//       numInt: numInt,
//       colonia: colonia,
//       delegacion: delegacion
//     }
//     ////////////
//     function getPersonalesByUser(uid) {
//       if (!datos) {
//         datos = $firebaseArray(firebaseDataService.datos.child(uid).child('datosPersonales'));
//       }
//       return datos;
//     }

//   }

// })();