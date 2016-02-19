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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SQLITE SERVICE //////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        .service('SQLiteService', ['$cordovaSQLite', function ($cordovaSQLite) {

            var db = openDb();

            return {
                getNotes: getNotes,
                saveNotes: saveNotes,
                getImages: getImages,
                saveImage: saveImage,
                getAudios: getAudios,
                saveAudio: saveAudio,
                getVideos: getVideos,
                saveVideo: saveVideo
            };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function openDb() {
                var db = $cordovaSQLite.openDB({name: 'conference.db'});
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS NOTES (sessionId text primary key, comment text)');
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS IMAGES (id integer primary key autoincrement, sessionId text, image text)');
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS AUDIOS (id integer primary key autoincrement, sessionId text, audio text)');
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS VIDEOS (id integer primary key autoincrement, sessionId text, video text)');
                return db;
            }

            function getNotes(sessionId) {
                var query = 'SELECT comment FROM NOTES WHERE sessionId=?';
                return $cordovaSQLite.execute(db, query, [sessionId]).then(
                    function (response) {
                        if (response.rows.length > 0) {
                            return response.rows.item(0).comment;
                        }
                        return '';
                    },
                    function (error) {
                        throw error;
                    }
                );
            }

            function getImages(sessionId) {
                var query = 'SELECT image FROM IMAGES WHERE sessionId=?';
                return $cordovaSQLite.execute(db, query, [sessionId]).then(
                    function (response) {
                        var images = [];
                        for (var i=0; i<response.rows.length; i++) {
                            images.push(response.rows.item(i).image);
                        }
                        return images;
                    },
                    function (error) {
                        throw error;
                    }
                );
            }

            function getAudios(sessionId) {
                var query = 'SELECT audio FROM AUDIOS WHERE sessionId=?';
                return $cordovaSQLite.execute(db, query, [sessionId]).then(
                    function (response) {
                        var audios = [];
                        for (var i=0; i<response.rows.length; i++) {
                            audios.push(response.rows.item(i).audio);
                        }
                        return audios;
                    },
                    function (error) {
                        throw error;
                    }
                );
            }

            function getVideos(sessionId) {
                var query = 'SELECT video FROM VIDEOS WHERE sessionId=?';
                return $cordovaSQLite.execute(db, query, [sessionId]).then(
                    function (response) {
                        var videos = [];
                        for (var i=0; i<response.rows.length; i++) {
                            videos.push(response.rows.item(i).video);
                        }
                        return videos;
                    },
                    function (error) {
                        throw error;
                    }
                );
            }

            function saveNotes(sessionId, notes) {
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO NOTES (sessionId, comment) VALUES (?, ?)', [sessionId, notes]);
            }

            function saveImage(sessionId, imageData) {
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO IMAGES (sessionId, image) VALUES (?, ?)', [sessionId, imageData]);
            }

            function saveAudio(sessionId, audioData) {
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO AUDIOS (sessionId, audio) VALUES (?, ?)', [sessionId, audioData]);
            }

            function saveVideo(sessionId, videoData) {
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO VIDEOS (sessionId, video) VALUES (?, ?)', [sessionId, videoData]);
            }

        }])

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PROGRAMMATION SERVICE ///////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        .service('ProgrammationService', ['$http', '$q', function ($http, $q) {

            var data;

            return {
                getSpeakers: getSpeakers,
                getSessions: getSessions
            };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function getData() {
                var conferences = localStorage.getItem('programmation');
                if (conferences) {
                    return $q(function (resolve, reject) {
                        resolve(JSON.parse(conferences));
                    });
                } else {
                    return $http.get('https://devfest2015.gdgnantes.com/assets/prog.json').then(
                        function (response) {
                            localStorage.setItem('programmation', JSON.stringify(response.data));
                            return response.data;
                        },
                        function (error) {
                            return $http.get('data/devfest-2015.json').then(
                                function (response) {
                                    localStorage.setItem('programmation', JSON.stringify(response.data));
                                    return response.data;
                                },
                                function (error) {
                                    throw error;
                                }
                            )
                        });
                }
            }

            function getSpeakers() {
                return getData().then(
                    function (programmation) {
                        return {
                            values: programmation.speakers
                        };
                    },
                    function (error) {
                        throw error;
                    });
            }

            function getSessions() {
                return getData().then(
                    function (programmation) {
                        return {
                            values: programmation.sessions,
                            categories: programmation.categories
                        };
                    },
                    function (error) {
                        throw error;
                    });
            }

        }]);

})();