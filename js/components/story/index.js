import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Slider, Dimensions, Share  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import Lightbox from 'react-native-lightbox';
import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const deviceWidth = Dimensions.get('window').width;
const primary = require('../../themes/variable').brandPrimary;

const renderPagination = (index, total, context) => (
  <View style={{ position: 'absolute', bottom: -25, right: 10 }}>
    <Text>
      <Text style={{ color: '#007aff', fontSize: 20 }}>
        {index + 1}
      </Text>
                /{total}
    </Text>
  </View>
    );

class Story extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({key: React.PropTypes.string}),
      username: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      animationType: 'slideInDown',
      open: false,
      value: 0,
    };

  }

 _shareMessage() {


    Share.share({
      message: "" + this.props.eventTitle + "\nWhen: " +  this.props.eventTime + " - " + this.props.eventDate,
      title: '' + this.props.eventImage
    })
    .then(this._showResult)
    .catch((error) => this.setState({result: 'error: ' + error.message}));
  };

  modalO() {
    this.setState({ open: true });
  }

  modalX() {
    this.setState({ open: false });
  }

  render() {


    console.log('here');


    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>

          <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" style={styles.headerIcons} />
              </Button>
          </Left>

              <Right>

              <Button transparent onPress={() => this._shareMessage()} >

                <Icon name="md-share" style={styles.headerIcons} />
              </Button>
              </Right>

          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#fff' }}>
                <View style={styles.newsContent}>
                      <TouchableOpacity>
                        <Text style={styles.eventTitle}>{this.props.eventTitle}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}></Text>

                        <Text style={styles.newsTypeText}>{this.props.location}</Text>
                      </TouchableOpacity>

                  <Text style={styles.newsHeader}>

                  </Text>
                </View>

                <View style={{ padding: 20 }}>
                  <View>
                  <Text style={styles.eventTitle}>
                   {"\n"}
                </Text>

                    <Text style={styles.eventTitle}>
                    {this.props.eventStartTime} - {this.props.eventEndTime}
                  </Text>
                  <Text style={styles.eventTitle}>

                  {this.props.eventDate}
                </Text>
                  </View>
                </View>

              </View>
            </View>
          </Content>

          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open: false })}
            onRequestClose={() => this.setState({ open: false })}
            style={styles.modal}
          >

            <View>
              <View style={styles.modalContentBox}>
                <Grid style={{ flex: 10, padding: 20 }}>
                  <Col style={{ paddingLeft: 30 }}>
                    <Button transparent style={styles.dayButton}>
                      <Icon
                        name="ios-sunny-outline"
                        style={{ color: primary, fontSize: 26 }}
                      />
                    </Button>
                  </Col>
                  <Col style={{ paddingLeft: 80 }}>
                    <Button transparent style={styles.nightButton}>
                      <Icon
                        name="ios-moon-outline"
                        style={{ fontSize: 26, color: '#fff' }}
                      />
                    </Button>
                  </Col>
                </Grid>
              </View>
              <View style={styles.modalContentBox}>
                <Grid style={{ padding: 20, paddingBottom: 15, justifyContent: 'center' }}>
                  <Col>
                    <Text
                      style={Platform.OS === 'android' ?
                                                { fontSize: 12, marginTop: 8 } :
                                                { fontSize: 12, marginTop: 8 }}
                    >
                                            CHOOSE TYPESPACE
                                        </Text>
                  </Col>
                  <Col>
                    <Button transparent iconRight style={{ marginTop: -5 }}>
                      <Text style={{ color: '#FFF' }}>SANS SERIF</Text>
                      <Icon name="ios-arrow-forward" style={{ fontSize: 28 }} />
                    </Button>
                  </Col>
                </Grid>
              </View>
              <View>
                <Grid style={{ flexDirection: 'row', paddingTop: 20 }}>
                  <Col>
                    <Text style={styles.modalSmallText}>A</Text>
                  </Col>
                  <Col style={{ alignSelf: 'flex-end' }}>
                    <Text style={styles.modalLargeText}>A</Text>
                  </Col>
                </Grid>
                <Slider
                  {...this.props} minimumTrackTintColor="#fff"
                  onValueChange={value => this.setState({ value })}
                />
              </View>
            </View>
          </Modal>
        </Image>
      </Container>
    );
  }
}




function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  username: state.username
});

export default connect(mapStateToProps, bindAction)(Story);
