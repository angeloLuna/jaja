(function(){
  'use strict'

  var datos = {
    controller: datosCtrl,
    templateUrl: 'app/components/datos/datos.html',
  }
  angular
    .module("jelpMi")
    .component("misDatos", datos)

    datosCtrl.$inject =["$firebaseArray", "authfire"]
    function datosCtrl($firebaseArray, authfire){
      // Inicializar valores de firebase
      var datos = this;
      datos.rama = "usuario"
      var ref = firebase.database().ref(this.rama);
      datos.auth = authfire;
      var list = $firebaseArray(ref);
      datos.user = authfire.auth.$getAuth()
      datos.personales = list;
      datos.subidos = list;
      datos.noprofile = false;
      // Variables para mostrar u ocultar la edicion de los datos
      datos.editBasicos = false;
      datos.editDireccion = false;


      ref.orderByKey().equalTo(authfire.user.uid).on('value',
        function(data){
          var _user = data.val();
          var k = authfire.user.uid;
          console.log(_user);
          var userObj = _user[k]
          datos.nombre = _user[k].nombre;
          datos.apellido = _user[k].apellido;
          datos.direccionesArray = userObj.direcciones;
          console.log(datos.direccionesArray)
          var m;
          for (m in datos.direccionesArray){
            datos.direccionesArray[m].code = m;
          }

          // Direcciones
          if (userObj.direcciones){
            console.log("tiene direcciones")
            datos.flagDireccionExistente = true;
            datos.flagMostrarDireccion = true;
          } else{
            console.log("no tiene nariz de perro gris")
            datos.flagDireccionExistente = false;
            datos.flagMostrarDireccion = true;
          }
        }
      );

      datos.editarNombre = function () {
        ref.child(authfire.user.uid).update({
          nombre: datos.nombre,
          apellido: datos.apellido
        })
      }

      datos.confirmarBorrarDireccion = function (direccion) {
        datos.flagBorrarDireccion = true;
        datos.direccionParaBorrar = direccion;
        console.log(direccion)

      }
      //Autocompletar Codigo postal
      datos.testCp = function (chales) {
        var cp = chales +"";
        console.log(cp.substr(0, 1))
        console.log("iralo", cp)
        var k;
        var i = 0;
        var colonia = []
        for(k in datos.json){
          if (cp == datos.json[k].d_codigo){
            colonia[i] = datos.json[k].d_asenta;
            datos.delegacion = datos.json[k].D_mnpio
            console.log("encontrado bitches", datos.json[k].d_asenta)
            datos.coloniaArray = colonia;
            console.log("agen.colonia",datos.coloniaArray)
            console.log(datos.colonia)
            i++;
          }
        }
      }

      datos.borrarDireccion = function(){
        console.log(datos.direccionParaBorrar.code)
        ref.child(authfire.user.uid).child("/direcciones").child(datos.direccionParaBorrar.code).remove().then(
          function () {
            console.log("XD borrado")
          });
        datos.codeDireccion = null;
        datos.calle = null;
        datos.calle1 = null;
        datos.cp = null;
        datos.delegacion = null;
        datos.colonia = null;
        datos.numExt = null;
        datos.numInt = null;
        datos.flagSome = false;
        console.log("---------------a-",ref.child(datos.user.uid).child("/direcciones"))
      }
      $.getJSON("app/json/catalogoCp.json", function(json) {
        datos.json = json;
      })

      datos.guardarEditarDireccion = function () {
        if(datos.numInt == undefined){
          datos.numInt = null;
        }
        if(datos.calle1 == undefined){
          datos.calle1 = null;
        }
        ref.child(datos.user.uid).child("/direcciones").child(datos.codeDireccion).set({
          calle : datos.calle,
          calle1 : datos.calle1,
          cp : datos.cp,
          delegacion : datos.delegacion,
          colonia : datos.colonia,
          numExt : datos.numExt,
          numInt : datos.numInt
        })
        datos.flagMostrarDireccion = true;
        datos.flagEditar = false;
      }

      datos.limpiarFormulario = function(){
        datos.codeDireccion = null;
        datos.calle = null;
        datos.calle1 = null;
        datos.cp = null;
        datos.delegacion = null;
        datos.colonia = null;
        datos.numExt = null;
        datos.numInt = null;
      }

      datos.editarDireccion = function (a) {
        var dirObj = a;
        datos.codeDireccion = dirObj.code;
        datos.calle = dirObj.calle;
        datos.calle1 = dirObj.calle1;
        datos.cp = dirObj.cp;
        datos.delegacion = dirObj.delegacion;
        datos.colonia = dirObj.colonia;
        datos.numExt = dirObj.numExt;
        datos.numInt = dirObj.numInt;
        datos.flagMostrarDireccion = false;
        datos.flagEditar = true;
      }
      datos.nuevaDireccion = function () {
        if(datos.numInt == undefined){
          datos.numInt = null;
        }
        if(datos.calle1 == undefined){
          datos.calle1 = null;
        }
        ref.child(authfire.user.uid + "/direcciones").push({
          calle: datos.calle,
          numInt: datos.numInt,
          numExt: datos.numExt,
          colonia: datos.colonia,
          delegacion: datos.delegacion,
          cp: datos.cp,
          calle1: datos.calle1,
        })
        datos.flagNuevaDireccion = false;
      }

    }
})();