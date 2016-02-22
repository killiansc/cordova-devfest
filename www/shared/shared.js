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
                saveVideo: saveVideo,
                removeImage: removeImage
            };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function openDb() {
                var db = $cordovaSQLite.openDB({name: 'conference.db'});
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS NOTES (sessionId text primary key, comment text)');
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS MEDIAS (id integer primary key autoincrement, type text, sessionId text, content text)');
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

            function saveNotes(sessionId, notes) {
                return $cordovaSQLite.execute(db, 'INSERT OR REPLACE INTO NOTES (sessionId, comment) VALUES (?, ?)', [sessionId, notes]);
            }

            function getMedia(sessionId, type) {
                var query = 'SELECT content FROM MEDIAS WHERE sessionId=? and type=?';
                return $cordovaSQLite.execute(db, query, [sessionId, type]).then(
                    function (response) {
                        var images = [];
                        for (var i=0; i<response.rows.length; i++) {
                            images.push(response.rows.item(i).content);
                        }
                        return images;
                    },
                    function (error) {
                        throw error;
                    }
                );
            }

            function getImages(sessionId) {
                return getMedia(sessionId, "image");
            }

            function getAudios(sessionId) {
                return getMedia(sessionId, "audio");
            }

            function getVideos(sessionId) {
                return getMedia(sessionId, "video");
            }

            function saveMedia(sessionId, data, type) {
                var query = 'INSERT OR REPLACE INTO MEDIAS (sessionId, content, type) VALUES (?, ?, ?)';
                return $cordovaSQLite.execute(db, query, [sessionId, data, type]);
            }

            function saveImage(sessionId, imageData) {
                return saveMedia(sessionId, imageData, "image");
            }

            function saveAudio(sessionId, audioData) {
                return saveMedia(sessionId, audioData, "audio");
            }

            function saveVideo(sessionId, saveData) {
                return saveMedia(sessionId, saveData, "video");
            }

            function removeMedia(sessionId, data, type) {
                var query = 'DELETE FROM MEDIAS WHERE sessionId=? AND content=? AND type=?';
                return $cordovaSQLite.execute(db, query, [sessionId, data, type]);
            }

            function removeImage(sessionId, image) {
                return removeMedia(sessionId, image, "image");
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

            function sortSpeakers(speakers) {
                return speakers.sort(function (speaker1, speaker2) {
                    if (speaker1.firstname < speaker2.firstname) return -1;
                    if (speaker1.firstname > speaker2.firstname) return 1;
                    return 0;
                });
            }

            function getData() {
                var conferences = localStorage.getItem('programmation');
                if (conferences) {
                    return $q(function (resolve, reject) {
                        resolve(JSON.parse(conferences));
                    });
                } else {
                    return $http.get('https://devfest2015.gdgnantes.com/assets/prog.json').then(
                        function (response) {
                            var programmation = response.data;
                            // Fix categories
                            var categories = programmation.categories;
                            categories['codelab-web'] = categories.codelabweb;
                            categories['codelab-cloud'] = categories.codelabcloud;
                            categories['mobile'] = categories.android;
                            categories['discovery'] = categories.decouverte;
                            delete categories.codelabweb;
                            delete categories.codelabcloud;
                            delete categories.android;
                            delete categories.decouverte;
                            programmation.categories = categories;
                            // Sort speakers
                            programmation.speakers = sortSpeakers(programmation.speakers);
                            // Save to local storage
                            localStorage.setItem('programmation', JSON.stringify(programmation));
                            return programmation;
                        },
                        function (error) {
                            // In case we can't access the file, we fallback on the local file
                            return $http.get('data/devfest-2015.json').then(
                                function (response) {
                                    var programmation = response.data;
                                    // Sort speakers
                                    programmation.speakers = sortSpeakers(programmation.speakers);
                                    // Save to local storage
                                    localStorage.setItem('programmation', JSON.stringify(programmation));
                                    return programmation;
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