angular.module('conf.speaker', ['ngCordova'])
    .controller('speakerController', ['$http', '$sce', '$filter', function ($http, $sce, $filter) {
        var vm = this;

        vm.speakers = [];

        vm.showDetails = showDetails;
        vm.renderHtml = renderHtml;

        $http.get('data/devfest-2015.json').then(function (response) {
            vm.speakers = response.data.speakers.sort(function (a, b) {
                if (a.firstname < b.firstname) return -1;
                if (a.firstname > b.firstname) return 1;
                return 0;
            });
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