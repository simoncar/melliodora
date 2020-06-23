
import React, { Component } from "react";
import { View, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { ListItem } from "react-native-elements";
import { Text } from "../components/sComponent";
import * as firebase from "firebase";
import _ from "lodash";
import I18n from "../lib/i18n";

class UserSearch extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			loadingMessage: I18n.t("search") + "...",
			data: [],
			fullData: [],
			error: null
		};
	}
	keyExtractor = item => item._key;

	componentDidMount() {

		this.props.navigation.setParams({ reload: this.loadData });
		this.loadData();
	}

	loadData = () => {
		this.setState({ loading: true });
		this._getUsers().then(data => this.setState({ data: data, fullData: data, loading: false }));
	};

	_getUsers = async () => {
		var data = [];
		var querySnapshot = await firebase.firestore().collection(global.domain).doc("user").collection("registered").limit(5000).get();

		querySnapshot.docs.forEach(doc => {
			let docData = doc.data();
			docData = { ...docData, uid: docData.uid || doc.id };
			data.push(docData);
		});
		return data;
	};

	renderSeparator = () => {
		return <View style={styles.separator} />;
	};

	searchFilterFunction = text => {
		this.setState({
			value: text
		});

		const fullData = this.state.fullData;

		if (!text) {
			this.setState({
				data: fullData
			});
			return;
		}
		const textToSearch = text.toUpperCase();
		const filteredData = fullData.filter(dataItem => {
			const searchObject = _.pick(dataItem, ["email", "displayName", "firstName", "lastName"]);

			return Object.values(searchObject).some(item => item.toUpperCase().includes(textToSearch));
		});

		this.setState({
			data: filteredData
		});
	};

	renderHeader = () => {
		return <SearchBar placeholder={this.state.loadingMessage}
			lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value} containerStyle={styles.searchContainer} inputContainerStyle={styles.searchContainer} />;
	};

	_renderItem({ item }) {

		const avatarTitle = item.email.slice(0, 2);
		const fullName = ((item.firstName != undefined) ? item.firstName : "") + " " + ((item.lastName != undefined) ? item.lastName : "");
		const avatar = item.photoURL ? { source: { uri: item.photoURL } } : { title: avatarTitle };
		return <TouchableOpacity onPress={() =>
			this.props.navigation.navigate("UserProfile",
				{
					uid: item.uid,
					user: item
				})
		}>
			<ListItem leftAvatar={{
				rounded: true,
				...avatar
			}} title={<View style={styles.userView}>
				<Text style={styles.titleText}>{item.displayName || fullName}</Text>
			</View>} chevron={true} subtitle={<View style={styles.subTitle}>
				<Text style={styles.emailText}>{item.email}</Text>
			</View>} />
		</TouchableOpacity>;
	}

	render() {
		if (this.state.loading) {
			return <View style={styles.loadingView}>
				<ActivityIndicator size="large" style={styles.loadingIndicator} />
			</View>;
		}
		return <View style={styles.overallView}>
			<FlatList data={this.state.data} renderItem={this._renderItem.bind(this)} keyExtractor={(_, idx) => "search" + idx} ItemSeparatorComponent={this.renderSeparator} ListHeaderComponent={this.renderHeader} />
		</View>;
	}
}

const styles = StyleSheet.create({
	emailText: { color: "gray" },
	loadingView: { alignItems: "center", flex: 1, justifyContent: "center" },
	overallView: { flex: 1 },
	searchContainer: {
		backgroundColor: "#fff"
	},
	separator: {
		backgroundColor: "#CED0CE",
		height: 1
	},
	subTitle: { flex: 1, flexDirection: "column", paddingTop: 3 },
	titleText: { flex: 1, fontSize: 16 },


	userView: { flex: 1, flexDirection: "row" }
});


export default UserSearch;