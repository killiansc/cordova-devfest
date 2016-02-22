(function () {
    'use strict';

    angular.module('conf.about', ['ngCordova'])
        .controller('aboutController', function ($cordovaInAppBrowser) {
            var vm = this;

            vm.openAuthorWebsite = openAuthorWebsite;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function openAuthorWebsite() {
                var options = {
                    location: 'no',
                    clearcache: 'yes',
                    toolbar: 'no'
                };
                $cordovaInAppBrowser.open('http://twitter.com/ksntcrq', '_self', options).then(
                    function (result) {
                        // success
                    },
                    function (error) {
                        // failed
                    }
                )
            }

        });

})();