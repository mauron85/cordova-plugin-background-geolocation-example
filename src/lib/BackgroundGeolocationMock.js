/*
 According to apache license

 This is fork of christocracy cordova-plugin-background-geolocation plugin
 https://github.com/christocracy/cordova-plugin-background-geolocation

 Differences to original version:

 1. new method isLocationEnabled
 */

// var exec = require('cordova/exec');
// var channel = require("cordova/channel");
// var radio = require('./radio');

var device = {
  platform: 'ios'
};


var INITIAL_TIME_IN_MILLIS = 1510742914366;
var LOCATION_UPDATE_INTERVAL_IN_MILLIS = 3000;

var initialConfig = {
  locationProvider: 1,
  stationaryRadius: 50,
  distanceFilter: 500,
  desiredAccuracy: 100,
  debug: true,
  activityType: 'OtherNavigation',
  stopOnTerminate: false,
  saveBatteryOnBackground: true,
  stopOnTerminate: true,
  startOnBoot: false,
  stopOnStillActivity: false,
  pauseLocationUpdates: false,
  notificationTitle: 'Background tracking',
  notificationText: 'enabled',
  interval: 10000,
  fastestInterval: 5000,
  activitiesInterval: 10000,
  url: 'http://192.168.81.15:3000/location',
  syncUrl: 'http://',
  maxLocations: 10000,
  syncThreshold: 100,
  httpHeaders: {
    'X-FOO': 'bar'
  }
};

var mockState = {
  isRunning: false,
  hasPermissions: true,
  authorization: 1,
  config: Object.assign({}, initialConfig),
};

var locations = [
  { id: 1, latitude: 49.11937, longitude: 20.06275, time: INITIAL_TIME_IN_MILLIS },
  { id: 2, latitude: 49.11792, longitude: 20.06741, time: INITIAL_TIME_IN_MILLIS + 10000 },
  { id: 3, latitude: 49.11417, longitude: 20.06723, time: INITIAL_TIME_IN_MILLIS + 50000 },
];

var emptyFnc = function () { };

function configure(options) {
  var config = Object.assign({}, initialConfig);
  Object.keys(options).forEach(function (key) {
    if (config.hasOwnProperty(key)) {
      config[key] = options[key];
    }
  });
  return config;
}

function getConfig() {
  return mockState.config;
}

function getCurrentLocation() {
  return locations[0];
}

function getLocations() {
  return locations;
}

function deleteLocation(id) {
  locations = locations.filter(l => l.id !== id);
  return locations;
}

function getLogEntries(limit) {
  return [
    { level: 'ERROR', message: 'ERROR message', timestamp: 1510742914366 },
    { level: 'WARN', message: 'WARN message', timestamp: 1510742914367 },
    { level: 'INFO', message: 'INFO message', timestamp: 1510742914368 },
    { level: 'TRACE', message: 'TRACE message', timestamp: 1510742914369 },
    { level: 'DEBUG', message: 'DEBUG message', timestamp: 1510742914370 }
  ];
}

function checkStatus() {
  return {
    isRunning: mockState.isRunning,
    hasPermissions: mockState.hasPermissions,
    authorization: mockState.authorization
  };
}

var i = 0;
function nextLocation() {
  if (typeof LOCATIONS_FIXTURE === 'undefined') {
    console.error('[ERROR] Mock locations were not loaded. Did you included fixtures/locations.js?');
    return null;
  }
  if (i >= LOCATIONS_FIXTURE.length) {
    i = 0;
  }
  var location = LOCATIONS_FIXTURE[i++];
  return {
    id: i,
    latitude: location[0],
    longitude: location[1],
    time: INITIAL_TIME_IN_MILLIS + (i * LOCATION_UPDATE_INTERVAL_IN_MILLIS)
  }
}

var interval;
function start() {
  if (interval) { return false; }
  interval = setInterval(function() {
    radio('location').broadcast(nextLocation());
  }, LOCATION_UPDATE_INTERVAL_IN_MILLIS);
  return true;
}

function stop() {
  clearInterval(interval);
  interval = null;
}

var exec = function (success, failure, module, method, args) {
  switch (method) {
    case 'start':
      mockState.isRunning = true;
      return success(start());
    case 'stop':
      mockState.isRunning = false;
      return success(stop());
    case 'configure':
      mockState.config = Object.assign({}, mockState.config, args[0]);
      return success(true);
    case 'checkStatus':
      return success(checkStatus());
    case 'getConfig':
      return success(getConfig());
    case 'getLocations':
      return success(getLocations());
    case 'getValidLocations':
      return success(getLocations());
    case 'getCurrentLocation':
      return success(getCurrentLocation());
    case 'getLogEntries':
      setTimeout(function() {
        return success(getLogEntries());
      }, 3000);
      return;
    case 'deleteLocation':
      return success(deleteLocation(args[0]));
    case 'startTask':
      return success(1);
    case 'endTask':
      return success();
  }
}

var broadcast = function(topic) {
  return function (args) {
    radio(topic).broadcast(args);
  }
}

var execBroadcast = function (successTopic, failTopic, method, args) {
  exec(broadcast(successTopic),
    broadcast(failTopic),
    'BackgroundGeolocation',
    method,
    args
  );
};

var eventHandler = function (event) {
  radio(event.name).broadcast(event.payload);
};

var errorHandler = function (error) {
  radio('error').broadcast(error);
};

var BackgroundGeolocation = {
  events: [
    'location',
    'stationary',
    'activity',
    'start',
    'stop',
    'error',
    'authorization',
    'foreground',
    'background'
  ],

  listeners: {},

  DISTANCE_FILTER_PROVIDER: 0,
  ACTIVITY_PROVIDER: 1,
  RAW_PROVIDER: 2,

  BACKGROUND_MODE: 0,
  FOREGROUND_MODE: 1,

  NOT_AUTHORIZED: 0,
  AUTHORIZED: 1,

  HIGH_ACCURACY: 0,
  MEDIUM_ACCURACY: 100,
  LOW_ACCURACY: 1000,
  PASSIVE_ACCURACY: 10000,

  configure: function (config, success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'configure',
      [config]
    );
  },

  start: function () {
    execBroadcast('start', 'error', 'start', []);
  },

  stop: function (success, failure) {
    execBroadcast('stop', 'error', 'stop', []);
  },

  switchMode: function (mode, success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'switchMode', [mode]);
  },

  getConfig: function (success, failure) {
    if (typeof (success) !== 'function') {
      throw 'BackgroundGeolocation#getConfig requires a success callback';
    }
    exec(success,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'getConfig', []);
  },

  /**
   * Returns current stationaryLocation if available.  null if not
   */
  getStationaryLocation: function (success, failure) {
    if (typeof (success) !== 'function') {
      throw 'BackgroundGeolocation#getStationaryLocation requires a success callback';
    }
    exec(success,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'getStationaryLocation', []);
  },

  getCurrentLocation: function (success, failure, options) {
    options = options || {};
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'getCurrentLocation', [options.timeout, options.maximumAge, options.enableHighAccuracy]);
  },

  isLocationEnabled: function (success, failure) {
    if (typeof (success) !== 'function') {
      throw 'BackgroundGeolocation#isLocationEnabled requires a success callback';
    }
    exec(success,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'isLocationEnabled', []);
  },

  showAppSettings: function () {
    exec(emptyFnc,
      emptyFnc,
      'BackgroundGeolocation',
      'showAppSettings', []);
  },

  showLocationSettings: function () {
    exec(emptyFnc,
      emptyFnc,
      'BackgroundGeolocation',
      'showLocationSettings', []);
  },

  getLocations: function (success, failure) {
    if (typeof (success) !== 'function') {
      throw 'BackgroundGeolocation#getLocations requires a success callback';
    }
    exec(success,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'getLocations', []);
  },

  getValidLocations: function (success, failure) {
    if (typeof (success) !== 'function') {
      throw 'BackgroundGeolocation#getValidLocations requires a success callback';
    }
    exec(success,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'getValidLocations', []);
  },

  deleteLocation: function (locationId, success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'deleteLocation', [locationId]);
  },

  deleteAllLocations: function (success, failure) {
    console.log('[Warning]: deleteAllLocations is deprecated and will be removed in future versions.')
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'deleteAllLocations', []);
  },

  getLogEntries: function (limit, offset = 0, minLevel = "DEBUG", successFn = emptyFnc, errorFn = emptyFnc) {
    exec(successFn,
      emptyFnc,
      'BackgroundGeolocation',
      'getLogEntries', [limit, offset, minLevel]);
  },

  checkStatus: function(success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'checkStatus')
  },

  startTask: function (success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'startTask');
  },

  endTask: function (taskKey, success, failure) {
    exec(success || emptyFnc,
      failure || emptyFnc,
      'BackgroundGeolocation',
      'endTask', [taskKey]);
  },

  on: function (event, callbackFn) {
    if (typeof callbackFn !== 'function') {
      throw 'BackgroundGeolocation: callback function must be provided';
    }
    if (this.events.indexOf(event) < 0) {
      throw 'BackgroundGeolocation: Unknown event "' + event + '"';
    }
    radio(event).subscribe(callbackFn);
    return {
      remove: function () {
        radio(event).unsubscribe(callbackFn);
      }
    };
  },

  removeAllListeners: function (event) {
    if (this.events.indexOf(event) < 0) {
      console.log('[WARN] RNBackgroundGeolocation: removeAllListeners for unknown event "' + event + '"');
      return false;
    }

    var topic = radio(event);
    return topic.unsubscribe(topic.channels);
  }
};

// channel.deviceready.subscribe(function () {
//   // register app global listeners
//   exec(eventHandler,
//     errorHandler,
//     'BackgroundGeolocation',
//     'addEventListener'
//   );
// });


// module.exports = BackgroundGeolocation;
