
import React, { Component } from "react";
import { View, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components/sComponent";
import firebase from "firebase";
import Loader from "../components/Loader";
import { processSelectedCommunity } from "../store/community";

class CommunityCreateScreen extends Component {
	state = {
		communityName: "",
		kind: "",
		users: "",
		region: "",
		language: "",
		errorMessage: null,
		loading: false
	};

	_handleCommunityCreation = async () => {
		try {
			this.setState({ loading: true });
			let { communityName, kind, users, region, language } = this.state;

			communityName = communityName.trim();
			const node = communityName.toLowerCase().split(" ").join("_");
			kind = kind.trim();
			region = region.trim();
			language = language.trim();

			const dict = {
				name: communityName,
				node,
				kind,
				users,
				region,
				language,
				admins: [this.props.auth.userInfo.uid]
			};

			const communityRef = firebase.firestore().collection("domains").doc(node);

			const doc = await communityRef.get();

			if (doc.exists) {
				throw new Error("Community name already existed");
			} else {
				await communityRef.set(dict);
				global.domain = node;
				this.props.dispatch(processSelectedCommunity(dict));
			}
			this.setState({ loading: false });
		} catch (error) {
			this.setState({
				errorMessage: error.message,
				loading: false
			});
		}
	};
	render() {
		return <SafeAreaView style={styles.ab30523d0b21411ea8aa31930972200e5}>
			<Loader modalVisible={this.state.loading} animationType="fade" />
			<ScrollView>
				<Text>{this.state.errorMessage}</Text>
				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Community Name:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState({ communityName: text })} value={this.state.communityName} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Kind:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState({ kind: text })} value={this.state.kind} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Users:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState({ users: text })} value={this.state.users} keyboardType="numeric" maxLength={10} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Region:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState({ region: text })} value={this.state.region} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Language:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState({ language: text })} value={this.state.language} />
				</View>
				<View style={styles.ab305c010b21411ea8aa31930972200e5}>
					<TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={this._handleCommunityCreation}>
						<Text style={styles.TextStyle}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>;
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(CommunityCreateScreen);

const styles = StyleSheet.create({
	SubmitButtonStyle: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		elevation: 4,
		height: 50,
		justifyContent: "center",
		marginBottom: 30,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		width: 250
	},
	ab30523d0b21411ea8aa31930972200e5: { marginTop: 30 },

	ab305c010b21411ea8aa31930972200e5: { alignItems: "center", flexDirection: "column", marginTop: 12 },
	nameText: {
		color: "black",
		fontSize: 18,
		fontWeight: "600"
	},
	sectionContentText: {
		borderBottomWidth: 1,
		borderColor: "#100c08",
		color: "#808080",
		fontSize: 14,
		height: 40,
		width: "80%"
	},

	titleContainer: {
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	}
});