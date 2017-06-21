
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
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Image source={require('../../../images/sid.png')} style={styles.background} >
          <Content style={styles.drawerContent}>
            <ListItem button onPress={() => { Actions.home(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-calendar-outline" />
              <Text style={styles.linkText} >CALENDAR</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.overview(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="ios-paper-outline" />
                <Text style={styles.linkText} >NEWSLETTERS</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.webportal(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="ios-grid" />
                <Text style={styles.linkText}>myStamford</Text>
            </ListItem>

            <ListItem button onPress={() => { Actions.login(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
                <Icon name="settings" />
                <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem>

            <View style={styles.logoutContainer}>
              <View style={styles.logoutbtn} foregroundColor={'white'}>
                <Grid>


                </Grid>
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
