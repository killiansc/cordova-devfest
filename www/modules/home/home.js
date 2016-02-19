angular.module('conf.home', [])
    .controller('homeController', function(){
        var vm = this;

        vm.title = 'Application Conference';
        vm.goToSessions = goToSessions;
        vm.goToSpeakers = goToSpeakers;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function pushPage(pageLocation) {
            app.navi.pushPage(pageLocation);
            app.menu.closeMenu();
        }

        function goToSessions() {
            pushPage('modules/session/sessions.html');
        }

        function goToSpeakers() {
            pushPage('modules/speaker/speakers.html');
        }

    });



