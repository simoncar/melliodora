

import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import { Drawer } from 'native-base';
import {
  createAppContainer,
  createStackNavigator,
  Header,
  NavigationActions,
  HeaderBackButton,
} from 'react-navigation';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';


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

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);




let Tabs = createMaterialBottomTabNavigator({ 
  homeNav: { screen: HomeNav },
  home: { screen: Home },
  chatmain: { screen: chatmain },
  webportal: { screen: Webportal },
  webportalSports: { screen: WebportalSports },
 },{
  shifting: true,
});


const MainScreenNavigator = createStackNavigator({
  
  Tab: { screen: Tabs },

  chatRooms: { screen: chatRooms },
  chat: { screen: chat },
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
  WebportalAuth: { screen: WebportalAuth },
  storyForm: { screen: StoryForm },

  navigationOptions: () => ({
    title: 'Title',
    headerStyle: {
      backgroundColor: 'green',
    },
  }),

});

export default createAppContainer(MainScreenNavigator);

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 18,
  },
});
