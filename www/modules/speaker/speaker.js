(function () {
    'use strict';

    angular.module('conf.speaker', ['ngCordova'])
        .controller('speakerController', ['$sce', '$filter', 'DataService', '$cordovaToast',
            function ($sce, $filter, DataService, $cordovaToast) {

            var vm = this;

            vm.speakers = [];

            vm.showDetails = showDetails;
            vm.renderHtml = renderHtml;

            DataService.getSpeakers().then(
                function (speakers) {
                    vm.speakers = speakers.values;
                },
                function (error) {
                    $cordovaToast.showLongBottom('Une erreur est survenue...');
                });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function renderHtml(htmlCode) {
                return $sce.trustAsHtml($filter('limitTo')(htmlCode, 100));
            }

            function showDetails(speaker) {
                app.navi.pushPage('modules/speaker/detail/details.html', {
                    speaker: speaker
                });
            }

        }]);

})();