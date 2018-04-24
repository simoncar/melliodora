
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';

import { closeDrawer } from './actions/drawer';

import Login from './components/login/';
import Home from './components/home/';
import phoneCalendar from './components/home/calendars';
import Search from './components/home/search';
import HomeNav from './components/homeNav/';
import Contact from './components/contact/';
import SideBar from './components/sideBar';
import Settings from './components/settings';
import ptaHome from './components/pta/ptaHome';
import ptaMovieNight from './components/pta/ptaMovieNight';
import ptaEvents from './components/pta/ptaEvents';
import ptaLionsDen from './components/pta/ptaLionsDen';
import Story from './components/story';
import campusMap from './components/campusMap';
import chatRooms from './components/chat/chatRooms';
import chat from './components/chat';
import Webportal from './components/webportal';
import WebportalAuth from './components/webportal/auth';
import WebportalSports from './components/webportalSports';

import { statusBarColor } from './themes/base-theme';


const RouterWithRedux = connect()(Router);

class AppNavigator extends Component {

  static propTypes = {
    drawerState: PropTypes.string,
    closeDrawer: PropTypes.func,
  }

  componentDidUpdate() {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this._drawer._root.close();
    }
  }

  openDrawer() {
    console.log('openDrawer() {');
    this._drawer._root.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }


  render() {  // eslint-disable-line class-methods-use-this
    return (
      <Drawer
        ref={(ref) => { this._drawer = ref; }}
        type="overlay"
        tweenDuration={150}
        content={<SideBar navigator={this._navigator} />}
        tapToClose
        acceptPan={false}
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        styles={{
          drawer: {
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 3,
          },
        }}
        tweenHandler={(ratio) => {  //eslint-disable-line
          return {
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: {
              opacity: (2 - ratio) / 2,
            },
          };
        }}
        negotiatePan
      >
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle="light-content"
        />

        <RouterWithRedux>
          <Scene key="root">
            <Scene key="homeNav" component={HomeNav} hideNavBar initial={true}/>
            <Scene key="chatRooms" component={chatRooms} hideNavBar />
            <Scene key="chat" component={chat} hideNavBar />
            <Scene key="search" component={Search} hideNavBar />
            <Scene key="home" component={Home} hideNavBar />
            <Scene key="phoneCalendar" component={phoneCalendar} />
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="contact" component={Contact} />
            <Scene key="sideBar" component={SideBar} />
            <Scene key="settings" component={Settings} />
            <Scene key="ptaHome" component={ptaHome} hideNavBar />
            <Scene key="ptaMovieNight" component={ptaMovieNight} hideNavBar />
            <Scene key="ptaLionsDen" component={ptaLionsDen} hideNavBar />
            <Scene key="ptaEvents" component={ptaEvents} hideNavBar />
            <Scene key="story" component={Story} hideNavBar />
            <Scene key="campusMap" component={campusMap} hideNavBar />
            <Scene key="webportal" component={Webportal} hideNavBar />
            <Scene key="WebportalAuth" component={WebportalAuth} hideNavBar />
            <Scene key="webportalSports" component={WebportalSports} hideNavBar />
          </Scene>
        </RouterWithRedux>
      </Drawer>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
});

export default connect(mapStateToProps, bindAction)(AppNavigator);
