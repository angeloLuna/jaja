(function(){
  'use strict'

  var datosServ = {
    controller: datosServCtrl,
    templateUrl: 'app/components/datos_servicio/datos_servicio.html'
  }

  angular
    .module("jelpMi")
    .component("datosServicio", datosServ)

  function datosServCtrl ($firebaseArray) {
    this.datos = [{
      correo: "angel.luna.najera@gmail.com",
      calle: "Aragon",
      calle1: "la herencia",
      calle2: "la cruz",
      colonia: "Santa Cruz Acalpixca",
      cp: "00000",
      delegacion: "Xochimilco",
      inicio: "11 Noviembre, 2016",
      numExterior: "01",
      numInterior: "2",
      periodicidad: "1",
    },
    {
      baño: "1",
      horno: "1"
    }
    ]
  }
})();