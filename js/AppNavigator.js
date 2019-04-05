

import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { Drawer } from 'native-base';
import {
  createAppContainer,
  createStackNavigator,
  Header,
  NavigationActions,
  HeaderBackButton,
} from 'react-navigation';

import { closeDrawer } from './actions/drawer';

import Login from './components/login/';
import Home from './components/home/';
import phoneCalendar from './components/home/calendars';
import HomeNav from './components/homeNav/';
import Contact from "./components/contact";
import SideBar from './components/sideBar';
import Settings from './components/settings';
import ptaHome from './components/pta/ptaHome';
import ptaMovieNight from './components/pta/ptaMovieNight';
import ptaEvents from './components/pta/ptaEvents';
import ptaLionsDen from './components/pta/ptaLionsDen';
import Story from './components/story';
import StoryForm from './components/story/form';
import campusMap from './components/campusMap';
import chatRooms from './components/chat/chatRooms';
import imageUploadTest from './components/chat/imageUploadTest';
import form from './components/chat/form';
import chat from './components/chat';
import chatmain from './components/chat/main';
import Webportal from './components/webportal';
import WebportalAuth from './components/webportal/auth';
import WebportalSports from './components/webportalSports';



const Stack = createStackNavigator(
  {
  homeNav: { screen: HomeNav },
  chatmain: { screen: chatmain },
  chatRooms: { screen: chatRooms },
  chat: { screen: chat },
  home: { screen: Home },
  phoneCalendar: { screen: phoneCalendar },
  login: { screen: Login },
  contact: { screen: Contact },
  sideBar: { screen: SideBar },
  settings: { screen: Settings },
  imageUploadTest: { screen: imageUploadTest },
  form: { screen: form },
  ptaHome: { screen: ptaHome },
  ptaMovieNight: { screen: ptaMovieNight },
  ptaLionsDen: { screen: ptaLionsDen },
  ptaEvents: { screen: ptaEvents },
  story: { screen: Story },
  campusMap: { screen: campusMap },
  webportal: { screen: Webportal },
  WebportalAuth: { screen: WebportalAuth },
  webportalSports: { screen: WebportalSports },
  storyForm: { screen: StoryForm },
},

 {
  initialRouteName: 'homeNav',
 });

 const StackAppContainer = createAppContainer(Stack);

class AppNavigator extends Component {

  componentDidUpdate() {
   
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


  render() {  
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
        />
            <StackAppContainer
        onNavigationStateChange={state => console.log(state)}
      />
      
      </Drawer>
      
    );
  }
}


export default (AppNavigator);
