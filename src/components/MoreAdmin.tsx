import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Image from "../components/Imgix";
import { SettingsListItem } from "./SettingsListItem";
import { getStories } from "../lib/APIStory";
import { useDomain, AuthObj } from "../lib/globalState";
import { Bar } from "expo-progress";
import { StoryEntity } from "../lib/interfaces";

interface TProps {
	navigation: any;
}

export default function MoreAdmin(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [featureItems, setFeatureItems] = useState<StoryEntity[]>([]);
	const [, , domain] = useDomain();

	const auth = AuthObj();

	const storyRead = (stories: StoryEntity[]) => {
		setFeatureItems(stories);
		setLoading(false);
	};

	useEffect(() => {
		const unsubscribeStory = getStories(domain, auth.language, storyRead);

		return () => {
			unsubscribeStory;
		};
	}, [domain, auth.language]);

	const renderItem = (item: StoryEntity) => {
		const uri = item.photo1;

		return (
			<SettingsListItem
				key={"feature2" + item.key}
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

	return (
		<View>
			{loading && <Bar isIndeterminate color="blue" />}
			{featureItems.map((item: StoryEntity) => {
				return <View key={item.key}>{renderItem(item)}</View>;
			})}
		</View>
	);
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
