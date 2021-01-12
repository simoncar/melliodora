import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import CalendarItem from "../components/CalendarItem";
import I18n from "../lib/i18n";

interface IProps {
	navigation: any;
	route: any;
}

export default function Search(props: IProps) {
	const [search, setSearch] = useState("");
	const data = props.route.params.data;

	const searchFilterFunction = (text) => {
		// if (fullData != null) {
		// 	const newData = fullData.filter((item) => {
		// 		const itemData = `${item.summary.toUpperCase()}`;
		// 		const textData = text.toUpperCase();
		// 		return itemData.indexOf(textData) > -1;
		// 	});
		// 	this.setState({
		// 		data: newData,
		// 	});
		// }
	};

	const updateSearch = (search) => {
		setSearch(search);
	};

	const renderHeader = () => {
		return <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} />;
	};

	const renderItem = (item) => {
		return <CalendarItem navigation={props.navigation} item={item.summary} />;
	};

	console.log("Search Data: ", data);
	return (
		<View style={styles.searchView}>
			<FlatList data={data} renderItem={renderItem} ListHeaderComponent={renderHeader} />
		</View>
	);
}

// Styles
const styles = StyleSheet.create({
	searchContainer: {
		backgroundColor: "#fff",
	},

	searchView: { flex: 1 },
});
