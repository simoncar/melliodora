
import React, { Component } from "react";
import { StyleSheet, View, TouchableHighlight } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FeatureMoreItems from "./FeatureMoreItems";
import { connect } from 'react-redux';

class Content extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
			language: "",
			features: global.moreFeatures || []
		};
	}

	_getStyle(language) {
		if (language == this.state.language) {
			return styles.imageStyleCheckOn;
		} else {
			return styles.imageStyleCheckOff;
		}
	}

	render() {
		return <View style={styles.a911df0d0b21411ea8aa31930972200e5}>
			{this.props.auth.isAdmin && <TouchableHighlight style={styles.adminButton} underlayColor="#ff7043" onPress={() => this.props.navigation.navigate("moreAdmin", { moreFeatures: this.state.features })}>
				<MaterialIcons name="edit" style={styles.a911df0d1b21411ea8aa31930972200e5} />
			</TouchableHighlight>}

			<View style={styles.a911df0d2b21411ea8aa31930972200e5}>
				<FeatureMoreItems navigation={this.props.navigation} show="all" editMode />
			</View>
		</View>;
	}
	toggleAuthView() {
		this.setState({ toggleAuthView: !this.state.toggleAuthView });
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(Content);

const styles = StyleSheet.create({
	a911df0d0b21411ea8aa31930972200e5: { backgroundColor: "#EFEFF4", flex: 1 },
	a911df0d1b21411ea8aa31930972200e5: { color: "white", fontSize: 25 },
	a911df0d2b21411ea8aa31930972200e5: { backgroundColor: "#EFEFF4" },

	adminButton: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderRadius: 50 / 2,
		borderWidth: 1,
		bottom: 20,
		height: 50,
		justifyContent: "center",
		position: "absolute",
		right: 20,
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 0
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50,
		zIndex: 1
	},
	imageStyleCheckOff: {
		alignSelf: "center",
		color: "#FFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},
	imageStyleCheckOn: {
		alignSelf: "center",
		color: "#007AFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	}
});