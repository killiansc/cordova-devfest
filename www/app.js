var app = ons.bootstrap('conferenceApp', [
        'onsen',
        'conf.shared',
        'conf.home',
        'conf.session',
        'conf.session.detail',
        'conf.speaker',
        'conf.speaker.detail',
        'conf.technique'
    ])
    .config(function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    });