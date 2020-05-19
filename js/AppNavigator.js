import React from "react";
import { Platform } from "react-native";
//import { createAppContainer } from "react-navigation";
import { NavigationContainer } from "@react-navigation/native";
//import { createStackNavigator } from "react-navigation-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import _ from "lodash";

import {
  MaterialIcons,
  Ionicons,
  SimpleLineIcons,
  Feather,
} from "@expo/vector-icons";

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

// let StackHome = createStackNavigator(
//   {
//     homeNav: { screen: Home },
//     contact: { screen: Contact },
//     contactAdmin: { screen: ContactAdmin },
//     story: { screen: Story },
//     push: { screen: push },
//     campusMap: { screen: campusMap },
//     storyForm: { screen: StoryForm },
//     authPortalStory: { screen: authPortal },
//     searchCalendarHome: { screen: Search },
//     webportalURL: { screen: WebportalURL },
//   },
//   {
//     defaultNavigationOptions: {
//       headerTitleStyle: {
//         fontSize: stylesGlobal.navbarFontSize,
//         color: "#111111",
//       },
//       headerTintColor: "#111111",
//       headerStyle: {
//         borderBottomWidth: 0,
//       },
//     },
//   }
// );

// StackHome.navigationOptions = ({ navigation }) => {
//   return {
//     title: I18n.t("home"),
//     headerBackTitle: null,
//     tabBarIcon: ({ focused, tintColor, horizontal }) => (
//       <Ionicons name="ios-home" size={horizontal ? 20 : 25} color={tintColor} />
//     ),
//   };
// };

const StackHome = createStackNavigator();

function StackHomeNavigator() {
  return (
    <StackHome.Navigator>
      <StackHome.Screen name="homeNav" component={Home} />
      <StackHome.Screen name="contact" component={Contact} />
      <StackHome.Screen name="contactAdmin" component={ContactAdmin} />
      <StackHome.Screen name="story" component={Story} />
      <StackHome.Screen name="push" component={push} />
      <StackHome.Screen name="campusMap" component={campusMap} />
      <StackHome.Screen name="storyForm" component={StoryForm} />
      <StackHome.Screen name="authPortalStory" component={authPortal} />
      <StackHome.Screen name="searchCalendarHome" component={Search} />
      <StackHome.Screen name="webportalURL" component={WebportalURL} />
    </StackHome.Navigator>
  );
}

// let StackCalendar = createStackNavigator(
//   {
//     home: { screen: Calendar },
//     phoneCalendar: { screen: phoneCalendar },
//     storyCalendar: { screen: Story },
//     searchCalendar: { screen: Search },
//   },
//   {
//     defaultNavigationOptions: {
//       headerBackTitle: null,
//       headerTitleStyle: {
//         fontSize: stylesGlobal.navbarFontSize,
//         color: "#111111",
//       },
//       headerTintColor: "#111111",
//       headerStyle: {
//         borderBottomWidth: 0,
//       },
//     },
//   }
// );

// StackCalendar.navigationOptions = ({ navigation }) => {
//   return {
//     title: I18n.t("calendar"),
//     headerBackTitle: null,
//     tabBarIcon: ({ focused, tintColor, horizontal }) => (
//       <Ionicons
//         name="ios-calendar"
//         size={horizontal ? 20 : 25}
//         color={tintColor}
//       />
//     ),
//   };
// };

const StackCalendar = createStackNavigator();

function StackCalendarNavigator() {
  return (
    <StackCalendar.Navigator>
      <StackCalendar.Screen name="home" component={Calendar} />
      <StackCalendar.Screen name="phoneCalendar" component={phoneCalendar} />
      <StackCalendar.Screen name="storyCalendar" component={Story} />
      <StackCalendar.Screen name="searchCalendar" component={Search} />
    </StackCalendar.Navigator>
  );
}

// let StackChat = createStackNavigator(
//   {
//     chatRooms: { screen: chatRooms },
//     chatTitle: { screen: chatTitle },
//     chat: { screen: chat },
//     selectLanguageChat: { screen: selectLanguage },
//   },
//   {
//     defaultNavigationOptions: {
//       headerBackTitle: null,
//       headerTitleStyle: {
//         fontSize: stylesGlobal.navbarFontSize,
//         color: "#111111",
//       },
//       headerTintColor: "#111111",
//       headerStyle: {
//         borderBottomWidth: 0,
//       },
//     },
//   }
// );

// StackChat.navigationOptions = ({ navigation }) => {
//   return {
//     title: I18n.t("chat"),
//     tabBarIcon: ({ focused, tintColor, horizontal }) => (
//       <SimpleLineIcons
//         name="bubble"
//         size={horizontal ? 20 : 25}
//         color={tintColor}
//       />
//     ),
//   };
// };

const StackChat = createStackNavigator();

function StackChatNavigator() {
  return (
    <StackChat.Navigator>
      <StackChat.Screen name="chatRooms" component={chatRooms} />
      <StackChat.Screen name="chatTitle" component={chatTitle} />
      <StackChat.Screen name="chat" component={chat} />
      <StackChat.Screen name="selectLanguageChat" component={selectLanguage} />
    </StackChat.Navigator>
  );
}

// let StackWeb = createStackNavigator({
//   authPortal: { screen: authPortal },
// });

// StackWeb.navigationOptions = ({ navigation }) => {
//   const title = global.switch_tab_portalName;
//   return {
//     title,
//     headerBackTitle: null,
//     tabBarIcon: ({ focused, tintColor, horizontal }) => (
//       <MaterialIcons name="web" size={horizontal ? 20 : 25} color={tintColor} />
//     ),
//     headerTintColor: "#111111",
//     headerStyle: {
//       borderBottomWidth: 0,
//     },
//   };
// };

const StackWeb = createStackNavigator();

function StackWebNavigator() {
  return (
    <StackWeb.Navigator>
      <StackWeb.Screen name="authPortal" component={authPortal} />
    </StackWeb.Navigator>
  );
}

// let StackOther = createStackNavigator(
//   {
//     settings: { screen: Settings },
//     library: { screen: Library },
//     logs: { screen: Logs },
//     storyMore: { screen: Story },
//     moreAdmin: { screen: MoreAdmin },
//     Content: { screen: Content },
//     webportalURL: { screen: WebportalURL },
//     selectLanguage: { screen: selectLanguage },
//     adminPassword: { screen: adminPassword },
//     login: { screen: LoginScreen },
//     signup: { screen: SignUpScreen },
//     forgetpassword: { screen: ForgotPasswordScreen },
//     CameraApp: { screen: CameraApp },
//     UserProfile: { screen: UserProfile },
//     UserSearch: { screen: UserSearch },
//     EditUserProfile: { screen: EditUserProfile },
//   },
//   {
//     defaultNavigationOptions: {
//       headerBackTitle: null,
//       headerTitleStyle: {
//         fontSize: stylesGlobal.navbarFontSize,
//         color: "#111111",
//       },
//       headerTintColor: "#111111",
//       headerStyle: {
//         borderBottomWidth: 0,
//       },
//     },
//   }
// );

// StackOther.navigationOptions = ({ navigation }) => {
//   return {
//     title: I18n.t("more"),
//     headerBackTitle: null,
//     tabBarIcon: ({ focused, tintColor, horizontal }) => (
//       <Feather name="menu" size={horizontal ? 20 : 25} color={tintColor} />
//     ),
//   };
// };

const StackOther = createStackNavigator();

function StackOtherNavigator() {
  return (
    <StackOther.Navigator>
      <StackOther.Screen name="settings" component={Settings} />
      <StackOther.Screen name="library" component={Library} />
      <StackOther.Screen name="logs" component={Logs} />
      <StackOther.Screen name="storyMore" component={Story} />
      <StackOther.Screen name="moreAdmin" component={MoreAdmin} />
      <StackOther.Screen name="Content" component={Content} />
      <StackOther.Screen name="webportalURL" component={WebportalURL} />
      <StackOther.Screen name="selectLanguage" component={selectLanguage} />
      <StackOther.Screen name="adminPassword" component={adminPassword} />
      <StackOther.Screen name="login" component={LoginScreen} />
      <StackOther.Screen name="signup" component={SignUpScreen} />
      <StackOther.Screen
        name="forgetpassword"
        component={ForgotPasswordScreen}
      />
      <StackOther.Screen name="CameraApp" component={CameraApp} />
      <StackOther.Screen name="UserProfile" component={UserProfile} />
      <StackOther.Screen name="UserSearch" component={UserSearch} />
      <StackOther.Screen name="EditUserProfile" component={EditUserProfile} />
    </StackOther.Navigator>
  );
}

// let Tabs = createBottomTabNavigator(
//   {
//     homeNav: StackHome,
//     home: StackCalendar,
//     chatRooms: StackChat,
//     webportal: StackWeb,
//     other: StackOther,
//   },
//   {
//     shifting: false,
//     labeled: true,
//     activeColor: "#111111",
//     inactiveColor: "#7777777",
//     tabBarOptions: {
//       activeTintColor: "#111111",
//       inactiveTintColor: "#777777",
//       style: {
//         borderTopWidth: 0,
//         borderTopColor: "transparent",
//       },
//     },

//     tabBarComponent: (props) => {
//       let display = ["homeNav", "home", "chatRooms", "webportal", "other"];
//       if (global.domain !== "sais_edu_sg") {
//         const removeTab = ["webportal"];
//         display = _.difference(display, removeTab);
//       }

//       return (
//         <BottomTabBar
//           {...props} // Required
//           display={display} // Required
//         />
//       );
//     },
//   }
// );

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName, iconLib;

          if (route.name === "homeNav") {
            iconName = "";
            return <Ionicons name={"ios-home"} size={size} color={color} />;
          } else if (route.name === "home") {
            return <Ionicons name={"ios-calendar"} size={size} color={color} />;
          } else if (route.name === "calendar") {
            return <Ionicons name={"ios-list"} size={size} color={color} />;
          } else if (route.name === "chatRooms") {
            return (
              <SimpleLineIcons name={"bubble"} size={size} color={color} />
            );
          } else if (route.name === "webportal") {
            return <MaterialIcons name={"web"} size={size} color={color} />;
          } else if (route.name === "other") {
            return <Feather name={"menu"} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="homeNav"
        component={StackHomeNavigator}
        options={{ title: I18n.t("home") }}
      />
      <Tab.Screen
        name="home"
        component={StackCalendarNavigator}
        options={{ title: I18n.t("calendar") }}
      />
      <Tab.Screen
        name="chatRooms"
        component={StackChatNavigator}
        options={{ title: I18n.t("chat") }}
      />
      <Tab.Screen
        name="webportal"
        component={StackWebNavigator}
        options={{ title: I18n.t("myS") }}
      />
      <Tab.Screen
        name="other"
        component={StackOtherNavigator}
        options={{ title: I18n.t("more") }}
      />
    </Tab.Navigator>
  );
}

// const MainScreenNavigator = createStackNavigator(
//   {
//     Tab: {
//       screen: Tabs,
//     },

//     authPortal: { screen: authPortal },
//   },

//   {
//     headerMode: "none",
//   }
// );

const MainScreen = createStackNavigator();

export default function MainScreenNavigator() {
  return (
    <NavigationContainer>
      <MainScreen.Navigator>
        <MainScreen.Screen name="Tab" component={Tabs} />
        <MainScreen.Screen name="authPortal" component={authPortal} />
      </MainScreen.Navigator>
    </NavigationContainer>
  );
}

// const defaultGetStateForAction = MainScreenNavigator.router.getStateForAction;

// MainScreenNavigator.router.getStateForAction = (action, state) => {
//   console.log("action", action);
//   console.log("state", state);
//   return defaultGetStateForAction(action, state);
// };

// const RootStack = createStackNavigator({
//   mode: "modal",
//   headerMode: "none",
// });

//export default NavigationContainer(MainScreenNavigator);
