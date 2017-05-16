
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';

import { closeDrawer } from './actions/drawer';

import Login from './components/login/';
import Home from './components/home/';
import SignUp from './components/sign-up/';
import Feedback from './components/feedback/';
import Comments from './components/comments/';
import Profile from './components/profile/';
import Calendar from './components/calendar/';
import Walkthrough from './components/walkthrough/';
import SideBar from './components/sideBar';
import Settings from './components/settings';
import Channel from './components/channel';
import Channels from './components/channels';
import Overview from './components/overview';
import Story from './components/story';
import Timeline from './components/timeline';
import Widgets from './components/widgets';
import NeedHelp from './components/needhelp';
import { statusBarColor } from './themes/base-theme';


const RouterWithRedux = connect()(Router);

class AppNavigator extends Component {

  static propTypes = {
    drawerState: React.PropTypes.string,
    closeDrawer: React.PropTypes.func,
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
            <Scene key="login" component={Login} hideNavBar initial={true} />
            <Scene key="signUp" component={SignUp} />
            <Scene key="needhelp" component={NeedHelp} />
            <Scene key="home" component={Home} />
            <Scene key="feedback" component={Feedback} />
            <Scene key="comments" component={Comments} />
            <Scene key="profile" component={Profile} />
            <Scene key="walkthrough" component={Walkthrough} />
            <Scene key="sideBar" component={SideBar} />
            <Scene key="settings" component={Settings} />
            <Scene key="channel" component={Channel} />
            <Scene key="channels" component={Channels} />
            <Scene key="calendar" component={Calendar} />
            <Scene key="overview" component={Overview} />
            <Scene key="story" component={Story} />
            <Scene key="timeline" component={Timeline} />
            <Scene key="widgets" component={Widgets} />
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
