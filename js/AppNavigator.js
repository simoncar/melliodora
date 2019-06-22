import React, { Component } from "react";
import { StatusBar, StyleSheet } from "react-native";


import {
  createAppContainer,
  createStackNavigator,
  Header,
  NavigationActions,
  HeaderBackButton
} from "react-navigation";

import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Login from "./components/login/";
import Home from "./components/home/";
import phoneCalendar from "./components/home/calendars";
import HomeNav from "./components/homeNav/";
import Contact from "./components/contact";

import Settings from "./components/settings";

import Story from "./components/story";
import StoryForm from "./components/story/form";
import campusMap from "./components/campusMap";
import chatRooms from "./components/chat/chatRooms";
import form from "./components/chat/form";
import chat from "./components/chat";
import chatmain from "./components/chat/main";
import Webportal from "./components/webportal";
import WebportalAuth from "./components/webportal/auth";
import WebportalSports from "./components/webportalSports";
import CustomHeader from "./CustomHeader";
import beacon from "./components/beacon";
import beaconHistory from "./components/beacon/beaconHistory";

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

let Tabs = createMaterialBottomTabNavigator(
  {
    homeNav: { screen: HomeNav },
    home: { screen: Home },
    chatRooms: { screen: chatRooms },
    webportal: { screen: Webportal },
    webportalSports: { screen: WebportalSports }
  },
  {
    shifting: true
  }
);

const MainScreenNavigator = createStackNavigator({
  Tab: {
    screen: Tabs,
    navigationOptions: {
      title: "Stamford",
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 28
      }
    }
  },

  chatmain: { screen: chatmain },
  chat: { screen: chat },
  phoneCalendar: { screen: phoneCalendar },
  login: { screen: Login },
  contact: { screen: Contact },
  settings: { screen: Settings },
  form: { screen: form },
  story: { screen: Story },
  campusMap: { screen: campusMap },
  WebportalAuth: { screen: WebportalAuth },
  storyForm: { screen: StoryForm },
  beacon: { screen: beacon },
  beaconHistory: { screen: beaconHistory },

  defaultNavigationOptions: () => ({
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  }),

  navigationOptions: () => ({
    title: "Title",
    headerStyle: {
      backgroundColor: "green"
    }
  })
});

export default createAppContainer(MainScreenNavigator);

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  paragraph: {
    fontSize: 18
  }
});
