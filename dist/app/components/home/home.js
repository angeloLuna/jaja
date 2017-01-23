(function() {
    'use strict'
    var home = {
        controller: homeCtrl,
        templateUrl: 'app/components/home/home.html',
    }

    angular
        .module("jelpMi")
        .component("homeJelp", home)

    homeCtrl.$inject = ["authfire","$location", "$firebaseArray", "$firebaseObject"]
    function homeCtrl(authfire,$location, $firebaseArray){
      home = this;
      var ref = firebase.database().ref("usuario");
      home.user = authfire.auth.$getAuth()


      // ref.orderByKey().equalTo(authfire.user.uid).on('value',
      //   function(data){
      //     var _user = data.val();
      //     if(typeof _user[authfire.user.uid].profile == "undefined" ) {
      //       console.log("REDIRECT");
      //       $location.path("/datos");
      //     }
      //   }
      // )

      //Obtener datos del servicio
      ref.orderByKey().equalTo(home.user.uid).on('value',
        function(data){
          console.info("iniciando validacion")
          home.datosUsuario = data.val()
          if(home.datosUsuario[home.user.uid].servicio){
            home.servicio = true;
            home.servicioDetalle = home.datosUsuario[home.user.uid].servicio;
            console.log("-.-", home.datosUsuario[home.user.uid].servicio);

            //Variables para acceder al arreglo de servicios
            var uid = home.user.uid;
            var datos = data.val()
            var serviciosArray = datos[uid].servicio;
            var direccionesArray = datos[uid].direcciones;
            //Meter el id del servicio dentro del objeto del servicio
            console.log("direcciones", direccionesArray)
            var key;
            var claveDireccion;
            var servicio;
            for(key in serviciosArray){
              servicio = serviciosArray[key]
              servicio.code = key;
              claveDireccion = servicio.claveDireccion;
              servicio.direccion = direccionesArray[claveDireccion]
              console.log("clave direccion", claveDireccion);
              console.log("servicio", servicio);
              console.log("direccion")

            }

          } else{
            home.servicio = false
            console.log("XD")
          }
        })

      home.detalleServicio = function (servicio) {
        console.log(servicio)
        home.flagDetalleServicio = true;
        home.detalle = servicio;
      }

      home.pedirOtroServicio = function () {
        console.log(":v")
      }

      home.popUpOnAgen = function(){
        home.popupAgen = true;
        home.hidenHome = true;
        console.log("el popup se está llamando")
      }

      home.popUpExp = function(){
        home.popup = false;
        $location.path("/express")
        console.log("popup funcionando");
      }

      home.popUpOnExp = function(){
        home.popupExp = true;
        home.hidenHome = true;
        console.log("el popup se está llamando")
      }


      $(document).ready(function(){
        $('.scrollspy').scrollSpy();
      });

    }
})();