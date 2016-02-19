(function () {
    'use strict';

    angular.module('conf.speaker', ['ngCordova'])
        .controller('speakerController', ['$sce', '$filter', 'DataService', function ($sce, $filter, DataService) {
            var vm = this;

            vm.speakers = [];

            vm.showDetails = showDetails;
            vm.renderHtml = renderHtml;

            DataService.getSpeakers().then(function (speakers) {
                vm.speakers = speakers.values;
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