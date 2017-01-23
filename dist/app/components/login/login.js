(function(){
    'use strict'

    var login = {
        controller: loginCtrl,
        templateUrl: 'app/components/login/login.html'
    }

    angular
        .module("jelpMi")
        .component("logIn", login)

    function loginCtrl($location , authfire){
      var login = this;
      login.auth = authfire;
      login.sended = null;
      login.sendPassword = null;
      // login.ejemplo = authjelpmi;

      console.log(authfire);

      function success(user){
        authfire.user = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        };
        $location.path('/')
      }


      login.tryAgain = function(){
        login.usuarioInvalido = false;
        login.correoInvalido = false;
      }

      login.olvidastePass = function(){
        login.sendPassword = true;
      }

      login.regresarLogin = function() {
        login.sendPassword = false;
      }

      login.tryAgainRecuperar = function(){
        login.userNotFound = false;
        login.invalidEmail = false;
      }
      login.sendPasswordReset = function() {
      login.auth.auth.$sendPasswordResetEmail(login.emailRecover)
      .then(function(){
          console.log("se ha enviado el correo")
          login.sended = true;
          login.sendPassword = false;
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/user-not-found') {
          login.userNotFound = true;
        } else if(errorCode = 'auth/invalid-email'){
          login.invalidEmail = true;
        }
        console.log(error);
        // [END_EXCLUDE]
      });
        // [END sendpasswordemail];
      }


      login.logIn = function(){
        login.auth.auth.$signInWithEmailAndPassword(login.email, login.password)
        .then(success).catch(function(error) {
          if(error.code == 'auth/user-not-found'){
            login.usuarioInvalido = true
          } else if(error.code == 'auth/invalid-email'){
          login.correoInvalido = true
          } else if(error.code == 'auth/wrong-password'){
            login.usuarioInvalido = true;
          }
          console.log(error.code)
        })
      }
    }
})();

