angular.module('conf.speaker', ['ngCordova'])
    .controller('speakerController', ['$http', '$sce', '$filter', function ($http, $sce, $filter) {
        var vm = this;

        vm.speakers = [];

        $http.get('data/devfest-2015.json').then(function (response) {
            vm.speakers = response.data.speakers.sort(function(a, b){
                if(a.firstname < b.firstname) return -1;
                if(a.firstname > b.firstname) return 1;
                return 0;
            });
        });

        vm.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml($filter('limitTo')(htmlCode, 100));
        };

        vm.showDetails = function (speaker) {
            app.navi.pushPage('modules/speaker/detail/details.html', {
                speaker: speaker
            });
        }

    }]);