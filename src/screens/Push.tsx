
import React, { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import firebase from "../lib/firebase";
import I18n from "../lib/i18n";
import _ from "lodash";
import { Input } from "react-native-elements";
import { Button } from "../components/sComponent";

class push extends Component {
	constructor(props) {
		super(props);

		this.state = {
			initialText: "",
			key: props.key
		};

	}


	componentDidMount() {
		var initialText = this.props.summary;

		if (_.isString(this.props.description)) {
			initialText = initialText + "\n\n" + this.props.description;
		}

		this.setState({ initialText: initialText });
	}

	pushSend() {

		var pushMessage = {
			from: "App",
			text: this.state.initialText,
			image: "",
			state: "pending",
			timestamp: Date.now()
		};


		var storyRef = firebase.firestore().collection(global.domain).doc("push").collection("message").add(pushMessage);

		Alert.alert("Push message sent");

		// const { goBack } = this.props.navigation;
		// goBack(null);
	}



	render() {
		return <View>
			<View style={styles.a01e3de90af6511ea88c25dbffc760ad0}>
				<View style={styles.a01e405a0af6511ea88c25dbffc760ad0}>
					<Input
						onChangeText={text => this.setState({ initialText: text })}
						placeholder={I18n.t("message")}
						multiline
						containerStyle={styles.containerStyle}
						value={this.state.initialText} />
				</View>
			</View>
			<Button onPress={() => this.pushSend()} title={I18n.t("send")} />

		</View>;
	}
}

const styles = StyleSheet.create({

	a01e3de90af6511ea88c25dbffc760ad0: {
		backgroundColor: "#f2f2f2",
	},
	a01e405a0af6511ea88c25dbffc760ad0: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 20
	},
	containerStyle: {
		height: 200
	}
});

export default push;