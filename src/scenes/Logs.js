import React, { PureComponent } from 'react';
import { InteractionManager, FlatList } from 'react-native';
import {
  Container,
  Header,
  Right,
  Left,
  Content,
  Body,
  Title,
  List,
  ListItem,
  Text,
  Button,
  Icon,
  Spinner
} from 'native-base';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import BackButton from '../components/BackButton';
import logFormatter from '../utils/logFormatter';

class LogsScene extends PureComponent {
  static navigationOptions = {
    title: 'Logs',
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      logEntries: []
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refresh();
    });
  }

  refresh() {
    this.setState({ isRefreshing: true });
    BackgroundGeolocation.getLogEntries(100, logEntries => {
      this.setState({
        isRefreshing: false,
        logEntries: logFormatter(logEntries)
      });
    });
  }

  _keyExtractor = (item, index) => item.id;

  renderContent(logEntries) {
    return (
      <List>
        <FlatList
          style={{ flex: 1, backgroundColor: '#fff' }}
          data={logEntries}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => (
            <ListItem
              style={{
                marginLeft: 2,
                backgroundColor: item.style.backgroundColor
              }}
            >
              <Text
                style={{
                  color: item.style.color
                }}
              >
                {item.text}
              </Text>
            </ListItem>
          )}
        />
      </List>
    );
  }

  render() {
    const { logEntries, isRefreshing } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <BackButton onPress={() => this.props.navigation.goBack()} />
          </Left>
          <Body>
            <Title>Logs</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.refresh}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content>
          {(() => {
            if (isRefreshing) {
              return <Spinner />;
            }
            return this.renderContent(logEntries);
          })()}
        </Content>
      </Container>
    );
  }
}

export default LogsScene;
