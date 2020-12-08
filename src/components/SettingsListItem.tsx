

import React from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "./sComponent";

interface TProps {
	icon: React.ReactNode;
	onPress: () => any;
	title: string;
	subTitle?: string;
	titleInfoStyle?: string;
	titleInfo?: string;
	hasNavArrow?: boolean;
	lastItem?: boolean;
}


export function Separator() {
	return <View style={styles.separator} />;
}

export function SettingsListItem(props: TProps) {

	const {
		icon,
		onPress,
		title,
		subTitle = "",
		titleInfoStyle,
		titleInfo = "",
		hasNavArrow = true,
		lastItem = false
	} = props;

	function renderSubTitle(subTitle: string) {
		if (subTitle != undefined) {
			return <Text
				numberOfLines={2}
				ellipsizeMode="tail"
				style={styles.subtitle}>
				{subTitle}</Text>;
		} else return;
	}

	return <TouchableHighlight onPress={onPress}>
		<View style={lastItem ? styles.outerViewLast : styles.outerView}>
			{icon}
			<View style={styles.innerView}>
				<View>
					<Text style={[titleInfoStyle, { color: "#333333" }]}>{title || ""}</Text>
					{renderSubTitle(subTitle)}
				</View>

				<View>
					<Text style={[titleInfoStyle, { color: "#777777" }]}>{titleInfo || ""}</Text>
				</View>
			</View>

			<View style={styles.rightChevron}>{hasNavArrow && <Feather name="chevron-right" size={22} color="#777777" />}</View>
		</View>
	</TouchableHighlight>;
};

const styles = StyleSheet.create({
	innerView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},

	outerView: {
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		paddingVertical: 8
	},
	outerViewLast: {
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		flexDirection: "row",
		paddingVertical: 8
	},
	rightChevron: {
		marginHorizontal: 8
	},
	separator: {
		backgroundColor: "#CED0CE",
		height: 1,
		marginTop: 30,
		width: "100%"
	},
	subtitle: { color: "#777777" }
});