(function () {
    'use strict';

    angular.module('conf.session')
        .controller('sessionNoteController', ['SQLiteService', '$cordovaToast', '$cordovaCamera',
            function (SQLiteService, $cordovaToast, $cordovaCamera) {

                var vm = this;

                vm.session = app.navi.getCurrentPage().options.session;
                vm.notes = '';
                vm.images = [];
                vm.save = save;
                vm.pickPhoto = pickPhoto;

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
                                    console.log(error);
                                    $cordovaToast.showLongBottom('Photo non sauvegardée...');
                                }
                            );
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Photo non récupérée...');
                        }
                    )
                }

            }]);

})();