angular.module('conf.speaker')
    .controller('speakerDetailController', ['$sce', '$cordovaContacts', function ($sce, $cordovaContacts) {
        var vm = this;

        vm.speaker = app.navi.getCurrentPage().options.speaker;
        vm.isContact = false;
        vm.contact = getContact();

        vm.renderHtml = renderHtml;
        vm.addContact = addContact;
        vm.deleteContact = deleteContact;

        $cordovaContacts.find({
            filter: vm.speaker.id,
            fields: ['nickname']
        }).then(function (contacts) {
            if (contacts.length === 0) {
                vm.isContact = false;
            } else {
                vm.isContact = true;
                vm.contact = contacts[0];
            }
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function renderHtml(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }

        function addContact() {
            $cordovaContacts.save(vm.contact).then(
                function (result) {
                    vm.isContact = true;
                    vm.contact = result;
                },
                function (error) {
                    vm.isContact = false;
                }
            );
        }

        function deleteContact() {
            $cordovaContacts.remove(vm.contact).then(
                function (result) {
                    vm.isContact = false;
                },
                function (error) {
                    vm.isContact = true;
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