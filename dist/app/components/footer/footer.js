(function(){
    'use strict'

    var footer = {
        controller: footerCtrl,
        templateUrl: 'app/components/footer/footer.html'
    }
    angular
        .module("jelpMi")
        .component("customFooter", footer);

    function footerCtrl() {
        var footer = this;
    }
})();