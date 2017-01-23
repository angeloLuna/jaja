(function(){
    'use strict'
    var promos = {
        controller: promosCtrl,
        templateUrl: 'app/components/promociones/promo.html'
    }
    angular
        .module("jelpMi")
        .component("promosJelp", promos);

    promosCtrl.$inject = ["authfire", "$location", "$firebaseArray"];
    function promosCtrl(authfire, $location, $firebaseArray){
        var pro = this;
        pro.rama = "usuario"
        var ref = firebase.database().ref(pro.rama);
        pro.user = authfire.auth.$getAuth()
        var p = firebase.database().ref('promociones');
        var u = firebase.database().ref('usuario');
        var uid = pro.user.uid


        ref.child(pro.user.uid).on('value',
        function (data) {
          pro.userData = data.val()
          console.log(pro.userData)

          pro.promociones = function(){
            console.info("promociones")
            pro.promosRef = $firebaseArray(p);
            pro.usuarioRef = $firebaseArray(u);
            var promos = pro.userData.promociones
            var keyP;
            for (keyP in promos){
              if(pro.promoCode == promos[keyP].code){
                Materialize.toast('Ya has utilizado este código', 6000, 'purple darken-3');
                console.log("caha")
                pro.flagPromoUsada = true;
                break;
              }
            }if(!pro.flagPromoUsada){
              console.info("entrando")
              pro.promosRef.$loaded().then(function (promosArray) {
                console.log(promosArray)
                var d;
                for (d in promosArray){
                  if(pro.promoCode == promosArray[d].code){

                    pro.flagPromoValida = true;
                    pro.descPromo = promosArray[d].descripcion;
                    ref.child(pro.user.uid + "/promociones").push({
                      descripcion: promosArray[d].descripcion,
                      descuento : promosArray[d].descuento,
                      code : promosArray[d].code,
                      flag : false
                    })
                    break;
                  }
                }
              }).then(function (jaja) {
                console.log("hahaha", jaja)
                if(!pro.flagPromoValida){
                  Materialize.toast('Código inválido', 4000, 'purple darken-3')
                }else{
                  Materialize.toast('Código Válido, Ahora tienes: '+ pro.descPromo, 6000, 'purple darken-3');
                  pro.promo = false;
                  pro.flagPromoValida = false;
                }
              })
            }
          }



        })


    }

})();