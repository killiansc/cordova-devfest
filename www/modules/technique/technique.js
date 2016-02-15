angular.module('conf.technique', [])
    .controller('techController', function () {
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

        vm.information = {
            available: device.available,
            platform: device.platform,
            version: device.version,
            uuid: device.uuid,
            cordova: device.cordova,
            model: device.model,
            manufacturer: device.manufacturer,
            connection: checkConnection(navigator.connection.type)
        };

    });