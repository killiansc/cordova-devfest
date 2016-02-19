angular.module('conf.session', [])
    .controller('sessionController', ['$http', function ($http) {
        var vm = this;

        vm.sessions = [];
        vm.categories = [];

        vm.getSessions = getSessions;
        vm.showDetails = showDetails;

        $http.get('data/devfest-2015.json').then(function (response) {
            vm.sessions = response.data.sessions;
            vm.categories = response.data.categories;
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function getSessions(category) {
            return vm.sessions.filter(function (session) {
                return session.type === category;
            });
        }

        function showDetails(session) {
            app.navi.pushPage('modules/session/detail/details.html', {
                session: session
            });
        }

    }]);