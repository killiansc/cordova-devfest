(function () {
    'use strict';

    angular.module('conf.session')
        .controller('sessionNoteController', ['SQLiteService', '$cordovaToast', '$cordovaCamera', '$cordovaCapture',
            function (SQLiteService, $cordovaToast, $cordovaCamera, $cordovaCapture) {

                var vm = this;

                vm.session = app.navi.getCurrentPage().options.session;
                vm.notes = '';
                vm.images = [];
                vm.audios = [];

                vm.save = save;
                vm.pickPhoto = pickPhoto;
                vm.recordAudio = recordAudio;
                vm.recordVideo = recordVideo;

                SQLiteService.getNotes(vm.session.id).then(
                    function (notes) {
                        vm.notes = notes;
                    },
                    function (error) {
                        $cordovaToast.showLongBottom('Erreur de récupération des notes');
                    }
                );

                SQLiteService.getImages(vm.session.id).then(
                    function (images) {
                        vm.images = images;
                    },
                    function (error) {
                        $cordovaToast.showLongBottom('Erreur de récupération des images');
                    }
                );

                SQLiteService.getAudios(vm.session.id).then(
                    function (audios) {
                        vm.audios = audios;
                    },
                    function (error) {
                        $cordovaToast.showLongBottom('Erreur de récupération des audios');
                    }
                );

                SQLiteService.getVideos(vm.session.id).then(
                    function (videos) {
                        vm.videos = videos;
                    },
                    function (error) {
                        $cordovaToast.showLongBottom('Erreur de récupération des vidéos');
                    }
                );

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                function save() {
                    SQLiteService.saveNotes(vm.session.id, vm.notes).then(
                        function (response) {
                            $cordovaToast.showLongBottom('Note enregistrée !');
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Note non enregistrée...');
                        }
                    );
                }

                function pickPhoto(fromCamera) {
                    var options = {
                        sourceType: fromCamera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
                        encodineType: Camera.EncodingType.PNG,
                        correctOrientation: true
                    };
                    $cordovaCamera.getPicture(options).then(
                        function (imageData) {
                            vm.images.push(imageData);
                            SQLiteService.saveImage(vm.session.id, imageData).then(
                                function (response) {
                                    $cordovaToast.showLongBottom('Photo sauvegardée !');
                                },
                                function (error) {
                                    $cordovaToast.showLongBottom('Photo non sauvegardée...');
                                }
                            );
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Photo non récupérée...');
                        }
                    );
                }

                function recordAudio() {
                    $cordovaCapture.captureAudio().then(
                        function (mediaFiles) {
                            var path;
                            mediaFiles.forEach(function (audioData) {
                                path = audioData.fullPath;
                                vm.audios.push(path);
                                SQLiteService.saveAudio(vm.session.id, path).then(
                                    function (response) {
                                        $cordovaToast.showLongBottom('Audio sauvegardé !');
                                    },
                                    function (error) {
                                        $cordovaToast.showLongBottom('Audio non sauvegardé...');
                                    }
                                );
                            });
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Audio non récupéré...');
                        }
                    );
                }

                function recordVideo() {
                    $cordovaCapture.captureVideo().then(
                        function (mediaFiles) {
                            var path;
                            mediaFiles.forEach(function (videoData) {
                                path = videoData.fullPath;
                                vm.videos.push(path);
                                SQLiteService.saveVideo(vm.session.id, path).then(
                                    function (response) {
                                        $cordovaToast.showLongBottom('Video sauvegardée !');
                                    },
                                    function (error) {
                                        $cordovaToast.showLongBottom('Video non sauvegardée...');
                                    }
                                );
                            });
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Vidéo non récupéré...');
                        }
                    );
                }

            }]);

})();