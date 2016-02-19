angular.module('conf.speaker')
    .controller('speakerDetailController', ['$sce', '$http', '$cordovaContacts', '$cordovaToast', '$cordovaFile',
        function ($sce, $http, $cordovaContacts, $cordovaToast, $cordovaFile) {
            var vm = this;

            vm.speaker = app.navi.getCurrentPage().options.speaker;
            vm.isContactChecked = false;
            vm.contactForDevice = undefined;
            vm.contactFromDevice = {};

            vm.renderHtml = renderHtml;
            vm.toggleContact = toggleContact;
            vm.deleteContact = deleteContact;

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

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                        $cordovaToast.showLongBottom('Presenter added to your contacts!');
                    },
                    function (error) {
                        vm.isContactChecked = false;
                        $cordovaToast.showLongBottom('Presenter could not be added!');
                    }
                );
            }

            function deleteContact() {
                $cordovaContacts.remove(vm.contactFromDevice).then(
                    function (result) {
                        vm.contactFromDevice = undefined;
                        $cordovaToast.showLongBottom('Presenter removed from your contacts!');
                    },
                    function (error) {
                        vm.isContactChecked = true;
                        $cordovaToast.showLongBottom('Presenter could not be removed!');
                    }
                )
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
