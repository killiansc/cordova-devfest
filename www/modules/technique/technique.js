angular.module('conf.technique', ['ngCordova'])
    .controller('techController', function ($cordovaDevice, $cordovaNetwork) {
        var vm = this;

        function checkConnection(connection) {
            switch (connection) {
                case Connection.UNKNOWN:
                    return 'Unknown connection';
                case Connection.ETHERNET:
                    return 'Ethernet connection';
                case Connection.WIFI:
                    return 'WiFi connection';
                case Connection.CELL_2G:
                    return 'Cell 2G connection';
                case Connection.CELL_3G:
                    return 'Cell 3G connection';
                case Connection.CELL_4G:
                    return 'Cell 4G connection';
                case Connection.CELL:
                    return 'Cell generic connection';
                case Connection.NONE:
                    return 'No network connection';
                default:
                    return 'No network';
            }
        }

        vm.information = $cordovaDevice.getDevice();
        vm.information.connection = checkConnection($cordovaNetwork.getNetwork());

    });