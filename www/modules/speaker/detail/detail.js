(function () {
    'use strict';

    angular.module('conf.speaker')
        .controller('speakerDetailController', ['$sce', '$cordovaContacts', '$cordovaToast', '$cordovaInAppBrowser',
            function ($sce, $cordovaContacts, $cordovaToast, $cordovaInAppBrowser) {

                var vm = this;

                vm.speaker = app.navi.getCurrentPage().options.speaker;
                vm.isContactChecked = false;
                vm.contactForDevice = undefined;
                vm.contactFromDevice = {};

                vm.renderHtml = renderHtml;
                vm.toggleContact = toggleContact;
                vm.deleteContact = deleteContact;
                vm.openInApp = openInApp;
                vm.getSocialClass = getSocialClass;

                $cordovaContacts.find({
                    filter: vm.speaker.id,
                    fields: ['nickname']
                }).then(function (contacts) {
                    if (contacts.length === 0) {
                        vm.isContactChecked = false;
                    } else {
                        vm.isContactChecked = true;
                        vm.contactFromDevice = contacts[0];
                    }
                });

                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                function renderHtml(htmlCode) {
                    return $sce.trustAsHtml(htmlCode);
                }

                function toggleContact() {
                    if (vm.isContactChecked) {
                        addContact();
                    } else {
                        deleteContact();
                    }
                }

                function addContact() {
                    if (!vm.contactForDevice) vm.contactForDevice = getContactForDevice();
                    $cordovaContacts.save(vm.contactForDevice).then(
                        function (result) {
                            vm.contactFromDevice = result;
                            $cordovaToast.showLongBottom('Présentateur ajouté aux contacts');
                        },
                        function (error) {
                            vm.isContactChecked = false;
                            $cordovaToast.showLongBottom('Présentateur non enregistré...');
                        }
                    );
                }

                function deleteContact() {
                    $cordovaContacts.remove(vm.contactFromDevice).then(
                        function (result) {
                            vm.contactFromDevice = undefined;
                            $cordovaToast.showLongBottom('Présentateur supprimé des contacts');
                        },
                        function (error) {
                            vm.isContactChecked = true;
                            $cordovaToast.showLongBottom('Présentateur non supprimé...');
                        }
                    )
                }

                function openInApp(url) {
                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'no'
                    };
                    $cordovaInAppBrowser.open(url, '_self', options).then(
                        function (result) {
                            // success
                        },
                        function (error) {
                            // failed
                        }
                    );
                }

                function getSocialClass(social) {
                    if (social == 'site') return 'link';
                    return social;
                }

                function getContactForDevice() {
                    var name = vm.speaker.firstname + ' ' + vm.speaker.lastname;
                    return {
                        nickname: vm.speaker.id,
                        displayName: name,
                        name: new ContactName(name, vm.speaker.lastname, vm.speaker.firstname),
                        urls: vm.speaker.socials.map(function (social) {
                            return new ContactField('url', social.link);
                        }),
                        organizations: [new ContactOrganization(true, "company", vm.speaker.company)],
                        note: vm.speaker.about
                    };
                }

            }]);

})();