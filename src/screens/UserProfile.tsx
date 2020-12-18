
import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import firebase from "firebase";
import { Text, Button } from "../components/sComponent";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import I18n from "../lib/i18n";

interface TProps {
	auth: any,
	community: any,
	navigation: any,
	route: any,
	user: any
}

interface TState {
	user: any,
	uid: string | null,
	errorMessage: string | null,
	navigation: any,
	route: any,
}

class UserProfile extends Component<TProps, TState> {
	constructor(props: TProps) {
		super(props);

		this.state = {
			user: {
				photoURL: "",
				firstName: "",
				lastName: "",
				displayName: "",
				email: ""
			},
			errorMessage: null
		};

	}

	componentDidMount() {
		const { uid, user } = this.props.route.params;

		if (user) {
			this.setState({ user, uid });
		} else if (uid) {
			firebase.firestore()
				.collection(this.props.community.selectedCommunity.node)
				.doc("user")
				.collection("registered")
				.doc(uid)
				.get()
				.then(snapshot => {
					if (!snapshot.exists) {
						this.props.navigation.navigate("EditUserProfile", {
							...this.state,
							...{ uid: uid },
							refreshFunction: this.refreshFunction.bind(this)
						})
					} else {


						console.log(snapshot.data())


						const data = {
							photoURL: snapshot.data().photoURL || "",
							firstName: snapshot.data().firstName || "",
							lastName: snapshot.data().lastName || "",
							displayName: snapshot.data().displayName || "",
							email: snapshot.data().email || ""
						}
						this.props.navigation.setParams({ uid: uid, user: data });
						this.setState({ user: data });
					}
				});
		}
	}

	refreshFunction(data) {
		const oldUser = this.state.user
		const newUser = {
			...oldUser,
			...data
		}

		this.setState({ user: newUser });
	}


	edit() {
		this.props.navigation.navigate("EditUserProfile", {
			...this.state,
			refreshFunction: this.refreshFunction.bind(this)
		})
	}

	logout() {
		const navigation = this.props.navigation

		firebase.auth().signOut()
			.then(() => {
				console.log("signed out")
				navigation.popToTop();
			})
	}

	renderProfilePic = () => {
		const width = 128;
		const photoURL = this.state.user && this.state.user.photoURL;

		return <TouchableOpacity onPress={() => {
			this.edit()
		}}>
			<View style={styles.profilePicContainer}>
				{photoURL ? <Image style={styles.profilePhoto} source={{ uri: photoURL }} /> : <Ionicons name="ios-person" size={width * 0.85} color="grey" style={styles.profilePhotoNone} />}
			</View>
		</TouchableOpacity>
	};

	render() {
		return <SafeAreaView>
			<ScrollView ScrollView bounces={false}>
				{this.renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} >
						{this.state.user.firstName} {this.state.user.lastName}
					</Text>
					<Text style={styles.emailText}>
						{this.state.user.email}
					</Text>

				</View>
				<Button
					onPress={() => this.logout()}
					title={I18n.t("logout")}
				/>

			</ScrollView>
		</SafeAreaView >;
	}

}
const mapStateToProps = state => ({
	community: state.community,
	auth: state.auth
});

export default connect(mapStateToProps)(UserProfile);

const styles = StyleSheet.create({

	emailText: {
		color: "black",
		fontSize: 13,
		textAlign: "center"
	},


	nameText: {
		color: "black",
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center"
	},
	profilePhoto: {
		borderColor: "lightgray",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		width: 150
	},

	profilePhotoNone: {
		borderColor: "grey",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		textAlign: "center",
		width: 150,
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	},

	titleContainer: {
		backgroundColor: "#fdfdfd",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,

	}
});