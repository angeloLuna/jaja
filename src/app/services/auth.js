(function(){
  angular
  .module("jelpMi")
  // .service("authjelpmi", authjelpmi)
  .service("authfire",authfire)




  // function authjelpmi($firebaseAuth, authfire){
  //   var auth = this;
  //   auth.authfire = authfire;
  //   auth.auth = $firebaseAuth();
  //   var sesion = null
  //   function deleteUser(){
  //     this.user = null;
  //   }

  //   function setUser(data , type){
  //     // console.info("ENVIANDO USUARIO");
  //     // console.log(data);
  //     this.user = {
  //           uid : data.uid,  
  //           email : data.email,
  //           emailVerified: data.emailVerified
  //           // emailVerified : setUser.emailVerified,
  //           // isAnonymous : user.isAnonymous,
  //     }
  //   }
  //   return {
  //     auth: auth.auth,
  //     user : setUser.user,
  //     setUser : setUser,
  //     deleteUser: deleteUser
  //   }
  // }


  function authfire($firebaseAuth,$location){
      var auth = this;
      auth.auth = $firebaseAuth();
      auth.user = null;
      auth.auth.$onAuthStateChanged(function(user){
        if(user){
          auth.user = {
            uid : user.uid,
            email : user.email,
            emailVerified : user.emailVerified
          }
          
          console.log("AUTH.js",auth.user)

        }
      }.bind(this))
      return auth.user
    }

})();