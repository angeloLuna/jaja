(function(){
    'use strict'

    var servicio = {
        controller: servicioCtrl,
        templateUrl: 'app/components/servicio/servicio.html'
    }

    angular
        .module("jelpMi")
        .component("servicioJelp", servicio);

    function servicioCtrl(authfire, $location){
        servicio = this;
        $(document).ready(function() {
            $('select').material_select();
        });
       
       if(!authfire.user){
          $location.path("/login");
        }
    }
})();