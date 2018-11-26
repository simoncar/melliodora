

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import {Constants } from 'expo';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Item, Input, Left, Right, Body } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { openDrawer } from '../../actions/drawer';
import HeaderContent from './../headerContent/header/';
import Analytics from '../../lib/analytics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Communications from 'react-native-communications';
import updateFirebase from './../../lib/updateFirebase';

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;

class Contact extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }
  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0,
      },
      updateFirebaseText: ''
    };

  

//analytics  -----
    let trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
    };
 
      Analytics.identify(global.username, trackingOpts);
      Analytics.track(Analytics.events.PAGE_CONTACT, trackingOpts);
//analytics --------


  }

  _call() {
    //TODO: only show email/phone links when there are values
      Communications.phonecall(global.switch_call, true);
  }

  _email() {
    //TODO: only show email/phone links when there are values
      Communications.email(global.switch_contactEmail , null, null, null, null)
  }

  _emailComms() {
    //TODO: only show email/phone links when there are values
      Communications.email(global.switch_helpEmail, null, null, null, null)
  }

  _updateFirebase() {
    console.log('update firebase')
    updateFirebase();
      this.setState({updateFirebaseText: 'Another golf day booked!'})
  }

  render() {
    return (
      <Container contentOffset={this.state.offset} scrollEnabled={false} >
           <HeaderContent />
      <View  style={styles.container} >

          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.contentIconsContainer}>
              <Grid>
                <Row>
                  <Col style={{ width: 80 }}>
                    <Button transparent style={styles.roundedButton}  onPress={() => this._emailComms()} >
                      <MaterialCommunityIcons name="help" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                    </Button>
                  </Col>
                  <Col>
                      <Text style={styles.feedbackHeader}>Help with this App</Text>
                      <Text style={styles.feedbackHead}>{global.switch_helpEmail }</Text>
                  </Col>
               </Row>

             <Row style={{paddingTop: 20}}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}  onPress={() => this._call()} >
                    <Icon name="ios-call" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                  </Button>
                </Col>
                <Col>
                    <Text style={styles.feedbackHeader}>Call</Text>
                    <Text style={styles.feedbackHead}>{global.switch_call}</Text>
                </Col>
             </Row>
             <Row style={{paddingTop: 20}}>
               <Col style={{ width: 80 }}>
                 <Button transparent style={styles.roundedButton}  onPress={() => this._email()} >
                   <Icon name="ios-mail" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                 </Button>
               </Col>
               <Col>
                   <Text style={styles.feedbackHeader}>Email</Text>
                   <Text style={styles.feedbackHead}>{global.switch_contactEmail}</Text>
               </Col>
            </Row>
             <Row style={{paddingTop: 20}}>
              <Col style={{ width: 80 }}>
                <Button transparent style={styles.roundedButton}>
                  <Icon name="ios-pin" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                </Button>
              </Col>
              <Col>
                  <Text style={styles.feedbackHeader}>Visit</Text>
                  <Text style={styles.feedbackHead}>{global.switch_address}</Text>
              </Col>
           </Row>

             <Row style={{paddingTop: 40}}>
              <Col style={{ width: 80 }}>
                <Button transparent style={styles.roundedButton}  onPress={() => this._updateFirebase()} >
                    <Icon name="ios-thumbs-up" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                </Button>
              </Col>
              
              {Constants.manifest.extra.instance == '0001-sais_edu_sg' &&
              <Col>
                  <Text style={styles.feedbackHeader}>'Written by Parents for Parents'</Text>
                  <Text style={styles.feedbackHead}>This App has been written by SAIS Parents Simon Cariss and Matt Crosby, with support from parents primarily Niall Foley who has helped us along the way</Text>
                  <Text style={styles.feedbackHead}>Matt and Simon are on the PTA board this year, if you have app feedback or suggestions or would like to help out, let us know.</Text>

                  <Text style={styles.updateNotes}>{this.state.updateFirebaseText}</Text>
                  <Text style={styles.spacer}>

                  </Text>

                  </Col>
              }
 </Row>

          <Row style={{paddingTop: 40}}>
              <Col style={{ width: 80 }}>
              <Button transparent style={styles.roundedButton}  onPress={() => Actions.chatRooms()} >
              <Icon name="ios-chatbubbles" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                     </Button>
              </Col>
              
              {Constants.manifest.extra.instance == '0001-sais_edu_sg' &&
              <Col>
                  <Text style={styles.feedbackHeader}>Chat Rooms</Text>
                  <Text style={styles.feedbackHead}>NOTE, Experimental</Text>
                  <Text style={styles.feedbackHead}>These are not acitve</Text>      
                  <Text style={styles.feedbackHead}></Text>    
                  <Text style={styles.feedbackHead}></Text>    
                  </Col>
              }

 
                    
        
            </Row>
            </Grid>
            </View>

          </Content>
        </View>

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
});

export default connect(mapStateToProps, bindAction)(Contact);
