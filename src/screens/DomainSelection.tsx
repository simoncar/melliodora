
import React, { Component } from "react";
import { View, StyleSheet, FlatList, TextInput } from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { getCommunities, processSelectedCommunity } from "../store/community";
import { SettingsListItem } from "../components/SettingsListItem";
import Profile from "../components/Profile";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";

interface TProps {
	navigation: any,
	auth: any,
	community: string,
	dispatch: any,
	showCreateCommunity: boolean
}

interface TState {
	selectedDomain: string | null,
	domains: [],
	allDomains: [],
	searchTerm: string,
	auth: any
}

export class DomainSelection extends Component<TProps, TState> {
	constructor(props: TProps) {
		super(props);
		this.state = {
			selectedDomain: "",
			domains: [],
			allDomains: [],
			auth: props.auth
		};

		props.dispatch(getCommunities());

		console.log("auth:", this.props.auth)
	}

	componentDidMount() {
		const { communities } = this.props.community;
		if (communities.length > 0) {
			this.setState({
				domains: communities,
				allDomains: communities
			});
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
				placeholder={I18n.t("search")}
				placeholderTextColor="#555555"
				testID="domainSelection.search" />
			<Ionicons
				style={styles.searchIcon}
				name="ios-search"
				size={32}
				color="#777777" />
		</View>;
	};

	renderItem = ({ item }) => {

		return <View>
			<SettingsListItem
				hasNavArrow={true}
				icon={<MaterialIcons
					name="group"
					style={styles.imageStyleIcon} />}
				title={item.name}
				onPress={() => this.props.dispatch(processSelectedCommunity(item))} />
		</View>;
	};

	render() {
		let onPressedCreateCommunity = () => this.props.navigation.push("login");
		if (this.props.showCreateCommunity == false) {
			onPressedCreateCommunity = () => this.props.navigation.push("domainCreate");
		}
		return <View style={styles.viewFlex}>
			<View>
				<View style={styles.card}>
					<Profile
						auth={this.props.auth}
						navigation={this.props.navigation} />
				</View>
				<View style={styles.card}>

					<SettingsListItem
						hasNavArrow={true}
						icon={<MaterialIcons
							name="camera-roll"
							style={styles.imageStyleIconCreate} />}
						title={I18n.t("createDomain")}
						onPress={() => onPressedCreateCommunity()}
						lastItem={true}
						subTitle="A Polo is your own space for sharing photos"
					/>
				</View>

			</View>
			<View style={styles.card}>
				{this.renderHeader()}
				<FlatList data={this.state.domains} renderItem={this.renderItem} keyExtractor={(_, idx) => "domain" + idx} ItemSeparatorComponent={this.renderSeparator} ListFooterComponent={<View style={styles.bottomSpace}></View>} />
			</View >
		</View>;
	}
}

const styles = StyleSheet.create({
	bottomSpace: {
		paddingBottom: 100
	},

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},

	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30
	},

	imageStyleIconCreate: {
		alignSelf: "center",
		color: "green",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30
	},
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
		backgroundColor: "#CED0CE"
	},
	viewFlex: {
		flex: 1,
		marginTop: 10
	}

});


const mapStateToProps = state => ({
	community: state.community,
	auth: state.auth
});

export default connect(mapStateToProps)(DomainSelection);