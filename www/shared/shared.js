angular.module('conf.shared', [])
    .controller('menuController', function () {

        var pushPage = function (pageLocation) {
            app.navi.pushPage(pageLocation);
            app.menu.closeMenu();
        };

        this.goToSessions = function () {
            pushPage('modules/session/sessions.html');
        };
        this.goToSpeakers = function () {
            pushPage('modules/speaker/speakers.html');
        };
        this.goToHome = function () {
            app.menu.setMainPage('modules/home/home.html', {closeMenu: true});
        };
        this.goToTechniques = function () {
            pushPage('modules/technique/techniques.html');
        };
        this.goToAbout = function () {
            pushPage('modules/about/about.html');
        };

    });

// TODO - Ajouter ici des services transverses à tous les modules