(function () {
    'use strict';

    angular.module('conf.session')
        .controller('sessionNoteController', ['SQLiteService', '$cordovaToast', '$cordovaCamera', '$cordovaCapture', '$cordovaActionSheet', '$cordovaSocialSharing',
            function (SQLiteService, $cordovaToast, $cordovaCamera, $cordovaCapture, $cordovaActionSheet, $cordovaSocialSharing) {

                var vm = this;

                vm.session = app.navi.getCurrentPage().options.session;
                vm.notes = '';
                vm.images = [];
                vm.audios = [];
                vm.videos = [];

                vm.save = save;
                vm.pickPhoto = pickPhoto;
                vm.recordAudio = recordAudio;
                vm.recordVideo = recordVideo;
                vm.onPhotoClick = onPhotoClick;

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

                ////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                            $cordovaToast.showLongBottom("Aucune photo n'a été récupérée");
                        }
                    );
                }

                function onPhotoClick(index, image) {
                    var options = {
                        title: "Que faire avec l'image ?",
                        buttonLabels: ['Partager'],
                        addCancelButtonWithLabel: 'Annuler',
                        androidEnableCancelButton: true,
                        addDestructiveButtonWithLabel: 'Supprimer'
                    };
                    $cordovaActionSheet.show(options).then(
                        function (btnIndex) {
                            switch (btnIndex) {
                                case 1:
                                    removeImage(index, image);
                                    break;
                                case 2:
                                    shareImage(image);
                                    break;
                                case 3:
                                    break;
                                default:
                                    $cordovaToast.showLongBottom('Action inconnue lancée, hacker !');
                            }
                        }
                    );
                }

                function removeImage(index, image) {
                    vm.images.splice(index, 1);
                    SQLiteService.removeImage(vm.session.id, image).then(
                        function (response) {
                            $cordovaToast.showLongBottom('Photo supprimée !');
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Photo non supprimée...');
                            vm.images.splice(index, 0, image);
                        }
                    );
                }

                function shareImage(image) {
                    $cordovaSocialSharing.share(vm.notes, "Photo partagée depuis l'application Conferences !", image, '').then(
                        function (response) {
                            // saved
                        },
                        function (error) {
                            // failed
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
                            $cordovaToast.showLongBottom("Aucun audio n'a été récupéré");
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
                            $cordovaToast.showLongBottom("Aucune vidéo n'a été récupérée");
                        }
                    );
                }

            }]);

})();