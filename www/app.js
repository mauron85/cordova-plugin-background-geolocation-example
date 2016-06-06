'use strict';

var
  backgroundGeolocation,
  map,
  previousLocation,
  locationMarkers = [],
  currentLocationMarker,
  locationAccuracyCircle,
  path,
  userStartIntent = false,
  isStarted = false,
  isLocationEnabled = false,
  configHasChanges = false;

var bgOptions = {
  stationaryRadius: 50,
  distanceFilter: 50,
  desiredAccuracy: 10,
  debug: true,
  notificationTitle: 'Background tracking',
  notificationText: 'enabled',
  notificationIconColor: '#FEDD1E',
  notificationIconLarge: 'mappointer_large',
  notificationIconSmall: 'mappointer_small',
  locationProvider: 0,//backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
  interval: 10000,
  fastestInterval: 5000,
  activitiesInterval: 10000,
  stopOnTerminate: true,
  startOnBoot: false,
  startForeground: true,
  stopOnStillActivity: true,
  activityType: 'AutomotiveNavigation',
  url: 'http://192.168.81.15:3000/location',
  httpHeaders: {
    'X-FOO': 'bar'
  }
};

var mapOptions = {
  center: { lat: 37.3318907, lng: -122.0318303 },
  zoom: 12,
  disableDefaultUI: true,
};

try {
  Object.assign(bgOptions, JSON.parse(localStorage.getItem('bgOptions')));
} catch (e) {
  //noop;
}


// Initialize app
var myApp = new Framework7({
  init: false,
  animateNavBackIcon: true,
  precompileTemplates: true,
  domCache: true,
  material: window.isAndroid,
  // fastclick: false
});

// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var mainView = myApp.addView('.view-main');
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2');

myApp.onPageInit('map', function (page) {
  renderTabBar(isStarted);

  if (typeof google !== 'undefined') {
    map = new google.maps.Map(Dom7('#mapcanvas')[0], mapOptions);    
  }

  if (typeof backgroundGeolocation === 'undefined') {
    myApp.alert('Plugin has not been initialized properly!', 'Error');
    return;
  }

  bgConfigure();
  backgroundGeolocation.watchLocationMode(
    function (enabled) {
      isLocationEnabled = enabled;
      if (enabled) {
        if (userStartIntent && !isStarted) {
          startTracking();
        }
      } else {
        stopTracking();
      }
    },
    function (error) {
      myApp.alert(error, 'Error while watching location mode');
    }
  );

  $$('#tabbar').on('click', '[data-action="tracking"]', function() {
    if (isLocationEnabled) {
      userStartIntent = !isStarted;
    }
    toggleTracking(isStarted);
  });
  
});

myApp.onPageInit('settings', function (page) {
  var options = Object.assign({}, bgOptions);
  var locationProviders = [
    {name: 'ANDROID_DISTANCE_FILTER_PROVIDER', value: 0, selected: false, index: 0},
    {name: 'ANDROID_ACTIVITY_PROVIDER', value: 1, selected: false, index: 1},
  ];
  var selectedProvider = 0;

  if (options.locationProvider) {
    selectedProvider = Number(options.locationProvider);
    locationProviders[Number(options.locationProvider)].selected = true;
  }
  options.locationProvider = locationProviders[selectedProvider].name;
  options.locationProviders = locationProviders;

  $$('#settings').html(Template7.templates.settingsTemplate(options));

  $$('[data-action="back"]').click(function(ev) {
    // if (configHasChanges) {
      var config = Array.prototype.reduce.call($$('[data-page="settings"] [data-type="config"]'),
        function(values, el) {
        if (el.type === 'checkbox') {
          values[el.name] = el.checked;
        } else {
          if (['interval', 'fastestInterval', 'activitiesInterval'].indexOf(el.name) > -1) {
            values[el.name] = el.value * 1000;
          } else {
            values[el.name] = el.value;
          }
        }
        return values;
      }, {});
      localStorage.setItem('bgOptions', JSON.stringify(config));
      bgConfigure(config);
      configHasChanges = false;
    // }
  });

});

$$('[data-page="settings"]').on('keyup keydown change', '[data-type="config"]', function(ev) {
  console.log('changed', this.name, this.checked, this.value);
  configHasChanges = true;
});

function toggleTracking(isStarted) {
  if (isStarted) {
    stopTracking();
  } else {
    startTracking();
  }
}

function bgConfigure(config) {
  Object.assign(bgOptions, config);
  if (isStarted) {
    stopTracking();
    backgroundGeolocation.configure(
      setCurrentLocation,
      function (err) { console.log('Error occured', err); },
      bgOptions
    );
    startTracking();
  } else {
    backgroundGeolocation.configure(
      setCurrentLocation,
      function (err) { console.log('Error occured', err); },
      bgOptions
    );
  }
}

function startTracking() {
  if (isStarted) { return; }

  if (!window.isAndroid) {
    backgroundGeolocation.start();
    isStarted = true;
    renderTabBar(isStarted);
    return;
  }

  backgroundGeolocation.isLocationEnabled(
    function (enabled) {
      isLocationEnabled = enabled;
      if (enabled) {
        backgroundGeolocation.start();
        isStarted = true;
        renderTabBar(isStarted);
      } else {
        myApp.confirm('Would you like to open settings?', 'Location Services are disabled', function() {
          backgroundGeolocation.showLocationSettings();
        });
      }
    },
    function (error) {
      myApp.alert(error, 'Error detecting status of location settings');
    }
  );
}

function stopTracking() {
  if (!isStarted) { return; }
  backgroundGeolocation.stop();
  isStarted = false;
  renderTabBar(isStarted);
}

function renderTabBar(isStarted) {
  $$('#tabbar').html(Template7.templates.tabbarTemplate({isStarted: isStarted}));
}

function setCurrentLocation (location) {
    if (!currentLocationMarker) {
        currentLocationMarker = new google.maps.Marker({
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                fillColor: 'blue',
                strokeColor: 'blue',
                strokeWeight: 5
            }
        });
        locationAccuracyCircle = new google.maps.Circle({
            fillColor: '#3366cc',
            fillOpacity: 0.4,
            strokeOpacity: 0,
            map: map
        });
    }
    if (!path) {
        path = new google.maps.Polyline({
            map: map,
            strokeColor: '#3366cc',
            fillOpacity: 0.4
        });
    }
    var latlng = new google.maps.LatLng(Number(location.latitude), Number(location.longitude));

    if (previousLocation) {
        // Drop a breadcrumb of where we've been.
        locationMarkers.push(new google.maps.Marker({
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                fillColor: 'green',
                strokeColor: 'green',
                strokeWeight: 5
            },
            map: map,
            position: new google.maps.LatLng(previousLocation.latitude, previousLocation.longitude)
        }));
    } else {
        map.setCenter(latlng);
        if (map.getZoom() < 15) {
            map.setZoom(15);
        }
    }

    // Update our current position marker and accuracy bubble.
    currentLocationMarker.setPosition(latlng);
    locationAccuracyCircle.setCenter(latlng);
    locationAccuracyCircle.setRadius(location.accuracy);

    // Add breadcrumb to current Polyline path.
    path.getPath().push(latlng);
    previousLocation = location;
}

function onDeviceReady() {
  backgroundGeolocation = backgroundGeolocation || backgroundGeoLocation;
  myApp.init();
}

document.addEventListener('deviceready', onDeviceReady, false);
