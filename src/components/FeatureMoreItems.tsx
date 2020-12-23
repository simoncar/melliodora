import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Image from "../components/Imgix";
import { SettingsListItem } from "./SettingsListItem";
import { getStories } from "../lib/storyAPI";
import { connect } from "react-redux";
import { usePersistedDomainNode } from "../lib/globalState";

interface TProps {
	navigation: any;
	language: string;
}

export default function FeatureMoreItems(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [featureItems, setFeatureItems] = useState([]);
	const [domainNode, domainNodeSetter, domainNodeIsUpdated] = usePersistedDomainNode();

	useEffect(() => {
		getStories(domainNode)
			.then((stories) => {
				setFeatureItems(stories);
				setLoading(false);
			})
			.catch((e) => {
				console.error(e.message);
			});
	});

	const renderItem = (item: any) => {
		const uri = item.photo1;

		return (
			<SettingsListItem
				key={"feature2" + item._key}
				title={item.summaryMyLanguage}
				icon={<Image style={styles.imageIcon} source={{ uri: uri }} />}
				onPress={() => props.navigation.navigate("storyMore", { story: item })}
			/>
		);
	};

	if (loading) {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	} else if (featureItems === undefined || featureItems.length == 0) {
		return (
			<View>
				<Text>Empty</Text>
			</View>
		);
	} else {
		return (
			<View>
				{featureItems.map((item) => {
					return <View key={item._key}>{renderItem(item)}</View>;
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageIcon: {
		alignSelf: "center",
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: 0.1,
		height: 30,
		marginLeft: 15,
		width: 30,
	},
});
