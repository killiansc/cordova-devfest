angular.module('conf.session')
    .controller('sessionNoteController', ['SQLiteService', '$cordovaToast', function (SQLiteService, $cordovaToast) {
        var vm = this;

        vm.session = app.navi.getCurrentPage().options.session;
        vm.notes = '';
        vm.save = save;

        SQLiteService.getNotes(vm.session.id).then(function (notes) {
            vm.notes = notes;
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function save() {
            SQLiteService.upsert(vm.session.id, vm.notes).then(
                function (response) {
                    $cordovaToast.showLongBottom('Notes saved!');
                },
                function (error) {
                    $cordovaToast.showLongBottom('Notes could not be saved!');
                }
            );
        }

    }]);