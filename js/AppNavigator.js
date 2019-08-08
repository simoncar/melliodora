import React from "react";

import { createAppContainer, createStackNavigator, createBottomTabNavigator } from "react-navigation";
import { MaterialIcons, Ionicons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import Login from "./components/login/";
import Home from "./components/home/";
import phoneCalendar from "./components/home/calendars";
import HomeNav from "./components/homeNav/";
import Contact from "./components/contact";
import Settings from "./components/settings";
import Library from "./components/settings/library";
import Logs from "./components/settings/logs";
import adminPassword from "./components/settings/adminPassword";
import selectLanguage from "./components/settings/language";
import Story from "./components/story";
import StoryForm from "./components/story/form";
import campusMap from "./components/campusMap";
import chatRooms from "./components/chat/chatRooms";
import form from "./components/chat/form";
import chat from "./components/chat";
import push from "./components/story/push";
import chatmain from "./components/chat/main";
import authPortal from "./components/webportalURL/authPortal";
import WebportalURL from "./components/webportalURL";
import beacon from "./components/beacon";
import beaconHistory from "./components/beacon/beaconHistory";
import AttendanceOverviewScreen from "./components/beacon/AttendanceOverviewScreen";
import GradeListingScreen from "./components/beacon/GradeListingScreen";
import ClassListingScreen from "./components/beacon/ClassListingScreen";
import AttendeeListingScreen from "./components/beacon/AttendeeListingScreen";
import AttendeeDetailScreen from "./components/beacon/AttendeeDetailScreen";
import BookmarkScreen from "./components/beacon/BookmarkScreen";

import BeaconSearch from "./components/beacon/BeaconSearch";

import I18n from "./lib/i18n";

let StackHome = createStackNavigator(
  {
    homeNav: { screen: HomeNav },
    contact: { screen: Contact },
    form: { screen: form },
    story: { screen: Story },
    push: { screen: push },
    campusMap: { screen: campusMap },
    storyForm: { screen: StoryForm },
  },
  {
    navigationOptions: {
      title: I18n.t("home"),
      headerBackTitle: null,
      tabBarIcon: ({ focused, tintColor, horizontal }) => (
        <Ionicons name="ios-home" size={horizontal ? 20 : 25} color={tintColor} />
      ),
    },
  },
);

let StackCalendar = createStackNavigator(
  {
    home: { screen: Home },
    phoneCalendar: { screen: phoneCalendar },
    storyCalendar: { screen: Story },
  },
  {
    navigationOptions: {
      title: I18n.t("calendar"),
      headerBackTitle: null,
      tabBarIcon: ({ focused, tintColor, horizontal }) => (
        <Ionicons name="ios-calendar" size={horizontal ? 20 : 25} color={tintColor} />
      ),
    },
  },
);

let StackChat = createStackNavigator(
  {
    chatRooms: { screen: chatRooms },
    chatmain: { screen: chatmain },
    chat: { screen: chat },
    selectLanguageChat: { screen: selectLanguage },
  },
  {
    navigationOptions: {
      title: I18n.t("chat"),
      headerBackTitle: null,
      tabBarIcon: ({ focused, tintColor, horizontal }) => (
        <SimpleLineIcons name="bubble" size={horizontal ? 20 : 25} color={tintColor} />
      ),
    },
  },
);

let StackWeb = createStackNavigator(
  {
    authPortal: { screen: authPortal },
    login: { screen: Login },
  },
  {
    navigationOptions: {
      title: "myS",
      headerBackTitle: null,
      tabBarIcon: ({ focused, tintColor, horizontal }) => (
        <MaterialIcons name="web" size={horizontal ? 20 : 25} color={tintColor} />
      ),
    },
  },
);

let StackOther = createStackNavigator(
  {
    settings: { screen: Settings },
    library: { screen: Library },
    logs: { screen: Logs },
    webportalURL: { screen: WebportalURL },
    selectLanguage: { screen: selectLanguage },
    adminPassword: { screen: adminPassword },
    beacon: { screen: beacon },
    AttendanceOverviewScreen: { screen: AttendanceOverviewScreen },
    GradeListingScreen: { screen: GradeListingScreen },
    ClassListingScreen: { screen: ClassListingScreen },
    AttendeeListingScreen: { screen: AttendeeListingScreen },
    beaconHistory: { screen: beaconHistory },
    AttendeeDetailScreen: { screen: AttendeeDetailScreen },
    BookmarkScreen: { screen: BookmarkScreen },
    BeaconSearch: { screen: BeaconSearch },
  },
  {
    navigationOptions: {
      title: I18n.t("more"),
      headerBackTitle: null,
      tabBarIcon: ({ focused, tintColor, horizontal }) => (
        <Feather name="menu" size={horizontal ? 20 : 25} color={tintColor} />
      ),
    },
  },
);

let Tabs = createBottomTabNavigator(
  {
    homeNav: StackHome,
    home: StackCalendar,
    chatRooms: StackChat,
    webportal: StackWeb,
    other: StackOther,
  },
  {
    shifting: false,
    labeled: true,
    activeColor: "#1278F1",
    inactiveColor: "#5D6870",
    barStyle: { backgroundColor: "#F7F7F7" },
  },
);

const MainScreenNavigator = createStackNavigator(
  {
    Tab: {
      screen: Tabs,
    },

    authPortal: { screen: authPortal },

    defaultNavigationOptions: () => ({
      headerStyle: {
        backgroundColor: "#f4511e",
      },
      headerBackTitle: null,
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }),
  },

  {
    headerMode: "none",
  },
);

const RootStack = createStackNavigator({
  mode: "modal",
  headerMode: "none",
});

export default createAppContainer(MainScreenNavigator);
