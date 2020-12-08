import React, { Component } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { getCommunities, processSelectedCommunity } from "../store/community";
import { Text } from "../components/sComponent"
import { SettingsListItem } from "../components/SettingsListItem";
import Profile from "../components/Profile"
import { MaterialIcons } from "@expo/vector-icons";

export class DomainSelection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDomain: "",
			domains: [],
			allDomains: []
		};

		props.dispatch(getCommunities());
	}

	componentDidMount() {
		const { communities } = this.props.community;
		if (communities.length > 0) {
			this.setState({ domains: communities, allDomains: communities });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { communities } = this.props.community;
		if (communities !== prevProps.community.communities) {
			this.setState({ domains: communities, allDomains: communities });
		}
	}

	renderSeparator = () => {
		return <View style={styles.separator} />;
	};


	searchFilterFunction = text => {
		this.setState({
			selectedDomain: null,
			searchTerm: text
		});

		const allDomains = this.state.allDomains;

		//reset when blank text
		if (!text) {
			this.setState({
				domains: allDomains
			});
			return;
		}
		const textToSearch = text.toUpperCase();
		const filteredData = allDomains.filter(dataItem => {
			const searchObject = _.pick(dataItem, ["name", "node"]);

			return Object.values(searchObject).some(item => item.toUpperCase().includes(textToSearch));
		});

		this.setState({
			domains: filteredData
		});
	};

	renderHeader = () => {
		return <View style={styles.searchView}>
			<TextInput style={styles.searchInput}
				onChangeText={text => this.searchFilterFunction(text)}
				value={this.state.searchTerm}
				placeholder="Search"
				placeholderTextColor="#555555"
				testID="domainSelection.search" />
			<Ionicons style={styles.searchIcon} name="ios-search" size={32} color="#777777" />
		</View>
	};

	renderItem = ({ item }) => {

		return (
			<SettingsListItem
				hasNavArrow={true}
				icon={<MaterialIcons name="group" style={styles.imageStyleIcon} />}
				title={item.name}
				onPress={() => this.props.dispatch(processSelectedCommunity(item))} />

		)
	};

	render() {
		let onPressedCreateCommunity = () => this.props.navigation.push("login");
		if (this.props.showCreateCommunity == false) {
			onPressedCreateCommunity = () => this.props.navigation.push("communityCreateScreen");
		}
		return (

			<View >
				<Profile
					auth={this.props.auth}
					navigation={this.props.navigation} />

				<TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={onPressedCreateCommunity}>
					<Ionicons style={styles.leftIcon} name="ios-add-circle" size={32} color="#999999" />

					<Text style={styles.TextStyle}>
						Create Community
						</Text>
					<Ionicons style={styles.leftIcon} name="ios-arrow-forward" size={32} color="#777777" />
				</TouchableOpacity>

				<View>
					{this.renderHeader()}
					<View >
						<FlatList
							data={this.state.domains}
							renderItem={this.renderItem}
							keyExtractor={(_, idx) => "domain" + idx}
							ItemSeparatorComponent={this.renderSeparator}
						/>
					</View>
				</View>


			</View >
		)
	}
}

const styles = StyleSheet.create({
	SubmitButtonStyle: {
		flexDirection: "row",
		margin: 12,
		marginTop: 32,
		padding: 15,
		backgroundColor: "#fff",
		borderRadius: 13,
		alignItems: "center"
	},
	TextStyle: {
		color: "#111111",
		flex: 1, paddingHorizontal: 12, textAlign: "left"
	},

	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30
	},
	leftIcon: { flexShrink: 1 },
	searchIcon: { marginLeft: 12, marginRight: 12, padding: 2 },

	searchInput: { flex: 1, paddingLeft: 30 },
	searchView: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderColor: "#111111",
		flexDirection: "row",
		height: 55
	},
	separator: {
		backgroundColor: "#CED0CE",
	},

});


const mapStateToProps = state => ({
	community: state.community,
	auth: state.auth
});

export default connect(mapStateToProps)(DomainSelection);