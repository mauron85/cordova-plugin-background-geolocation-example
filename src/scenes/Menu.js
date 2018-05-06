import React, { PureComponent } from 'react';
import { StyleSheet, Platform } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
  Icon,
  List,
  ListItem,
  Text  
} from 'native-base';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import BackButton from '../components/BackButton';

const styles = StyleSheet.create({
  iconStyle: {
    color: '#0A69FE'
  }
});

class MenuScene extends PureComponent {
  static navigationOptions = {
    title: 'Menu',
    header: null
  };

  navigate(scene) {
    this.props.navigation.navigate(scene);
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <BackButton onPress={() => this.props.navigation.goBack()} />
          </Left>
          <Body>
            <Title>Menu</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List style={{ flex: 1, backgroundColor: '#fff' }}>
            <ListItem icon onPress={() => this.navigate('Logs')}>
              <Left>
                <Icon name="archive" style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>Plugin Logs</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => this.navigate('AllLocations')}>
              <Left>
                <Icon name="plane" style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>All Locations</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => this.navigate('PendingLocations')}>
              <Left>
                <Icon name="plane" style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>Pending Locations</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => this.navigate('Config')}>
              <Left>
                <Icon name="settings" style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>Plugin Configuration</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={BackgroundGeolocation.showAppSettings}>
              <Left>
                <Icon name={Platform.OS === 'web' ? 'settings' : 'ios-construct'} style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>Show App Settings</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={BackgroundGeolocation.showLocationSettings}>
              <Left>
                <Icon name="compass" style={styles.iconStyle} />
              </Left>
              <Body>
                <Text>Show Location Settings</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default MenuScene;
