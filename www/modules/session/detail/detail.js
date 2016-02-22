(function () {
    'use strict';

    angular.module('conf.session')
        .controller('sessionDetailController', ['$sce', 'SQLiteService', '$cordovaToast',
            function ($sce, SQLiteService, $cordovaToast) {

                var vm = this;

                vm.session = app.navi.getCurrentPage().options.session;
                vm.rate = 0;

                vm.showNotes = showNotes;
                vm.renderHtml = renderHtml;
                vm.changeRate = changeRate;

                SQLiteService.getRate(vm.session.id).then(
                    function (response) {
                        vm.rate = response;
                    },
                    function (error) {
                        vm.rate = 0;
                    }
                );

                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                function renderHtml(htmlCode) {
                    return $sce.trustAsHtml(htmlCode);
                }

                function showNotes(session) {
                    app.navi.pushPage('modules/session/note/notes.html', {
                        session: session
                    });
                }

                function changeRate(rate) {
                    SQLiteService.saveRate(vm.session.id, rate).then(
                        function (response) {
                            $cordovaToast.showLongBottom('Note enregistrée !');
                        },
                        function (error) {
                            $cordovaToast.showLongBottom('Note non enregistrée...');
                        }
                    )
                }

            }]);

})();