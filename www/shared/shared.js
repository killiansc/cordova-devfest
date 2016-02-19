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

    })
    .factory('SQLiteService', ['$cordovaSQLite', function ($cordovaSQLite) {

        var db;

        return {
            getNotes: getNotes,
            upsert: upsert
        };

        function openDb() {
            db = $cordovaSQLite.openDB({name: 'conference.db'});
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS NOTES (sessionId text primary key, comment text)');
        }

        function getNotes(sessionId) {
            if (!db) openDb();
            return $cordovaSQLite.execute(db, 'SELECT comment FROM NOTES WHERE sessionId=?', [sessionId]).then(
                function (response) {
                    if (response.rows.length > 0) {
                        return response.rows.item(0).comment;
                    }
                    return '';
                }
            );
        }

        function upsert(sessionId, notes) {
            if (!db) openDb();
            return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO NOTES (sessionId, comment) VALUES (?, ?)', [sessionId, notes]);
        }

    }]);