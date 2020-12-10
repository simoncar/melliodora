import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

import DomainSelection from "./DomainSelection";
import { connect } from "react-redux";

class WelcomeScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		const firstname = navigation.getParam("firstName");
		return {
			title: "Welcome " + firstname,
		};
	};

	componentDidMount() {
		const firstName = this.props.auth.userInfo.firstName;
		if (firstName) {
			this.props.navigation.setParams({ firstName });
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<DomainSelection showCreateCommunity={false} navigation={this.props.navigation} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},


});

const mapStateToProps = (state) => ({
	communityCreate: state.communityCreate,
	auth: state.auth,
});
export default connect(mapStateToProps)(WelcomeScreen);
