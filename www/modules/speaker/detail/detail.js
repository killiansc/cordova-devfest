angular.module('conf.speaker')
    .controller('speakerDetailController', ['$sce', '$cordovaContacts', function ($sce, $cordovaContacts) {
        var vm = this;

        vm.speaker = app.navi.getCurrentPage().options.speaker;
        vm.isContactChecked = false;
        vm.contactForDevice = getContact();
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
            $cordovaContacts.save(vm.contactForDevice).then(
                function (result) {
                    vm.contactFromDevice = result;
                },
                function (error) {
                    vm.isContactChecked = false;
                }
            );
        }

        function deleteContact() {
            $cordovaContacts.remove(vm.contactFromDevice).then(
                function (result) {
                    vm.contactFromDevice = undefined;
                },
                function (error) {
                    vm.isContactChecked = true;
                }
            )
        }

        function getContact() {
            var name = new ContactName();
            name.givenName = vm.speaker.firstname;
            name.familyName = vm.speaker.lastname;
            var urls = [];
            vm.speaker.socials.forEach(function (social) {
                urls.push(new ContactField(social.class, social.link));
            });
            var company = new ContactOrganization();
            company.type = "Company";
            company.pref = true;
            company.name = vm.speaker.company;
            return {
                nickname: vm.speaker.id,
                displayName: vm.speaker.firstname + ' ' + vm.speaker.lastname,
                name: name,
                urls: urls,
                organizations: [company],
                note: vm.speaker.about
            }
        }

    }]);
