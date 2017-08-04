
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Content, Text, Icon, List, ListItem, Thumbnail } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { closeDrawer } from '../../actions/drawer';

import styles from './style';

class SideBar extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Image source={require('../../../images/sid.png')} style={styles.background} >
          <Content style={styles.drawerContent}>

            <ListItem button onPress={() => { Actions.homeNav(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-home" />
              <Text style={styles.linkText} >HOME</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.home(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-calendar-outline" />
              <Text style={styles.linkText} >CALENDAR</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.contact(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-call-outline" />
              <Text style={styles.linkText} >CONTACT</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.webportal(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="ios-grid" />
                <Text style={styles.linkText}>MYSTAMFORD</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.webportalSports(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="ios-football-outline" />
                <Text style={styles.linkText}>ATHLETICS</Text>
            </ListItem>

              <ListItem button onPress={() => { Actions.ptaHome(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                  <Icon name="ios-people-outline" />
                  <Text style={styles.linkText} >PTA</Text>
              </ListItem>


            <ListItem button onPress={() => { Actions.login(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="settings" />
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
          </Content>
        </Image>
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
