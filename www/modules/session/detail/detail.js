angular.module('conf.session.detail', [])
    .controller('sessionDetailController', function () {
        var vm = this;

        vm.session = app.navi.getCurrentPage().options.session;
    });