(function () {
    'use strict';

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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SQLITE SERVICE //////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        .service('SQLiteService', ['$cordovaSQLite', function ($cordovaSQLite) {

            var db = openDb();

            return {
                getNotes: getNotes,
                upsert: upsert
            };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function openDb() {
                var db = $cordovaSQLite.openDB({name: 'conference.db'});
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS NOTES (sessionId text primary key, comment text)');
                return db;
            }

            function getNotes(sessionId) {
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
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO NOTES (sessionId, comment) VALUES (?, ?)', [sessionId, notes]);
            }

        }])

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // DATA SERVICE ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        .service('DataService', ['$http', '$q', function ($http, $q) {

            var data;

            return {
                getSpeakers: getSpeakers,
                getSessions: getSessions
            };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function getData() {
                var conferences = localStorage.getItem('conferences');
                if (conferences) {
                    return $q(function (resolve, reject) {
                        resolve(JSON.parse(conferences));
                    });
                } else {
                    return $http.get('https://devfest2015.gdgnantes.com/assets/prog.json').then(function (response) {
                        localStorage.setItem('conferences', JSON.stringify(response.data));
                        return response.data;
                    });
                }
            }

            function getSpeakers() {
                return getData().then(function (conferences) {
                    return {
                        values: conferences.speakers
                    };
                });
            }

            function getSessions() {
                return getData().then(function (conferences) {
                    return {
                        values: conferences.sessions,
                        categories: conferences.categories
                    };
                });
            }

        }]);

})();