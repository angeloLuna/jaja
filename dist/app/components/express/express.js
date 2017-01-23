(function(){
  'use strict'

  var express = {
    controller: expressCtrl,
    templateUrl: 'app/components/express/express.html'
  }

  angular
    .module("jelpMi")
    .component("servicioExpress", express);

  expressCtrl.$inject = ["$location", "$firebaseArray", "$firebaseObject", "authfire","$http"];
  function expressCtrl( $location, $firebaseArray,$firebaseObject, authfire,$http){
    // Variables de inicialización
    var agen = this;
    agen.rama = "usuario"
    agen.tipo = "Exprés"
    var ref = firebase.database().ref(this.rama);
    var ref2 = firebase.database().ref("usuario/direcciones");
    var list = $firebaseArray;
    agen.user= authfire.auth.$getAuth()
    agen.adicionalesPedidos= [];
    var p = firebase.database().ref('promociones')
    var u = firebase.database().ref('usuario')
    agen.flagTieneDireccion = false;
    Stripe.setPublishableKey('pk_test_1PkYaL2DToc6huU4jBVjNPbw');
    console.log(agen.user)



    // Listener para ver si tienes direcciones guardadas (todas
    // las funciones viven dentro del listener para que las banderas se puedan
    // ejecutar a tiempo)
    ref.orderByKey().equalTo(agen.user.uid).on('value',
      function(data){

        // variables para acceder a los child de direcciones
        var k = agen.user.uid
        var direcciones = data.val()
        var perfil = direcciones[k];
        // validacion para ver si se tienen direcciones guardadas
        if (direcciones[k].direcciones) {
          agen.flagTieneDireccion = true;
          agen.mostrarDireccion = true;
          agen.direccionesArray = direcciones[k].direcciones
          var testCode = agen.direccionesArray
          var name;
          for (name in testCode){
            testCode[name].code = name
          }
        }else {
          // si ya tiene servicios pero no hay direcciones
          if (direcciones[k].servicio){
            agen.flagNecesitaDireccion = true;
            agen.flagTieneDireccion = true;
            agen.mostrarDireccion = true;
            agen.flagDireccionLocked = false;
          } else {

            agen.flagTieneDireccion = false;
            agen.mostrarDireccion = false;
          }

        }


        //banderas para el popup de aviso en tres horas..
        if (!agen.avisoPopSucces){
          // popup Aviso jelpmi en tres horas...
          agen.avisoPop = true;
          agen.avisoPopSucces = true;
        } else {
          // popup Adicionales
          agen.adicionales = false;
        }







        // Agregar una direccion en la base de datos
        agen.nuevaDireccion = function(){
          if (agen.calle1 == undefined){
            agen.calle1 = null;
          }

          if(agen.numInt == undefined){
            agen.numInt = null;
          }
          ref.child(agen.user.uid+"/direcciones").push({
            calle: agen.calle,
            numInt: agen.numInt,
            numExt: agen.numExt,
            cp: agen.cp,
            colonia: agen.colonia,
            delegacion: agen.delegacion,
            calle1 : agen.calle1,
          })
          agen.codeDireccion = null;
          agen.calle = null;
          agen.calle1 = null;
          agen.cp = null;
          agen.delegacion = null;
          agen.colonia = null;
          agen.numExt = null;
          agen.numInt = null;
          agen.flagNuevaDireccion = false;
          agen.mostrarDireccion = true;
          agen.flagNecesitaDireccion = false;
        }




        //muestra la dirección que elegiste en la lista de direcciones
        agen.selectDireccion = function(a){
          agen.direccionElegida = a;
          agen.codeDireccion = a.code;
          //Cambio de color de la tarjeta al ser seleccionada
          if (agen.fondoDireccion && agen.fondoDireccion2){
            agen.fondoDireccion2.style.backgroundColor = "#fff";
            agen.fondoDireccion2 = document.getElementById(a.code + "2");
            agen.fondoDireccion2.style.backgroundColor = "#b39ddb";
            agen.fondoDireccion.style.backgroundColor = "#fff";
            agen.fondoDireccion = document.getElementById(a.code);
            agen.fondoDireccion.style.backgroundColor = "#b39ddb";
          } else {
            agen.fondoDireccion2 = document.getElementById(a.code + "2");
            agen.fondoDireccion2.style.backgroundColor = "#b39ddb";
            agen.fondoDireccion = document.getElementById(a.code);
            agen.fondoDireccion.style.backgroundColor = "#b39ddb";
          }
          agen.flagDireccionLocked = true;
        }

        //Llena el formulario de editar dirección y cambia a la tarjeta de edicion de dirección
        agen.editarDireccion = function (a) {
          var dirObj = a;
          agen.codeDireccion = dirObj.code;
          agen.calle = dirObj.calle;
          agen.calle1 = dirObj.calle1;
          agen.cp = dirObj.cp;
          agen.delegacion = dirObj.delegacion;
          agen.colonia = dirObj.colonia;
          agen.numExt = dirObj.numExt;
          agen.numInt = dirObj.numInt;
          agen.mostrarDireccion = false;
          agen.editar = true;
        }


        //guarda los cambios de la direccion editada
        agen.guardarEditarDireccion = function () {
          if(agen.numInt == undefined){
            agen.numInt = null;
          }
          if(agen.calle1 == undefined){
            agen.calle1 = null;
          }
          ref.child(agen.user.uid).child("/direcciones").child(agen.codeDireccion).set({
            calle : agen.calle,
            calle1 : agen.calle1,
            cp : agen.cp,
            delegacion : agen.delegacion,
            colonia : agen.colonia,
            numExt : agen.numExt,
            numInt : agen.numInt
          })
          agen.mostrarDireccion = true;
          agen.editar = false;
        }

        //Borra la dirección
        agen.confirmarBorrarDireccion = function (direccion) {
          agen.flagBorrarDireccion = true;
          agen.direccionParaBorrar = direccion;

        }
        agen.borrarDireccion = function(){

          ref.child(agen.user.uid).child("/direcciones").child(agen.direccionParaBorrar.code).remove().then(
            function () {
            });
          agen.codeDireccion = null;
          agen.calle = null;
          agen.calle1 = null;
          agen.cp = null;
          agen.delegacion = null;
          agen.colonia = null;
          agen.numExt = null;
          agen.numInt = null;
          agen.flagSome = false;
        }

        //Limpia el formulario para que no muestre los datos de otra direccion
        agen.limpiarFormulario = function(){
          agen.codeDireccion = null;
          agen.calle = null;
          agen.calle1 = null;
          agen.cp = null;
          agen.delegacion = null;
          agen.colonia = null;
          agen.numExt = null;
          agen.numInt = null;
        }

        agen.console = function () {
          var _agen = [
            agen.codeDireccion,
            agen.calle,
            agen.calle1,
            agen.cp,
            agen.delegacion,
            agen.colonia,
            agen.numExt,
            agen.numInt,
          ]
        }



        // Trae los precios base de Firebase
        var config = firebase.database().ref('config');
        var obj = $firebaseObject(config);
        obj.$loaded().then(function(e) {
          agen.total = e.start_price_expres;
          agen.real_total = angular.copy(agen.total);
        });

        // referencia a los Adicionales en firebase
        var c = firebase.database().ref('adicionales');
        agen.catalogo = $firebaseArray(c);
        agen.items = agen.catalogo;
        agen.items.parcial = []
        console.log("chafa",agen.items.parcial)


        // Funciones para agregar o quitar adicionales
        agen.parcial = 0;
        agen.incremento = function(item){
          var signo = document.getElementById(item.code);
          if(item.count <6){
            signo.style.transform = "scale(1.5)"
            signo.style.color = "#ff1744"
            item.count +=1;
            item.partial += item.price_express;
            agen.real_total += item.price_express;
            //agen.sumaParcial()
          }
        }
        // agen.sumaParcial = function (a) {
        //
        //     var i;
        //     for (i in agen.items){
        //       if (agen.items[i].partial){
        //         agen.items.parcial[i] = agen.items[i].partial
        //       }else{
        //       }
        //     }
        //
        //   console.log(agen.items.parcial)
        // }
        agen.decremento = function(item){
          var signo = document.getElementById(item.code);
          if(item.count >0){
            item.count -=1;
            item.partial -= item.price_express;
            agen.real_total -= item.price_express;
          }
          if(item.count<=0){
            signo.style.transform = "scale(1)"
            signo.style.color = "#039be5";
            item.partial = null;

          }

        }



        // TODO: Impedir que se suban varias veces el mismo código.
        // Aplicar codigo promocional
        agen.promociones = function(){

          agen.promosRef = $firebaseArray(p)
          agen.usuarioRef = $firebaseArray(u)
          agen.promosRef.$loaded().then(
            function(x){
              var d
              for(d in x){
                if (x[d].code == agen.promoCode) {
                  agen.promoDetail = {

                  }
                  ref.child(agen.user.uid + "/promociones").push({
                    descripcion: x[d].descripcion,
                    descuento: x[d].descuento,
                    code: x[d].code
                  })
                  break
                }
              }
            })
        }


        //TODO: debe haber una direccion por lo menos
        agen.guardarServicio = function(){
          agen.codeServ = parseInt(Math.random()*100000)
          if(agen.direccionParaServicio.numInt == undefined){
            agen.direccionParaServicio.numInt = null;
          }
          if(agen.direccionParaServicio.calle1 == undefined){
            agen.direccionParaServicio.calle1 = null;
          }
          if(agen.direccionParaServicio.claveDireccion){
            ref.child(agen.user.uid+"/servicio").push({
              claveDireccion: agen.direccionParaServicio.claveDireccion,
              tipo: agen.tipo,
              token: agen.cardElegida.id,
              inicio: agen.inicio,
              codigo: agen.codeServ,
              hora: agen.hora,
              adicionales: agen.adicionalesPedidos,
            })
            agen.servicioGuardado = true;
          }else {
            ref.child(agen.user.uid+"/direcciones").push({
              calle: agen.direccionParaServicio.calle,
              numInt: agen.direccionParaServicio.numInt,
              numExt: agen.direccionParaServicio.numExt,
              cp: agen.direccionParaServicio.cp,
              colonia: agen.direccionParaServicio.colonia,
              delegacion: agen.direccionParaServicio.delegacion,
              calle1: agen.direccionParaServicio.calle1,
            }).then(function(data){
              var claveDireccion = data.key
              ref.child(agen.user.uid+"/servicio").push({
                claveDireccion: claveDireccion,
                token: agen.cardElegida.id,
                tipo: agen.tipo,
                codigo: agen.codeServ,
                inicio: agen.inicio,
                hora: agen.hora,
                adicionales: agen.adicionalesPedidos,
              })
              agen.servicioGuardado = true;
            }).catch(function (error) {
            })
          }
        }

        agen.regresarHome = function () {
          $location.path('/')
        }

        // TODO MANEJAR HORAS Y FECHAS PARA HACER LAS RESTRICCIONES
        // Enviar servicio agendado a firebase
        agen.enviarServicio = function(){

          agen.inicio = $('#agendado-inicio').pickadate().pickadate('picker').get()

          agen.horaClave = $('#agendado-horario').val()
          if (agen.horaClave == 1) {
            agen.hora = "7:00 am"
          } else if(agen.horaClave == 2) {
            agen.hora = "8:00 am"
          } else if(agen.horaClave == 3) {
            agen.hora = "9:00 am"
          } else if(agen.horaClave == 4) {
            agen.hora = "10:00 am"
          } else if(agen.horaClave == 5) {
            agen.hora = "11:00 am"
          } else if(agen.horaClave == 6) {
            agen.hora = "12:00 pm"
          } else if(agen.horaClave == 7) {
            agen.hora = "1:00 pm"
          } else if(agen.horaClave == 8) {
            agen.hora = "2:00 pm"
          } else if(agen.horaClave == 9) {
            agen.hora = "3:00 pm"
          } else if(agen.horaClave == 10) {
            agen.hora = "4:00 pm"
          } else if(agen.horaClave == 11) {
            agen.hora = "5:00 pm"
          } else if(agen.horaClave == 12) {
            agen.hora = "6:00 pm"
          } else if(agen.horaClave == 13) {
            agen.hora = "7:00 pm"
          }

          if(agen.hora && agen.inicio){
            //Validacion si es primera vez sin direccion o se eligio una direccion existente
            if (agen.flagTieneDireccion == false) {
              agen.direccionParaServicio = {
                calle : agen.calle,
                numExt : agen.numExt,
                numInt : agen.numInt,
                cp : agen.cp,
                delegacion : agen.delegacion,
                colonia : agen.colonia,
                calle1 : agen.calle1,
              }
              if (agen.numInt == undefined){
                agen.numInt = null;
              }
              if (agen.calle1 == undefined){
                agen.calle1 = null;
              }
            }else{
              agen.direccionParaServicio = {
                claveDireccion : agen.direccionElegida.code
              }
            }
            agen.segundoPaso = true;
          } else {
            alert("debes proporcionar fecha de inicio y Horario")
          }

          // var i;
          // for(i = 0; i<6; i++){
          //   if (agen.items[i].count > 0) {
          //     agen.adicionalesPedidos[i] = {
          //       code: agen.items[i].code,
          //       name: agen.items[i].name,
          //       count: agen.items[i].count,
          //       price: agen.items[i].price
          //     }
          //     // console.log(agen.items[i].name, agen.items[i].count)
          //   }
          // }


          //   ref.child(agen.user.uid+"/direcciones").push({
          //   calle: agen.calle,
          //   numInt: agen.numInt,
          //   numExt: agen.numExt,
          //   cp: agen.cp,
          //   colonia: agen.colonia,
          //   delegacion: agen.delegacion,
          //   calle1: agen.calle1,
          // }).then(function(data){
          //   var claveDireccion = data.key
          //   console.log(claveDireccion)
          //   ref.child(agen.user.uid+"/servicio").push({
          //     direccion: claveDireccion,
          //     tipo: agen.tipo,
          //     periodicidad: agen.periodo,
          //     inicio: agen.inicio,
          //     hora: agen.hora,
          //     adicionales: agen.adicionalesPedidos
          //   })
          // })

        }


        // function hola() {
        //   console.info("LOGS")
        //   console.log("avisoPop:",agen.avisoPop, "promo:",agen.promo, "succes:",agen.succes,
        //   "segundoPaso:", agen.segundoPaso, "editar:", agen.editar, "flagTieneDireccion", agen.flagTieneDireccion,
        //   "some", agen.some)
        // }
        // hola();
        // Inicializacion datepicker
        $('.datepicker').pickadate({
          labelMonthNext: 'Siguiente mes',
          labelMonthPrev: 'Mes anterior',
          labelMonthSelect: 'Elije un mes',
          labelYearSelect: 'Elije un año',
          monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
          monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
          weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado' ],
          weekdaysShort: [ 'Dom','Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab' ],
          weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
          today: false,
          clear: false,
          close: 'Listo',
          min: 1,
          max: 30
        });
        // inicialización material select
        $(document).ready(function() {
          $('select').material_select();
        });

        $(document).ready(function(){
          $('.tooltipped').tooltip({delay: 50});
        });

        $(document).ready(function(){
          $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });

        $(document).ready(function() {
          Materialize.updateTextFields();
        });

        $('input.autocomplete').autocomplete({
          data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'http://placehold.it/250x250'
          }
        });


        //Autocompletar Codigo postal
        agen.testCp = function (chales) {
          var cp = chales +"";
          var k;
          var i = 0;
          var colonia = []
          for(k in agen.json){
            if (cp == agen.json[k].d_codigo){
              colonia[i] = agen.json[k].d_asenta;
              agen.delegacion = agen.json[k].D_mnpio
              agen.coloniaArray = colonia;
              i++;
            }
          }
        }

        //STRIPE

        //Banderas para saber si tiene perfil de stripe
        if (perfil.perfilStripe){
          agen.flagPerfilStripe = true;
          var objStripe = {
            perfilStripe : perfil.perfilStripe
          }

          //Mandamos traer la informacion del cliente stripe
          $http.post("/retrieveCustomer",
            objStripe
          ).then(function (response) {
            console.log("user", response.data)

            //Si Hay una tarjeta guardada
            if (response.data.default_source){
              agen.flagMostrarTarjetas = true;
              var objCard = {
                card: response.data.default_source,
                perfilStripe: perfil.perfilStripe
              }

              //Trae las tarjetas
              $http.post("/retrieveCard",
                objCard)
                .then(function (res) {
                  agen.cardsArray = res.data.data
                  console.log("card",agen.cardsArray.length)
                  if(agen.cardsArray.length <= 1){
                    agen.flagUniqueCard = true;
                    agen.cardElegida = agen.cardsArray[0];
                    agen.codeCard = agen.cardsArray[0].id
                  } else{
                    agen.flagUniqueCard = false;
                  }

                })
            } else("caliente")
          })
        }


        //Elegir tarjeta
        agen.selectCard = function(a){
          console.log()
          agen.cardElegida = a;
          agen.codeCard = a.id;
          //Cambio de color de la tarjeta al ser seleccionada
          if (agen.fondoCard && agen.fondoCard2){
            agen.fondoCard2.style.backgroundColor = "#fff";
            agen.fondoCard2 = document.getElementById(a.id + "2");
            agen.fondoCard2.style.backgroundColor = "#b39ddb";
            agen.fondoCard.style.backgroundColor = "#fff";
            agen.fondoCard = document.getElementById(a.id);
            agen.fondoCard.style.backgroundColor = "#b39ddb";
          } else {
            agen.fondoCard2 = document.getElementById(a.id + "2");
            agen.fondoCard2.style.backgroundColor = "#b39ddb";
            agen.fondoCard = document.getElementById(a.id);
            agen.fondoCard.style.backgroundColor = "#b39ddb";
          }
          agen.flagCardLocked = true;
        }




        //TODO: manejar los errores de stripe

        agen.primeraVez = function () {
          //Creamos el token de la tarjeta
          Stripe.card.createToken({
            name: agen.pagoNombre,
            number: agen.pagoTarjetaNumero,
            cvc: agen.pagoTarjetaCcv,
            exp_month: agen.pagoTarjetaExpMes,
            exp_year: agen.pagoTarjetaExpAnio
          }, fillProfile1)
        };
        function fillProfile1(status, response) {
          //mandamos el correo y token de la tarjeta;
          if (!response.error){
            console.info("mandamos a stripe")
            agen.token = response.id;
            var obj = {
              stripeToken : response.id,
              email : agen.user.email,
            }
            //guardamos el Usuario
            $http.post(
              "createCustomer",
              obj
            ).then(function (request) {
              agen.pagoNombre = null;
              agen.pagoTarjetaNumero = null;
              agen.pagoTarjetaCcv = null;
              agen.pagoTarjetaExpMes = null;
              agen.pagoTarjetaExpAnio = null;
              ref.child(agen.user.uid).update({
                perfilStripe : request.data,
                tarjeta : true,

              })
            })
          }else{
            console.info("no se mandó")
          }
        }

        //Crear tarjeta
        agen.agregarPago = function () {
          //crear token
          Stripe.card.createToken({
            name: agen.pagoNombre,
            number: agen.pagoTarjetaNumero,
            cvc: agen.pagoTarjetaCcv,
            exp_month: agen.pagoTarjetaExpMes,
            exp_year: agen.pagoTarjetaExpAnio
          }, createCard)
          //crear tarjeta
          function createCard(status, response){
            console.log(response)
            if(!response.error){
              var obj = {
                stripeToken : response.id,
                email : agen.user.email,
                perfilStripe : perfil.perfilStripe
              }
              //Subimos la tarjeta
              $http.post("/createCard",
                obj
              ).then(function (respn) {
                console.log("-------------",respn)
                agen.pagoNombre = null;
                agen.pagoTarjetaNumero = null;
                agen.pagoTarjetaExpMes = null;
                agen.pagoTarjetaExpAnio = null;
                agen.pagoTarjetaCcv = null;
                agen.cardsArray = respn.data.data
                agen.flagMostrarTarjetas = true;
                if(agen.cardsArray.length > 1){
                  agen.flagUniqueCard = false;
                }
              })
            }

          }
        }



        //borrar tarjeta
        agen.confirmarBorrarTarjeta = function (card) {
          agen.flagBorrarTarjeta = true;
          agen.cardParaBorrar = card;
        }
        agen.borrarTarjeta = function () {
          var obj = {
            perfilStripe : perfil.perfilStripe,
            card : agen.cardParaBorrar
          }
          $http.post("/deleteCard",
            obj).then(function (response) {
            console.log(response)
            agen.cardsArray = response.data.data
            console.log("bye card");
            if(agen.cardsArray.length <= 1){
              agen.flagUniqueCard = true;
            } else {
              agen.flagUniqueCard = false;
            }
          })
        }









        //Bloque de checkout de stripe(la caja de cobro de stripe)

        // var handler = StripeCheckout.configure({
        //   // key: 'pk_2B0uf4NmDpGEP3kpIhBNVCELahUDd',
        //   key : 'pk_test_1PkYaL2DToc6huU4jBVjNPbw',
        //   image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        //   locale: 'auto',
        //   token: function(token) {
        //     agen.token = token.id;
        //     console.log(token);
        //     obj = {
        //       token : token.id,
        //       total : agen.real_total,
        //       email : agen.user.email
        //     }
        //     //agen.guardarServicio()
        //     $http.post(
        //       "/pay",
        //       obj
        //     ).then( function(request){
        //       console.log(request);
        //       agen.guardarServicio()
        //     });
        //     // You can access the token ID with `token.id`.
        //     // Get the token ID to your server-side code for use.
        //     console.log(agen.token)
        //   }
        // });
        //
        // agen.testPay = function () {
        //
        // }
        // // Close Checkout on page navigation:
        // window.addEventListener('popstate', function() {
        //   handler.close();
        // });
        //
        // agen.stripe = function () {
        //   // Open Checkout with further options:
        //   handler.open({
        //     name: 'Jelpmi',
        //     description: 'Jelpmi servicio agendado',
        //     currency: 'mxn',
        //     amount: agen.real_total*100,
        //     panelLabel : "Agendar"
        //   }, successPayment);
        //   console.log(handler)
        //   function successPayment(err,charge){
        //     console.log("XD",err,charge);
        //     console.log(agen);
        //   }
        // }


        //Bajar el usuario de stripe

        agen.testjaja = function () {

        }



        $.getJSON("app/json/catalogoCp.json", function(json) {
          agen.json = json;
        })
      })
  }
})();