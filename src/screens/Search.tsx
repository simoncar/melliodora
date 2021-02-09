import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import CalendarItem from "../components/CalendarItem";

interface IProps {
	navigation: any;
	route: any;
}

export default function Search(props: IProps) {
	const [search, setSearch] = useState("");
	const [searchData, setSearchData] = useState([]);
	const { data, domain, language } = props.route.params;

	useEffect(() => {
		setSearchData(data);
		console.log("set search data");
	}, [data]);

	const searchFilterFunction = (text) => {
		if (data != null) {
			const newData = data.filter((item) => {
				const itemData = `${item.summary.toUpperCase()}`;
				const textData = text.toUpperCase();
				return itemData.indexOf(textData) > -1;
			});
			setSearch(text);
			setSearchData(newData);
		}
	};

	const renderItem = (item) => {
		return (
			<CalendarItem
				navigation={props.navigation}
				story={item.item}
				domain={domain}
				language={language}
				showDate={true}
			/>
		);
	};

	return (
		<View style={styles.searchView}>
			<FlatList
				data={searchData}
				renderItem={renderItem}
				ListHeaderComponent={
					<SearchBar
						lightTheme
						round
						autoCorrect={false}
						placeholder="Type Here..."
						onChangeText={(text) => searchFilterFunction(text)}
						value={search}
						containerStyle={styles.searchContainer}
						inputContainerStyle={styles.searchContainer}
					/>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	searchContainer: {
		backgroundColor: "#fff",
	},
	searchView: {
		flex: 1,
	},
});
