Example Background Geolocation app.
=============================================

![MainUI](/appui.png)
![Settings](/settings.png)

## Description

Example app shows some possibilities of [cordova-background-geolocation](https://github.com/mauron85/cordova-plugin-background-geolocation) plugin.

## Compatibility

| Name                       | Version |
|----------------------------|---------|
| Cordova CLI                | 7.1.0   |
| Cordova-Android            | 6.3.0   |

## How to build

Build app

```
npm install
npm run build
```

App will be built into `www` folder.


Replace platform with one of supported platforms: android, ios. In this example we will build for Android.

```
$ cordova platform add android
$ cordova build android
```

There is *after_platform_add* hook in config.xml which runs script that install all required plugins.

## Run on device

### iOS
You will need to install ios-deploy package.

```
$ npm -g install ios-deploy
```

```
cordova run ios --device
```

### Android
```
cordova run android --device
```

## Run in simulator

### iOS
You will need to install ios-sim package first
```
$ npm -g install ios-sim
```

Run in default emulator
```
$ cordova emulate ios
```

You can use cordova run ios --list to see all available targets and cordova run ios --target=target_name to run application on a specific device or emulator (for example, cordova run ios --target="iPhone-6").


### Android
To deploy the app on a default Android emulator.

```
$ cordova emulate android
```

You can use cordova run android --list to see all available targets and cordova run android --target=target_name to run application on a specific device or emulator (for example, cordova run android --target="Nexus4_emulator").

## App Development

Cordova Example App is sharing code with [react-native variant](https://github.com/mauron85/react-native-background-geolocation-example). Native libraries are aliased to use their web variants.
That is possible thanks to amazing [webpack](https://webpack.github.io/), [native-base-web](https://github.com/Chion82/native-base-web), [react-native-web](https://github.com/necolas/react-native-web) projects.


For development install and use webpack-dev-server:

```
webpack-dev-server --content-base src/
```

## Plugin development

All plugins will be installed from npm at their latest version. However if you want to install your local version on cordova-plugin-background-geolocation, you can do that:

```
$ cordova plugin rm cordova-plugin-mauron85-background-geolocation
$ cordova plugin add file:///absolute_path_to_your/cordova-plugin-background-geolocation/
$ cordova build
```

## Credits

* [transistorsoft](https://github.com/transistorsoft) for background-geolocation-console, cordova-background-geolocation and SampleApp.

### iOS quirks

If you're using XCode, boot the SampleApp in the iOS Simulator and enable ```Debug->Location->City Drive```.
