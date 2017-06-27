

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Item, Input, Left, Right, Body } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { openDrawer } from '../../actions/drawer';
import HeaderContent from './../headerContent/';

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
    };

    this.constructor.childContextTypes = {
      theme: PropTypes.object,
    };
  }

  render() {
    return (
      <Container contentOffset={this.state.offset} scrollEnabled={false} >
  <Image source={require('../../../images/BG-signUp.png')} style={styles.container} >
          <HeaderContent />



          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.contentIconsContainer}>
              <Grid>
              <Row>
                <Col style={{ width: 40 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Icon name="ios-call-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                  </Button>
                </Col>
                <Col>
                    <Text style={styles.feedbackHeader}>Call Parent Helpdesk</Text>
                    <Text style={styles.feedbackHead}>We will respond quickly to answer your questions.</Text>
                </Col>
             </Row>
             <Row>
               <Col style={{ width: 40 }}>
                 <Button transparent style={styles.roundedButton}>
                   <Icon name="ios-mail-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                 </Button>
               </Col>
               <Col>
                   <Text style={styles.feedbackHeader}>Email Helpdesk</Text>
                   <Text style={styles.feedbackHead}>We will respond quickly to answer your questions.</Text>
               </Col>
            </Row>
            <Row>
              <Col style={{ width: 40 }}>
                <Button transparent style={styles.roundedButton}>
                  <Icon name="ios-pin-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                </Button>
              </Col>
              <Col>
                  <Text style={styles.feedbackHeader}>School Address</Text>
                  <Text style={styles.feedbackHead}>We will respond quickly to answer your questions.</Text>
              </Col>
           </Row>

            </Grid>




            </View>
            <View style={styles.feedbackHeaderContainer}>
              <Text style={styles.feedbackHeader}>INQUIRY</Text>
              <Text note style={styles.feedbackHead}>We will respond quickly to answer your questions.</Text>
            </View>
            <View style={styles.feedbackContainer}>
              <Item rounded style={styles.inputGrp}>
                <Icon name="ios-person-outline" />
                <Input placeholder="Name" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
              </Item>
              <Item rounded style={styles.inputGrp}>
                <Icon name="ios-mail-outline" />
                <Input placeholder="Email" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
              </Item>


              <View style={styles.feedbackInputBox}>
                  <Item iconRight>
                    <Input placeholder="Write something..." placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
                    <Icon active name="arrow-forward" style={styles.forwardIcon} />
                  </Item>
              </View>
            </View>
          </Content>
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
});

export default connect(mapStateToProps, bindAction)(Contact);
