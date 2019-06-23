import React from "react";
import { StyleSheet } from "react-native";

import { createAppContainer, createStackNavigator } from "react-navigation";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
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
import beacon from "./components/beacon";
import beaconHistory from "./components/beacon/beaconHistory";

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
    navigationOptions: ({ navigation }) => ({
      title: "Stamford",
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 28
      },
      headerRight: (
        <BorderlessButton
          onPress={() => navigation.navigate("settings")}
          style={{ marginRight: 15 }}
        >
          <Entypo name="cog" style={{ fontSize: 25 }} />
        </BorderlessButton>
      )
    })
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
