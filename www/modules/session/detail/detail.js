angular.module('conf.session')
    .controller('sessionDetailController', function () {
        var vm = this;

        vm.session = app.navi.getCurrentPage().options.session;
    });