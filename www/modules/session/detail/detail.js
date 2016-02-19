(function () {
    'use strict';

    angular.module('conf.session')
        .controller('sessionDetailController', ['$sce', function ($sce) {

            var vm = this;

            vm.session = app.navi.getCurrentPage().options.session;

            vm.showNotes = showNotes;
            vm.renderHtml = renderHtml;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function renderHtml(htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            }

            function showNotes(session) {
                app.navi.pushPage('modules/session/note/notes.html', {
                    session: session
                });
            }

        }]);

})();