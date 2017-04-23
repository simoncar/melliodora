
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
              <Icon name="ios-grid-outline" />
              <Text style={styles.linkText} >NEWS</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.channels(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-keypad-outline" />
              <Text style={styles.linkText}>CHANNELS</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.overview(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-stats" />
              <Text style={styles.linkText}> OVERVIEW</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.calendar(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-calendar-outline" />
              <Text style={styles.linkText}>CALENDAR</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.timeline(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-timer-outline" />
              <Text style={styles.linkText}>TIMELINE</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.profile(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-person-outline" />
              <Text style={styles.linkText}> PROFILE</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.widgets(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-grid" />
              <Text style={styles.linkText}>WIDGETS</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.settings(); this.props.closeDrawer(); }} iconLeft style={styles.links}>
              <Icon name="ios-settings-outline" />
              <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem>
            <ListItem button onPress={() => { Actions.feedback(); this.props.closeDrawer(); }} iconLeft style={styles.links} >
              <Icon name="ios-paper-outline" />
              <Text style={styles.linkText}>FEEDBACK</Text>
            </ListItem>

            <View style={styles.logoutContainer}>
              <View style={styles.logoutbtn} foregroundColor={'white'}>
                <Grid>
                  <Col>
                    <TouchableOpacity onPress={() => { Actions.login({ type: ActionConst.RESET  }); this.props.closeDrawer(); }} style={{ alignSelf: 'flex-start' }}>
                      <Text style={{ fontWeight: 'bold', color: '#fff' }}>LOG OUT</Text>
                      <Text note style={{ color: '#fff' }} >Kumar Sanket</Text>
                    </TouchableOpacity>
                  </Col>
                  <Col>
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { Actions.profile(); this.props.closeDrawer(); }}>
                      <Thumbnail source={require('../../../images/contacts/sanket.png')} style={styles.profilePic} />
                    </TouchableOpacity>
                  </Col>
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
