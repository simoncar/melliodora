
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem, Left, Body, Right } from 'native-base';

import { Grid, Col } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';


import styles from './styles';

const deviceWidth = Dimensions.get('window').width;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');



import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLz76NsS1fjNXcaGBUhcp9qA-MFg1Hrg8",
  authDomain: "calendarapp-b7967.firebaseapp.com",
  databaseURL: "https://calendarapp-b7967.firebaseio.com",
  storageBucket: "calendarapp-b7967.appspot.com"
};

//firebase.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);

function storeHighScore(userId, score) {
  firebase.database().ref('users/' + userId).set({
    highscore: score
  });
};


class Home extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }


  constructor(props) {
    super(props);
    this.tasksRef = firebaseApp.database().ref();
    this.state = {
      user:null,
      loading: true,
      newTask: ""
    };
  };

  componentDidMount(){
      // start listening for firebase updates
      this.listenForTasks(this.tasksRef);
    }

    //listener to get data from firebase and update listview accordingly
      listenForTasks(tasksRef) {
      tasksRef.on('value', (dataSnapshot) => {
        var tasks = [];
        dataSnapshot.forEach((child) => {
          tasks.push({
            name: child.val().name,
            _key: child.key
          });
        });

        this.setState({
          tasks:tasks
        });
      });
      }



  render() {


    // console.log("tasks value",this.state.tasks);
      // If we are loading then we display the indicator, if the account is null and we are not loading
      // Then we display nothing. If the account is not null then we display the account info.



    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Header>
          <Left>
            <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
          <Image source={headerLogo} style={styles.imageHeader} />
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.login({ type: ActionConst.RESET  })}>
              <Icon active name="power" />
            </Button>
          </Right>
        </Header>

        <Content showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <Swiper
                height={10}
                width={deviceWidth + 3}
                loop
                dot={<View style={styles.swiperDot} />}
                activeDot={<View
                  style={styles.swiperActiveDot}
                  showsButtons
                />}
              >
                <TouchableOpacity activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/Stamford Title pic.png')} >
                    <View style={styles.swiperTextContent} >

                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}></Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}></Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}></Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>

                <TouchableOpacity  activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/3.jpg')}>
                    <View style={styles.swiperTextContent}>
                      <Text numberOfLines={2} style={styles.newsPosterHeader}>
                            So that the applications are able to load faster and resize easily.
                        </Text>
                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}>CDC</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}>2hr ago</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}>ENVIRONMENT</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/4.jpg')}>
                    <View style={styles.swiperTextContent}>
                      <Text numberOfLines={2} style={styles.newsPosterHeader}>
                            But still look sharp on high-definition screens.
                        </Text>
                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}>SKY.com</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}>1day ago</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}>WORLD</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>
              </Swiper>
            </View>
          </View>

        <Card dataArray={this.state.tasks} style={{ backgroundColor: '#fff', marginTop: 0, marginRight: 0 }}
                                 renderRow={(abc) =>
                 <CardItem>
                     <Text style={styles.newsHeader}>{abc._key}</Text>
                 </CardItem>
             }>
         </Card>

          <Card style={{ backgroundColor: '#fff', marginTop: 0, marginRight: 0 }}>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      U12 Rugby Game
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>April 28, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>5:30 pm</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Stamford Field</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      U12 Rugby Game
                  </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      U12 Rugby Game
                  </Text>
              </View>
            </TouchableOpacity>

          </Card>
        </Content>
      </Container>
    );
  }
}


function renderRow() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
      <View style={styles.newsContent}>
        <Text numberOfLines={2} style={styles.newsHeader}>
              AAAAAAAA
          </Text>
        <Grid style={styles.swiperContentBox}>
          <Col style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <Text style={styles.newsLink}>May 20, 2017</Text>
            </TouchableOpacity>
            <Icon name="ios-time-outline" style={styles.timeIcon} />
            <Text style={styles.newsLink}>6:00 am</Text>
          </Col>
          <Col>
            <TouchableOpacity style={styles.newsTypeView}>
              <Text style={styles.newsTypeText}>Changi Airport</Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      </View>
    </TouchableOpacity>
  );
};


function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Home);
