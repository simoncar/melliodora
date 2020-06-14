import React from "react";
import { TouchableOpacity, View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import _ from "lodash";

import { MaterialIcons, Ionicons, SimpleLineIcons, Feather, FontAwesome } from "@expo/vector-icons";
import I18n from "./lib/i18n";

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
import Form from "./components/story/form";
import campusMap from "./components/campusMap";
import chatRooms from "./components/chat/chatRooms";
import chatTitle from "./components/chat/chatTitle";
import chat from "./components/chat";
import push from "./components/story/push";
import authPortal from "./components/webportalURL/authPortal";
import WebportalURL from "./components/webportalURL";

import LoginScreen from "./components/auth/LoginScreen";
import SignUpScreen from "./components/auth/SignUpScreen";
import ForgotPasswordScreen from "./components/auth/ForgotPasswordScreen";
import CameraApp from "./components/auth/CameraApp";
import UserProfile from "./components/auth/UserProfile";
import EditUserProfile from "./components/auth/EditUserProfile";
import UserSearch from "./components/settings/UserSearch";
import stylesGlobal from "./themes/globalTheme";

const StackHome = createStackNavigator();

function StackHomeNavigator() {
	return (
		<StackHome.Navigator>
			<StackHome.Screen
				name="homeNav"
				component={Home}
				options={({ navigation, route }) => ({
					headerTitle: headerTitle(route),
					headerLeft: () => headerLeftLanguageSelector(navigation),
					headerRight: () => headerRightSearch(navigation),
				})}
			/>

			<StackHome.Screen name="contact" component={Contact} options={{ title: I18n.t("contact") }} />
			<StackHome.Screen name="contactAdmin" component={ContactAdmin} options={{ title: I18n.t("contact") }} />
			<StackHome.Screen name="story" component={Story} options={({ route }) => ({ title: route.params.summary })} />
			<StackHome.Screen name="push" component={push} />
			<StackHome.Screen name="chatStory" component={chat} options={({ route }) => ({ title: route.params.title })} />
			<StackHome.Screen name="campusMap" component={campusMap} options={{ title: I18n.t("map") }} />
			<StackHome.Screen name="Form" component={Form} options={{ title: I18n.t("edit") }} />
			<StackHome.Screen name="authPortalEmbed" component={authPortal} options={{ title: I18n.t("myS") }} />
			<StackHome.Screen name="searchCalendarHome" component={Search} options={{ title: I18n.t("search") }} />
			<StackHome.Screen name="webportalURL" component={WebportalURL} options={{ title: I18n.t("myS") }} />
			<StackHome.Screen name="selectLanguageHome" component={selectLanguage} options={{ title: I18n.t("language") }} />
			<StackHome.Screen name="phoneCalendar" component={phoneCalendar} options={{ title: I18n.t("calendar") }} />
			<StackChat.Screen name="selectLanguageChat" component={selectLanguage} options={{ title: I18n.t("language") }} />
		</StackHome.Navigator>
	);
}

const StackCalendar = createStackNavigator();

function StackCalendarNavigator() {
	return (
		<StackCalendar.Navigator>
			<StackCalendar.Screen name="home" component={Calendar} options={{ title: I18n.t("calendar") }} />
			<StackCalendar.Screen name="phoneCalendar" component={phoneCalendar} options={{ title: I18n.t("calendar") }} />
			<StackCalendar.Screen name="storyCalendar" component={Story} options={({ route }) => ({ title: route.params.summary })} />
			<StackCalendar.Screen name="searchCalendar" component={Search} options={{ title: I18n.t("search") }} />
			<StackCalendar.Screen name="chatCalendar" component={chat} options={({ route }) => ({ title: route.params.title })} />
		</StackCalendar.Navigator>
	);
}

const StackChat = createStackNavigator();

function StackChatNavigator() {
	return (
		<StackChat.Navigator>
			<StackChat.Screen name="chatRooms" component={chatRooms} options={{ title: I18n.t("chat") }} />
			<StackChat.Screen name="chatTitle" component={chatTitle} options={({ route }) => ({ title: route.params.title })} />
			<StackChat.Screen name="chat" component={chat} options={({ route }) => ({ title: route.params.title })} />
			<StackChat.Screen name="selectLanguageChat" component={selectLanguage} options={{ title: I18n.t("language") }} />
		</StackChat.Navigator>
	);
}

const StackWeb = createStackNavigator();

function StackWebNavigator() {
	return (
		<StackWeb.Navigator>
			<StackWeb.Screen name="authPortal" component={authPortal} options={{ url: "", title: "Portal" }} />
		</StackWeb.Navigator>
	);
}

const StackOther = createStackNavigator();

function StackOtherNavigator() {
	return (
		<StackOther.Navigator>
			<StackOther.Screen name="settings" component={Settings} options={{ title: I18n.t("more") }} />
			<StackOther.Screen name="library" component={Library} options={{ title: I18n.t("library") }} />
			<StackOther.Screen name="logs" component={Logs} />
			<StackOther.Screen name="storyMore" component={Story} options={({ route }) => ({ title: route.params.summary })} />
			<StackOther.Screen name="moreAdmin" component={MoreAdmin} />
			<StackOther.Screen name="Content" component={Content} />
			<StackOther.Screen name="webportalURL" component={WebportalURL} />
			<StackOther.Screen name="selectLanguage" component={selectLanguage} options={{ title: I18n.t("language") }} />
			<StackOther.Screen name="adminPassword" component={adminPassword} options={{ title: I18n.t("adminAccess") }} />
			<StackOther.Screen name="login" component={LoginScreen} />
			<StackOther.Screen name="signup" component={SignUpScreen} />
			<StackOther.Screen name="forgetpassword" component={ForgotPasswordScreen} />
			<StackOther.Screen name="CameraApp" component={CameraApp} />
			<StackOther.Screen name="UserProfile" component={UserProfile} />
			<StackOther.Screen name="UserSearch" component={UserSearch} />
			<StackOther.Screen name="EditUserProfile" component={EditUserProfile} />
		</StackOther.Navigator>
	);
}

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
						return <SimpleLineIcons name={"bubble"} size={size} color={color} />;
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
			<Tab.Screen name="homeNav" component={StackHomeNavigator} options={{ title: I18n.t("home") }} />
			<Tab.Screen name="home" component={StackCalendarNavigator} options={{ title: I18n.t("calendar") }} />
			<Tab.Screen name="chatRooms" component={StackChatNavigator} options={{ title: I18n.t("chat") }} />
			<Tab.Screen name="webportal" component={StackWebNavigator} options={{ title: I18n.t("myS") }} />
			<Tab.Screen name="other" component={StackOtherNavigator} options={{ title: I18n.t("more") }} />
		</Tab.Navigator>
	);
}

const MainScreen = createStackNavigator();

export default function MainScreenNavigator() {
	return (
		<NavigationContainer>
			<MainScreen.Navigator headerMode="none">
				<MainScreen.Screen name="Tab" component={Tabs} />
				<MainScreen.Screen name="authPortal" component={authPortal} />
			</MainScreen.Navigator>
		</NavigationContainer>
	);
}

function headerLeftLanguageSelector(navigation) {
	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("selectLanguageHome");
			}}
		>
			<View style={{ color: "#48484A", fontSize: 25, marginLeft: 10 }}>
				<FontAwesome
					name="language"
					style={{
						color: "#48484A",
						fontSize: 25,
						marginLeft: 10,
					}}
				/>
			</View>
		</TouchableOpacity>
	);
}

function headerRightSearch(navigation) {
	return (
		<TouchableOpacity
			onPress={() => {
				navigation.push("searchCalendarHome");
			}}
		>
			<View
				style={{
					color: "#48484A",
					fontSize: 25,
					marginRight: 10,
				}}
			>
				<Ionicons
					name="md-search"
					style={{
						color: "#48484A",
						fontSize: 25,
						marginRight: 10,
					}}
				/>
			</View>
		</TouchableOpacity>
	);
}

function headerTitle(route) {
	// console.log("route:", route.params.title);
	if (route.params == undefined) {
		return "";
	} else {
		return route.params.title;
	}
}
