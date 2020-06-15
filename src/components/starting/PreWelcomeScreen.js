import React, { Component } from "react";
import { View, Image, Button, TouchableOpacity } from "react-native";
import { Text } from "../../components/common/sComponent"

export default class PreWelcomeScreen extends Component {
	render() {
		return (
			<View style={{ flex: 1, flexDirection: "column" }}>
				<Image
					style={{ width: "100%", flex: 1, borderBottomWidth: 1, borderColor: "#f0f0f0" }}
					resizeMode="contain"
					source={require("../../../resources/genericApp/icons/ios/AppIcon.appiconset/Icon-App.png")}
				/>

				<View style={{ paddingBottom: 80, flexShrink: 1 }}>
					<TouchableOpacity
						onPress={(_) => this.props.navigation.push("login", { toWelcomeScreen: true })}
						style={{
							height: 55,
							borderRadius: 15,
							backgroundColor: "#777777",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							margin: 12,
						}}>
						<Text style={{ color: "white", fontSize: 22 }}>Login</Text>
					</TouchableOpacity>

					<View style={{ height: 20, paddingHorizontal: 20, flexDirection: "row" }}>
						<View style={{ height: 12, borderBottomColor: "black", borderBottomWidth: 1, flex: 1, borderBottomColor: "#777777" }}></View>
						<Text style={{ marginHorizontal: 3, fontSize: 18, alignSelf: "center", color: "#777777" }}>or</Text>
						<View style={{ height: 12, borderBottomColor: "black", borderBottomWidth: 1, flex: 1, borderBottomColor: "#777777" }}></View>
					</View>

					<TouchableOpacity
						onPress={(_) => this.props.navigation.push("signup", { toWelcomeScreen: true })}
						style={{
							height: 55,
							borderRadius: 15,
							backgroundColor: "#777777",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							margin: 12,
						}}>
						<Text style={{ color: "white", fontSize: 22 }}>Register</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
