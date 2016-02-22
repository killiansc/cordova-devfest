(function () {
    'use strict';

    angular.module('conf.home', [])
        .controller('homeController', function(){

            var vm = this;

            vm.title = 'Application Conference';

            vm.goToAgenda = goToAgenda;
            vm.goToSessions = goToSessions;
            vm.goToSpeakers = goToSpeakers;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function pushPage(pageLocation) {
                app.navi.pushPage(pageLocation);
                app.menu.closeMenu();
            }

            function goToAgenda() {
                pushPage('modules/agenda/agenda.html');
            }

            function goToSessions() {
                pushPage('modules/session/sessions.html');
            }

            function goToSpeakers() {
                pushPage('modules/speaker/speakers.html');
            }

        });

})();



