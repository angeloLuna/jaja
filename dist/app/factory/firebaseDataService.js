(function(){
  'use strict'

  angular
    .module("jelpMi")
    .factory("firebaseDataService", firebaseDataService);

    function firebaseDataService() {
        var root = firebase.database().ref();
        
        var service = {
          root: root,
          datos: root.child('datosPersonales'),
          agendado: root.child('agendado'),
          express: root.child('express'),
        };

        return service;
      }
})();