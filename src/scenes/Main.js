'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text, Platform } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon
} from 'native-base';
import MapView from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import TrackingDot from '../res/TrackingDot.png';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    // backgroundColor: '#0C68FB',
  },
  icon: {
    color: '#fff',
    fontSize: 30
  }
});

function logError(msg) {
  console.log(`[ERROR]: ${msg}`);
}

function filterLocations(locations, maxAgeInMillis) {
  const now = Date.now();

  return locations.filter(location => {
    return now - location.time <= maxAgeInMillis;
  });
}

class MainScene extends Component {
  static navigationOptions = {
    title: 'Main',
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      region: { latitude: -34.397, longitude: 150.644 },
      locations: [],
      stationaries: [],
      isRunning: false
    };

    this.goToSettings = this.goToSettings.bind(this);
  }

  componentDidMount() {
    BackgroundGeolocation.configure({
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
        time: '@time'
      }
    });

    // BackgroundGeolocation.getLocations(locations => {
    //   const locationsPastHour = filterLocations(locations, 3600 * 1000);

    //   let region = this.state.region;
    //   const latitudeDelta = 0.01;
    //   const longitudeDelta = 0.01;

    //   if (locationsPastHour.length > 0) {
    //     // asume locations are already sorted
    //     const lastLocation = locationsPastHour[locationsPastHour.length - 1];
    //     region = Object.assign({}, lastLocation, {
    //       latitudeDelta,
    //       longitudeDelta
    //     });
    //   }

    //   this.setState({ locations: locationsPastHour, region });
    // }, logError);

    BackgroundGeolocation.getCurrentLocation(lastLocation => {
      let region = this.state.region;
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      region = Object.assign({}, lastLocation, {
        latitudeDelta,
        longitudeDelta
      });
      this.setState({ locations: [lastLocation], region });
    }, (error) => {
      setTimeout(() => {
        Alert.alert('Error obtaining current location', JSON.stringify(error));
      }, 100);
    });

    BackgroundGeolocation.on('start', () => {
      // service started successfully
      // you should adjust your app UI for example change switch element to indicate
      // that service is running
      console.log('[DEBUG] BackgroundGeolocation has been started');
      this.setState({ isRunning: true });
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[DEBUG] BackgroundGeolocation has been stopped');
      this.setState({ isRunning: false });
    });

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(() =>
          Alert.alert(
            'App requires location tracking',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel'
              }
            ]
        ), 1000);
      }
    });

    BackgroundGeolocation.on('error', ({ message }) => {
      Alert.alert('BackgroundGeolocation error', message);
    });

    BackgroundGeolocation.on('location', location => {
      console.log('[DEBUG] BackgroundGeolocation location', location);
      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const longitudeDelta = 0.01;
          const latitudeDelta = 0.01;
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta
          });
          const locations = this.state.locations;
          locations.push(location);
          this.setState({ locations, region });
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('stationary', (stationary) => {
      console.log('[DEBUG] BackgroundGeolocation stationary', stationary);
      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const stationaries = this.state.stationaries;
          stationaries.push(stationary);
          this.setState({ stationaries });
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('activity', (activity) => {
      console.log('[DEBUG] BackgroundGeolocation activity', activity);
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      this.setState({ isRunning });
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }

  goToSettings() {
    this.props.navigation.navigate('Menu');
  }

  toggleTracking() {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        return false;
      }

      if (!locationServicesEnabled) {
        Alert.alert(
          'Location services disabled',
          'Would you like to open location settings?',
          [
            {
              text: 'Yes',
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel'
            }
          ]
        );
        return false;
      }

      if (authorization == 99) {
        // authorization yet to be determined
        BackgroundGeolocation.start();
      } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
        // calling start will also ask user for permission if needed
        // permission error will be handled in permisision_denied event
        BackgroundGeolocation.start();
      } else {
        Alert.alert(
          'App requires location tracking',
          'Please grant permission',
          [
            {
              text: 'Ok',
              onPress: () => BackgroundGeolocation.start()
            }
          ]
        );
      }
    });
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const { locations, stationaries, region, isRunning } = this.state;
    return (
      <Container>
        <View>
          <MapView
            style={{ width, height: height - 55 }}
            region={region}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
          >
            {locations.map((location, idx) => (
              <MapView.Marker
                key={idx}
                coordinate={location}
                image={TrackingDot}
              />
            ))}
            {stationaries.map((stationary, idx) => {
              return (
                <MapView.Circle
                  key={idx}
                  center={stationary}
                  radius={stationary.radius}
                  fillColor="#AAA"
                />
              );
            })}
          </MapView>
        </View>
        <Footer style={styles.footer}>
          <FooterTab>
            <Button onPress={this.toggleTracking}>
              <Icon name={isRunning ? 'pause' : 'play'} style={styles.icon} />
            </Button>
            <Button onPress={this.goToSettings}>
              <Icon name={'menu'} style={styles.icon} />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default MainScene;
