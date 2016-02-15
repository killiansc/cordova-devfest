angular.module('conf.speaker.detail', [])
    .controller('speakerDetailController', ['$sce', function ($sce) {
        var vm = this;

        vm.speaker = app.navi.getCurrentPage().options.speaker;

        vm.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

    }]);