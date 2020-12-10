
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Analytics from 'expo-firebase-analytics';
import { MaterialIcons, Ionicons, SimpleLineIcons, Feather, FontAwesome } from "@expo/vector-icons";

import I18n from "./lib/i18n";
import Constants from "expo-constants";
import Calendar from "./screens/Calendar";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Settings from "./screens/More";
import AdminPassword from "./screens/AdminPassword";
import SelectLanguage from "./screens/Language";
import SelectAlbum from "./screens/Albums";
import Story from "./screens/Story";
import Form from "./screens/Form";
import chatRooms from "./screens/ChatRooms";
import ChatTitle from "./components/ChatTitle";
import chat from "./screens/Chat";
import push from "./screens/Push";
import authPortal from "./screens/AuthPortal";
import WebPortal from "./screens/WebPortal";
import LoginScreen from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import CameraApp from "./screens/Camera";
import UserProfile from "./screens/UserProfile";
import EditUserProfile from "./screens/EditUserProfile";
import UserSearch from "./screens/UserSearch";
import FormAlbum from './screens/FormAlbum';

const StackHome = createStackNavigator();

function StackHomeNavigator() {
	return <StackHome.Navigator>
		<StackHome.Screen name="homeNav" component={Home} options={({ navigation, route }) => ({
			headerTitle: headerTitle(route),
			headerLeft: () => headerLeftLanguageSelector(navigation),
			headerRight: () => headerRightSearch(navigation, "searchCalendarHome")
		})} />

		<StackHome.Screen name="story" component={Story} options={({ route }) => ({ title: route.params.story.summaryMyLanguage })} />
		<StackHome.Screen name="push" component={push} options={{ title: I18n.t("send") }} />
		<StackHome.Screen name="chatStory" component={chat} options={({ route }) => ({ title: route.params.title })} />
		<StackHome.Screen name="Form" component={Form} options={{ title: I18n.t("edit") }} />
		<StackChat.Screen name="FormAlbum" component={FormAlbum} options={{ title: I18n.t("images") }} />
		<StackHome.Screen name="authPortalEmbed" component={authPortal} options={{ title: I18n.t("myS") }} />
		<StackHome.Screen name="searchCalendarHome" component={Search} options={{ title: I18n.t("search") }} />
		<StackHome.Screen name="WebPortal" component={WebPortal} options={{ title: I18n.t("myS") }} />
		<StackHome.Screen name="selectLanguageHome" component={SelectLanguage} options={{ title: I18n.t("language") }} />
		<StackHome.Screen name="Albums" component={SelectAlbum} options={{ title: I18n.t("albums") }} />
		<StackChat.Screen name="selectLanguageChat" component={SelectLanguage} options={{ title: I18n.t("language") }} />
	</StackHome.Navigator>;
}

const StackCalendar = createStackNavigator();

function StackCalendarNavigator() {
	return <StackCalendar.Navigator>
		<StackCalendar.Screen name="home" component={Calendar} options={({ navigation, route }) => ({
			headerTitle: I18n.t("calendar"),
			headerRight: () => headerRightSearch(navigation, "searchCalendar")
		})} />
		<StackCalendar.Screen name="storyCalendar" component={Story} options={({ route }) => ({ title: route.params.story.summaryMyLanguage })} />
		<StackCalendar.Screen name="searchCalendar" component={Search} options={{ title: I18n.t("search") }} />
		<StackCalendar.Screen name="chatCalendar" component={chat} options={({ route }) => ({ title: route.params.title })} />
	</StackCalendar.Navigator>;
}

const StackChat = createStackNavigator();

function StackChatNavigator() {
	return <StackChat.Navigator>
		<StackChat.Screen name="chatRooms" component={chatRooms} options={{ title: I18n.t("chat") }} />
		<StackChat.Screen name="ChatTitle" component={ChatTitle} options={({ route }) => ({ title: route.params.title })} />
		<StackChat.Screen name="chat" component={chat} options={({ route }) => ({ title: route.params.title })} />
		<StackChat.Screen name="selectLanguageChat" component={SelectLanguage} options={{ title: I18n.t("language") }} />
	</StackChat.Navigator>;
}

const StackWeb = createStackNavigator();

function StackWebNavigator() {
	return <StackWeb.Navigator>
		<StackWeb.Screen name="authPortal" component={authPortal} options={{ url: "", title: "Portal" }} />
	</StackWeb.Navigator>;
}

const StackOther = createStackNavigator();

function StackOtherNavigator() {
	return <StackOther.Navigator>
		<StackOther.Screen name="settings" component={Settings} options={{ title: I18n.t("more") }} />
		<StackOther.Screen name="storyMore" component={Story} options={({ route }) => ({ title: route.params.story.summaryMyLanguage })} />
		<StackOther.Screen name="WebPortal" component={WebPortal} />
		<StackOther.Screen name="selectLanguage" component={SelectLanguage} options={{ title: I18n.t("language") }} />
		<StackOther.Screen name="AdminPassword" component={AdminPassword} options={{ title: I18n.t("adminAccess") }} />
		<StackOther.Screen name="login" component={LoginScreen} options={{ title: I18n.t("signIn") }} />
		<StackOther.Screen name="signup" component={SignUp} options={{ title: I18n.t("signUp") }} />
		<StackOther.Screen name="forgetpassword" component={ForgotPasswordScreen} options={{ title: I18n.t("forgetPassword") }} />
		<StackOther.Screen name="CameraApp" component={CameraApp} options={{ title: I18n.t("camera") }} />
		<StackOther.Screen name="UserProfile" component={UserProfile} options={{ title: I18n.t("profile") }} />
		<StackOther.Screen name="chatPrivate" component={chat} options={({ route }) => ({ title: route.params.title })} />
		<StackOther.Screen name="UserSearch" component={UserSearch} options={{ title: I18n.t("searchUsers") }} />
		<StackOther.Screen name="EditUserProfile" component={EditUserProfile} options={{ title: I18n.t("profile") }} />
	</StackOther.Navigator>;
}

const Tab = createBottomTabNavigator();

function Tabs() {
	return <Tab.Navigator screenOptions={({ route }) => ({
		tabBarIcon: ({ color, size }) => {

			if (route.name === "homeNav") {
				return <Ionicons name={"ios-home"} size={size} color={color} />;
			} else if (route.name === "home") {
				return <Ionicons name={"ios-calendar"} size={size} color={color} />;
			} else if (route.name === "calendar") {
				return <Ionicons name={"ios-list"} size={size} color={color} />;
			} else if (route.name === "chatRooms") {
				return <SimpleLineIcons name={"bubble"} size={size} color={color} />;
			} else if (route.name === "webportal") {
				return <MaterialIcons name={"web"} size={size} color={color} />;
			} else if (route.name === "other") {
				return <Feather name={"menu"} size={size} color={color} />;
			}
		}
	})} tabBarOptions={{
		activeTintColor: "black",
		inactiveTintColor: "gray"
	}}>
		<Tab.Screen name="homeNav" component={StackHomeNavigator} options={{ title: I18n.t("home") }} />
		<Tab.Screen name="home" component={StackCalendarNavigator} options={{ title: I18n.t("calendar") }} />
		{Constants.manifest.extra.instance != "sais_edu_sg" && <Tab.Screen name="chatRooms" component={StackChatNavigator} options={{ title: I18n.t("chat") }} />}
		<Tab.Screen name="webportal" component={StackWebNavigator} options={{ title: I18n.t("myS") }} />
		<Tab.Screen name="other" component={StackOtherNavigator} options={{ title: I18n.t("more") }} />
	</Tab.Navigator>;
}

const MainScreen = createStackNavigator();

export default function MainScreenNavigator() {

	const routeNameRef = React.useRef();
	const navigationRef = React.useRef();

	return <NavigationContainer
		ref={navigationRef}
		onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
		onStateChange={() => {
			const previousRouteName = routeNameRef.current;
			const currentRouteName = navigationRef.current.getCurrentRoute().name

			if (previousRouteName !== currentRouteName) {
				Analytics.setCurrentScreen(currentRouteName);
			}
			routeNameRef.current = currentRouteName;
		}}
	>
		<MainScreen.Navigator headerMode="none">
			<MainScreen.Screen name="Tab" component={Tabs} />
			<MainScreen.Screen name="authPortal" component={authPortal} />
		</MainScreen.Navigator>
	</NavigationContainer>;
}

function headerLeftLanguageSelector(navigation) {
	return <TouchableOpacity onPress={() => {
		navigation.navigate("selectLanguageHome");
	}}>
		<View style={styles.leftView}>
			<FontAwesome name="language" style={styles.leftIcon} />
		</View>
	</TouchableOpacity>;
}

function headerRightSearch(navigation, searchPage) {
	return <TouchableOpacity onPress={() => {
		navigation.push(searchPage);
	}}>
		<View style={styles.rightView}>
			<Ionicons name="md-search" style={styles.rightIcon} />
		</View>
	</TouchableOpacity>;
}


function headerTitle(route) {
	if (route.params == undefined) {
		return "";
	} else {
		return route.params.title;
	}
}

const styles = StyleSheet.create({
	leftIcon: {
		color: "#48484A",
		fontSize: 25,
		marginLeft: 10
	},
	leftView: {
		marginLeft: 10
	},
	rightIcon: {
		color: "#48484A",
		fontSize: 25,
		marginRight: 10
	},
	rightView: {
		marginRight: 10
	}
});