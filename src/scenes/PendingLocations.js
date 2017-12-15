import React, { PureComponent } from 'react';
import { StyleSheet, InteractionManager, Alert, View, FlatList } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Text,
  Button,
  Icon,
  Spinner
} from 'native-base';
import { Platform } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import BackButton from '../components/BackButton';

const styles = StyleSheet.create({
  iconStyle: {
    color: '#0A69FE'
  }
});

class LogItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.setState({ isSelected: !this.state.isSelected });
    this.props.onSelected(this.props.id);
  }

  render() {
    const {
      id,
      latitude,
      longitude,
      time,
      onPress
    } = this.props;
    const { isSelected } = this.state;
  
    const date = new Date(time);
    const iconPrefix = Platform.OS === 'web' ? 'android-' : '';

    return (
      <ListItem onPress={this.onPress}>
        <Left>
          <Text>{`${id}`}</Text>
        </Left>
        <Body>
          <View>
          <Text>{`lat: ${latitude}`}</Text>
          <Text>{`lon: ${longitude}`}</Text>
          <Text>{`time: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</Text>
          </View>
        </Body>
        <Right>
          <Icon
            style={styles.iconStyle}
            name={isSelected ? `${iconPrefix}radio-button-on` : `${iconPrefix}radio-button-off`}
          />
        </Right>
      </ListItem>
    );
  }
}

class PendingLocationsScene extends PureComponent {
  static navigationOptions = {
    title: 'Pending Locations',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      isReady: false,
      selectedLocationsSet: new Set()
    };
    this.onLocationSelected = this.onLocationSelected.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteLocations = this.deleteLocations.bind(this);
    this.deleteAllLocations = this.deleteAllLocations.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refresh();
    });
  }

  refresh() {
    this.setState({ isReady: false });
    BackgroundGeolocation.getValidLocations(locations => {
      this.setState({
        locations,
        isReady: true,
        selectedLocationsSet: new Set(),
      });
    });
  }

  deleteAllLocations() {
    BackgroundGeolocation.deleteAllLocations(this.refresh);
  }

  deleteLocations(locationIdArray) {
    this.setState({ isReady: false });
    if (!Array.isArray(locationIdArray)) { return Promise.reject(); }

    const tasks = locationIdArray.map(id => {
      return new Promise((resolve, reject) => {
        BackgroundGeolocation.deleteLocation(id, resolve, reject);
      });
    });

    // https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
    return tasks.reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults =>
            currentTask.then(currentResult =>
                [ ...chainResults, currentResult ]
            )
        );
    }, Promise.resolve([])).then(arrayOfResults => {
        this.refresh();
    });
  }

  onLocationSelected(locationId) {
    console.log('[DEBUG] location selected', locationId);
    const { selectedLocationsSet } = this.state;
    if (selectedLocationsSet.has(locationId)) {
      selectedLocationsSet.delete(locationId);
    } else {
      selectedLocationsSet.add(locationId);
    }
  }

  onDelete() {
    const { selectedLocationsSet } = this.state;
    const hasSelectedLocations = selectedLocationsSet.size > 0;

    Alert.alert(
      'Confirm action',
      `Do you really want to delete ${hasSelectedLocations ? 'selected' : 'all'} locations?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            if (hasSelectedLocations) {
              this.deleteLocations([...selectedLocationsSet]);
            } else {
              this.deleteAllLocations();
            }
          }
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel'
        }
      ]
    );
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    console.log('[DEBUG] rendering PendingLocations');
    const { locations, isReady } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <BackButton onPress={() => this.props.navigation.goBack()} />
          </Left>
          <Body>
            <Title>Pending Locations</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.refresh}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content>
          {(() => {
            if (!isReady) {
              return <Spinner />;
            }
            return (
              <List>
                <FlatList style={{ flex: 1, backgroundColor: '#fff' }}
                  data={locations}
                  keyExtractor={this._keyExtractor}
                  renderItem={({ item }) => {
                    const date = new Date(item.time);
                    return (
                      <LogItem
                        {...item}
                        onSelected={this.onLocationSelected}
                      />
                    );
                  }}
                />
              </List>
            );
          })()}
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this.onDelete}>
              <Text>Delete locations</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default PendingLocationsScene;
