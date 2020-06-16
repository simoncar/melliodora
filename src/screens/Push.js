
import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Alert, TouchableOpacity, Switch } from "react-native";

import { SettingsListItem } from "../components/settings/SettingsListItem";
import * as firebase from "firebase";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import _ from "lodash";
import { Input } from "react-native-elements";
import { Text } from "../components/sComponent";

class push extends Component {
	constructor(props) {
		super(props);

		this.state = {
			initialText: "",
			_key: props._key
		};

		this.pushSend = this.pushSend.bind(this);
	}

	static navigationOptions = ({ navigation }) => ({
		headerLeft: <TouchableOpacity onPress={() => {
			navigation.goBack();
		}}>
			<Entypo name="chevron-left" style={styles.chatHeadingLeft} />
		</TouchableOpacity>,

		headerTitle: <Text style={styles.a01e39070af6511ea88c25dbffc760ad0}>{I18n.t("message")}</Text>,
		headerRight: <TouchableOpacity onPress={() => {
			navigation.state.params.pushSend();
		}}>
			<Text style={styles.chatHeading}>{I18n.t("send")}</Text>
		</TouchableOpacity>
	});

	componentDidMount() {
		console.log("SSS:", this.props);
		var initialText = this.props.summary;

		if (_.isString(this.props.description)) {
			initialText = initialText + "\n\n" + this.props.description;
		}

		var initialDate = this.state.start_date;

		this.setState({ initialText: initialText });

		this.props.navigation.setParams({
			pushSend: this.pushSend
		});
	}

	pushSend() {
		var grades = this._getGrade();

		var pushMessage = {
			from: "App",
			text: this.state.initialText,
			grade: grades,
			image: "",
			state: "pending",
			timestamp: Date.now()
		};

		console.log("push =", pushMessage);

		var storyRef = firebase.firestore().collection(global.domain).doc("push").collection("message").add(pushMessage);

		Alert.alert("Push message sent");

		// const { goBack } = this.props.navigation;
		// goBack(null);
	}

	_getStyle(language) {
		if (language == this.state.language) {
			return styles.imageStyleCheckOn;
		} else {
			return styles.imageStyleCheckOff;
		}
	}

	gradeSelector(title, level, grade) {
		return <SettingsListItem hasSwitch={true} switchState={this.state[grade]} switchOnValueChange={() => this._setGrade(grade)} title={title} titleInfo={level} hasNavArrow={false} icon={<MaterialIcons name="people" style={styles.imageStyleCheckOn} />} />;
	}

	_setGrade(grade) {
		this.setState({ [grade]: !this.state[grade] });
	}

	_getGrade() {
		var grades = [];
		for (var i = -4; i < 13; i++) {
			console.log("loop=", i, this.state[i]);
			if (this.state[i] == true) {
				grades.push(i);
			}
		}
		return grades;
	}

	render() {
		return <View>
			<View style={styles.a01e3de90af6511ea88c25dbffc760ad0}>
				<View style={styles.a01e405a0af6511ea88c25dbffc760ad0}>
					<Input onChangeText={text => this.setState({ initialText: text })} placeholder={"Description"} multiline containerStyle={styles.containerStyle} value={this.state.initialText} />
				</View>
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({
	a01e39070af6511ea88c25dbffc760ad0: {
		fontSize: 17,
		fontWeight: "600"
	},
	a01e3de90af6511ea88c25dbffc760ad0: {
		flex: 1,
		backgroundColor: "#f2f2f2"
	},
	a01e405a0af6511ea88c25dbffc760ad0: {
		flex: 1,
		paddingTop: 20,
		paddingLeft: 10,
		paddingRight: 10
	}
});

export default push;