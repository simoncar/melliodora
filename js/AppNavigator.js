import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import BottomTabBar from "react-navigation-selective-tab-bar";
import _ from "lodash";

import { MaterialIcons, Ionicons, SimpleLineIcons, Feather } from "@expo/vector-icons";

import Calendar from "./components/calendar";
import phoneCalendar from "./components/calendar/calendars";
import Home from "./components/home";
import Search from "./components/search";
import Contact from "./components/contact";
import ContactAdmin from "./components/contact/ContactAdmin";
import Settings from "./components/settings";
import Library from "./components/settings/library";
import Logs from "./components/settings/logs";
import adminPassword from "./components/settings/adminPassword";
import selectLanguage from "./components/settings/language";
import MoreAdmin from "./components/settings/MoreAdmin";
import Content from "./components/settings/content";
import Story from "./components/story";
import StoryForm from "./components/story/form";
import campusMap from "./components/campusMap";
import chatRooms from "./components/chat/chatRooms";
import chatTitle from "./components/chat/chatTitle";
import chat from "./components/chat";
import push from "./components/story/push";
import authPortal from "./components/webportalURL/authPortal";
import WebportalURL from "./components/webportalURL";
import I18n from "./lib/i18n";
import LoginScreen from "./components/auth/LoginScreen";
import SignUpScreen from "./components/auth/SignUpScreen";
import ForgotPasswordScreen from "./components/auth/ForgotPasswordScreen";
import CameraApp from "./components/auth/CameraApp";
import UserProfile from "./components/auth/UserProfile";
import EditUserProfile from "./components/auth/EditUserProfile";
import UserSearch from "./components/settings/UserSearch";
import stylesGlobal from "./themes/globalTheme";

let StackHome = createStackNavigator(
  {
    homeNav: { screen: Home },
    contact: { screen: Contact },
    contactAdmin: { screen: ContactAdmin },
    story: { screen: Story },
    push: { screen: push },
    campusMap: { screen: campusMap },
    storyForm: { screen: StoryForm },
    authPortalStory: { screen: authPortal },
    searchCalendarHome: { screen: Search },
    webportalURL: { screen: WebportalURL }
  },
  {
    defaultNavigationOptions: {
      headerTitleStyle: {
        ...Platform.select({
          ios: { fontFamily: "Arial" },
          android: { fontFamily: "Roboto" }
        }),
        fontSize: stylesGlobal.navbarFontSize
      }
    }
  }
);

StackHome.navigationOptions = ({ navigation }) => {
  return {
    title: I18n.t("home"),
    headerBackTitle: null,
    tabBarIcon: ({ focused, tintColor, horizontal }) => <Ionicons name="ios-home" size={horizontal ? 20 : 25} color={tintColor} />
  };
};

let StackCalendar = createStackNavigator(
  {
    home: { screen: Calendar },
    phoneCalendar: { screen: phoneCalendar },
    storyCalendar: { screen: Story },
    searchCalendar: { screen: Search }
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTitleStyle: {
        ...Platform.select({
          ios: { fontFamily: "Arial" },
          android: { fontFamily: "Roboto" }
        }),
        fontSize: stylesGlobal.navbarFontSize
      }
    }
  }
);

StackCalendar.navigationOptions = ({ navigation }) => {
  return {
    title: I18n.t("calendar"),
    headerBackTitle: null,
    tabBarIcon: ({ focused, tintColor, horizontal }) => <Ionicons name="ios-calendar" size={horizontal ? 20 : 25} color={tintColor} />
  };
};

let StackChat = createStackNavigator(
  {
    chatRooms: { screen: chatRooms },
    chatTitle: { screen: chatTitle },
    chat: { screen: chat },
    selectLanguageChat: { screen: selectLanguage }
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTitleStyle: {
        ...Platform.select({
          ios: { fontFamily: "Arial" },
          android: { fontFamily: "Roboto" }
        }),
        fontSize: stylesGlobal.navbarFontSize
      }
    }
  }
);

StackChat.navigationOptions = ({ navigation }) => {
  return {
    title: I18n.t("chat"),
    tabBarIcon: ({ focused, tintColor, horizontal }) => <SimpleLineIcons name="bubble" size={horizontal ? 20 : 25} color={tintColor} />
  };
};

let StackWeb = createStackNavigator({
  authPortal: { screen: authPortal }
});

StackWeb.navigationOptions = ({ navigation }) => {
  const title = global.switch_tab_portalName;
  return {
    title,
    headerBackTitle: null,
    tabBarIcon: ({ focused, tintColor, horizontal }) => <MaterialIcons name="web" size={horizontal ? 20 : 25} color={tintColor} />
  };
};

let StackOther = createStackNavigator(
  {
    settings: { screen: Settings },
    library: { screen: Library },
    logs: { screen: Logs },
    storyMore: { screen: Story },
    moreAdmin: { screen: MoreAdmin },
    Content: { screen: Content },
    webportalURL: { screen: WebportalURL },
    selectLanguage: { screen: selectLanguage },
    adminPassword: { screen: adminPassword },
    login: { screen: LoginScreen },
    signup: { screen: SignUpScreen },
    forgetpassword: { screen: ForgotPasswordScreen },
    CameraApp: { screen: CameraApp },
    UserProfile: { screen: UserProfile },
    UserSearch: { screen: UserSearch },
    EditUserProfile: { screen: EditUserProfile }
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTitleStyle: {
        ...Platform.select({
          ios: { fontFamily: "Arial" },
          android: { fontFamily: "Roboto" }
        }),
        fontSize: stylesGlobal.navbarFontSize
      }
    }
  }
);

StackOther.navigationOptions = ({ navigation }) => {
  return {
    title: I18n.t("more"),
    headerBackTitle: null,
    tabBarIcon: ({ focused, tintColor, horizontal }) => <Feather name="menu" size={horizontal ? 20 : 25} color={tintColor} />
  };
};
// console.log("global.domain", global.domain);
// const webportal = global.domain == "sais_edu_sg" ? { webportal: StackWeb } : {}
let Tabs = createBottomTabNavigator(
  {
    homeNav: StackHome,
    home: StackCalendar,
    chatRooms: StackChat,
    webportal: StackWeb,
    other: StackOther
  },
  {
    shifting: false,
    labeled: true,
    activeColor: "#1278F1",
    inactiveColor: "#5D6870",
    barStyle: { backgroundColor: "#F7F7F7" },
    tabBarComponent: props => {
      let display = ["homeNav", "home", "chatRooms", "webportal", "other"];
      if (global.domain !== "sais_edu_sg") {
        const removeTab = ["webportal"];
        display = _.difference(display, removeTab);
      }
      return (
        <BottomTabBar
          {...props} // Required
          display={display} // Required
        />
      );
    }
  }
);

const MainScreenNavigator = createStackNavigator(
  {
    Tab: {
      screen: Tabs
    },

    authPortal: { screen: authPortal }
  },

  {
    headerMode: "none"
  }
);

const RootStack = createStackNavigator({
  mode: "modal",
  headerMode: "none"
});

export default createAppContainer(MainScreenNavigator);
