# Cordova conference app

## Plugins

```
cordova-plugin-actionsheet 2.2.2 "ActionSheet"
cordova-plugin-camera 2.1.0 "Camera"
cordova-plugin-contacts 2.0.1 "Contacts"
cordova-plugin-device 1.1.1 "Device"
cordova-plugin-file 4.1.1 "File"
cordova-plugin-inappbrowser 1.2.1 "InAppBrowser"
cordova-plugin-media-capture 1.2.0 "Capture"
cordova-plugin-network-information 1.2.0 "Network Information"
cordova-plugin-whitelist 1.2.1 "Whitelist"
cordova-plugin-x-socialsharing 5.0.10 "SocialSharing"
cordova-plugin-x-toast 2.4.2 "Toast"
cordova-sqlite-storage 0.8.2 "Cordova sqlite storage plugin (core version)"
```

## Fonctionnalités

Tout a été développé, avec en plus :
* intégration de `$cordovaToast` pour faire un retour sur les actions de l'utilisateur
* possibilité d'appuyer sur la touche `back` lors de la navigation dans le menu de gauche
* création de services (`SQLiteService` et `ProgrammationService`) pour une meilleur réutilisabilité
* triage intelligent des sessions dans l'agenda avec le calcul de timestamps