angular.module('conf.home', [])
    .controller('homeController', function(){
        this.title = 'Application Conference';

        var pushPage = function(pageLocation) {
            app.navi.pushPage(pageLocation);
            app.menu.closeMenu();
        };

        this.goToSessions = function() { pushPage('modules/session/sessions.html');};
        this.goToSpeakers = function() { pushPage('modules/speaker/speakers.html');};

    });



