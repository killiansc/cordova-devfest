(function () {
    'use strict';

    angular.module('conf.agenda', [])
        .controller('agendaController', ['ProgrammationService', 'SQLiteService', '$cordovaToast',
            function (ProgrammationService, SQLiteService, $cordovaToast) {
                var vm = this;

                vm.sessions = [];
                vm.hours = [];
                vm.favorites = [];

                vm.toggleFavorite = toggleFavorite;
                vm.isFavorite = isFavorite;

                SQLiteService.getFavorites().then(
                    function (response) {
                        vm.favorites = response;
                    },
                    function (error) {
                        vm.favorites = [];
                        $cordovaToast.showLongBottom('Impossible de récupérer les favoris');
                    }
                );

                ProgrammationService.getSessions().then(
                    function (sessions) {
                        // Add timestamp (from the beginning of the day) to sort more easily after
                        vm.hours = sessions.hours;
                        // Sort sessions regarding their start time
                        vm.sessions = sessions.values.sort(function (session1, session2) {
                            if (vm.hours[session1.hour].timestampStart < vm.hours[session2.hour].timestampStart) return -1;
                            if (vm.hours[session1.hour].timestampStart > vm.hours[session2.hour].timestampStart) return 1;
                            if (vm.hours[session1.hour].timestampEnd < vm.hours[session2.hour].timestampEnd) return -1;
                            if (vm.hours[session1.hour].timestampEnd > vm.hours[session2.hour].timestampEnd) return 1;
                            return 0;
                        });
                    },
                    function (error) {
                        $cordovaToast.showLongBottom('Impossible de récupérer les sessions');
                    });

                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                function toggleFavorite(id) {
                    var wasFavorite = isFavorite(id);
                    if (wasFavorite) {
                        vm.favorites.splice(vm.favorites.indexOf(id), 1);
                    } else {
                        vm.favorites.push(id);
                    }
                    SQLiteService.saveFavorite(id, !wasFavorite).then(
                        function (response) {
                            if (wasFavorite) {
                                $cordovaToast.showShortBottom('Session supprimée des favoris !');
                            } else {
                                $cordovaToast.showShortBottom('Session ajoutée aux favoris !');
                            }
                        },
                        function (error) {
                            if (wasFavorite) {
                                vm.favorites.push(id);
                            } else {
                                vm.favorites.splice(vm.favorites.indexOf(id), 1);
                            }
                            $cordovaToast.showLongBottom('Une erreur est survenue...');
                        }
                    );
                }

                function isFavorite(id) {
                    return vm.favorites.indexOf(id) > -1;
                }

            }]);

})();