(function(){
  'use strict'

  angular
    .module("jelpMi")
    .factory("personalesLogin", personalesLogin )

    function personalesLogin( $firebaseArray, authfire) {
      var x = 0;

      var service = {
        verificarPersonales: verificarPersonales,

      };

      return service;

      function verificarPersonales (uid){

        return flagDatos
      }
    }
})();