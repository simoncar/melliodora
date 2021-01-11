import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Image from "../components/Imgix";
import { StoryEntity } from "../lib/interfaces";
import { SettingsListItem } from "./SettingsListItem";
import { getStories } from "../lib/APIStory";
import { useDomain, AuthObj } from "../lib/globalState";

interface TProps {
	navigation: any;
}

export default function MoreAdmin(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [featureItems, setFeatureItems] = useState([]);
	const [, , domain] = useDomain();

	const auth = AuthObj();

	const storyRead = (stories) => {
		setFeatureItems(stories);
		setLoading(false);
	};

	useEffect(() => {
		const unsubscribeStory = getStories(domain, auth.language, storyRead);

		return () => {
			unsubscribeStory;
		};
	});

	const renderItem = (item: any) => {
		const uri = item.photo1;

		return (
			<SettingsListItem
				key={"feature2" + item._key}
				title={item.summaryMyLanguage}
				icon={<Image style={styles.imageIcon} source={{ uri: uri }} />}
				onPress={() =>
					props.navigation.navigate("storyMore", {
						story: item,
						domain: domain,
						language: auth.language,
						admin: true,
					})
				}
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
