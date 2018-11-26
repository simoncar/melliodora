
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ImageBackground, Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Content, Text, Icon, List, ListItem, Thumbnail } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { closeDrawer } from '../../actions/drawer';
import { Constants } from 'expo';
import styles from './style';

var instID = Constants.manifest.extra.instance;

class SideBar extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <ImageBackground source={require('../../../images/sid.png')} style={styles.background} >
   
          <Content style={styles.drawerContent}>

            <ListItem button onPress={() => { Actions.homeNav(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-home" />
              <Text style={styles.linkText} >HOME</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.home(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-calendar" />
              <Text style={styles.linkText} >CALENDAR</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.contact(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-call" />
              <Text style={styles.linkText} >CONTACT</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.webportal(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="ios-grid" />
                <Text style={styles.linkText}>{global.switch_portalName}</Text>
            </ListItem>

       {instID == '0001-sais_edu_sg' &&
          <View>
                <ListItem button onPress={() => { Actions.webportalSports(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                    <Icon name="ios-football" />
                    <Text style={styles.linkText}>ATHLETICS</Text>
                </ListItem>
                <ListItem button onPress={() => { Actions.ptaHome(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                    <Icon name="ios-people" />
                    <Text style={styles.linkText} >PTA</Text>
                </ListItem>
                <ListItem button onPress={() => { Actions.campusMap(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                    <Icon name="ios-map" />
                    <Text style={styles.linkText} >SCHOOL MAP</Text>
                </ListItem>
                <ListItem button onPress={() => { Actions.login(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                    <Icon name="md-settings" />
                    <Text style={styles.linkText}>SETTINGS</Text>
                </ListItem>
                            

                <View style={styles.logoutContainer}>
                  <View style={styles.logoutbtn} foregroundColor={'white'}>
                      <Image
                          style={{width: 96, height: 128}}
                          source={require('../../../images/sais.edu.sg/pta_logo.png')}
                      />
                  </View>
                </View>
          </View>
       }

          </Content>
          </ImageBackground>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SideBar);
