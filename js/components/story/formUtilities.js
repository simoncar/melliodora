import React, { Component } from "react";
import {
	View,
	ImageBackground,
	Text,
	TouchableOpacity,
	Switch,
	SafeAreaView,
	ScrollView,
	LayoutAnimation,
	Platform,
	Alert,
} from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Input } from "react-native-elements";

const IconChat = class IconChat extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.settingsLeft}>
				<View>
					<Text>Allow Chat</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						{
							this.props.handler(!this.props.showIconChat);
						}
					}}
					style={{ padding: 8 }}>
					<SimpleLineIcons name="bubble" size={32} color={this.props.showIconChat ? "#222" : "#CCC"} />
				</TouchableOpacity>
			</View>
		);
	}
};

const IconShare = class IconShare extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.settingsLeft}>
				<View>
					<Text>Allow Share</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						{
							this.props.handler(!this.props.showIconShare);
						}
					}}
					style={{ padding: 8 }}>
					<Feather name="share" size={32} color={this.props.showIconShare ? "#222" : "#CCC"} />
				</TouchableOpacity>
			</View>
		);
	}
};

class OrderOnPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.settingsLeft}>
				<View>
					<Text>Order on Page</Text>
				</View>
				<View>
					<Input
						onChangeText={(order) => this.props.handler(order)}
						placeholder="0"
						style={styles.eventTitle}
						value={this.props.order}
						keyboardType="number-pad"
						inputContainerStyle={{ borderBottomWidth: 0 }}
						containerStyle={styles.containerStyleOrder}
					/>
				</View>
			</View>
		);
	}
}

class ShowOnHomeScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.settingsItem}>
				{/* {icon} */}
				<View style={styles.settingsLeft}>
					<View>
						<Text>Home Screen</Text>
					</View>

					<View>
						<Switch
							onValueChange={(value) => this.setState({ visible: value })}
							style={styles.switch}
							value={this.props.visible}
						/>
					</View>
				</View>
			</View>
		);
	}
}

export { IconChat, IconShare, OrderOnPage, ShowOnHomeScreen };
