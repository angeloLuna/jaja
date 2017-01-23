(function(){
    'use strict'

    var registro = {
        controller: registroCtrl,
        templateUrl: 'app/components/registro/registro.html'
    }

    registroCtrl.$inject = [ '$location', 'authfire', '$firebaseArray', '$rootScope']

    function registroCtrl($location, authfire, $firebaseArray,$rootScope) {
      var reg = this;
      reg.auth = authfire;

      reg.tryAgain = function(){
        reg.emailUsed = false;
        reg.invalidEmail = false;
        console.log("si entra")
      }



      reg.registrar = function(){
        reg.auth.auth.$createUserWithEmailAndPassword(reg.email, reg.password)
        .then(function(result){
          reg.user = result;

          var usuario = {
              email: reg.user.email,
              nombre: reg.nombre,
              apellido: reg.apellido,
              uid: reg.user.uid,
              emailVerified : reg.user.emailVerified,
              profile : [],
              created : new Date()
          };
          var ref = firebase.database().ref('usuario');
          ref.child(reg.user.uid).set(usuario).then(
            function(response){
              $rootScope.$apply( function(){
                $location.path('/');
              })
            }
          );
        }).catch(function(error){
          reg.errorCode = error.code;
          reg.errorMessage = error.message;
          if(reg.errorCode =="auth/invalid-email"){
            reg.invalidEmail = true;
          }else if(reg.errorCode == "email-already-in-use"){
            reg.emailUsed = true;
          }
          console.log(error.code)
          console.log(reg.invalidEmail, reg.emailUsed)
        })
      }

      
    }


    angular
        .module("jelpMi")
        .component("registroJelp", registro);
})();