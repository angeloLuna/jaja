(function () {
  'use strict';

  var usuarios = {
    controller : usuariosCtrl,
    templateUrl : "app/components/usuarios/usuarios.html"
  };

  angular.module("jelpMiAdmin")
    .component("usuariosJelp", usuarios)

  usuarios.$inject = ["$firebaseObject", "authfire"]
  function usuariosCtrl($firebaseObject, authfire){
    var use = this;
    use.rama = "usuario";
    use.user = authfire.user

    var ref = firebase.database().ref(use.rama);

    var obj = $firebaseObject(ref);
    obj.$loaded().then(function(e) {
      use.usersArray2 = e;
    });

    //traemos los ususarios
    ref.orderByKey().on('value',
    function (e) {
      use.usersArray = e.val()
      console.log(use.usersArray)
      var i;

      //Revisamos si tiene servicios
      for (i in use.usersArray){
        if(use.usersArray[i].servicio){
          console.info("XD")
          use.usersArray[i].flagServicio = true;
        }
      }
    })

    use.test = function (user) {
      use.flagDetalle = true;
      use.detalleServicios = user.servicio;
    }
  }
})();