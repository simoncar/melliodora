
import React, { Component } from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "./sComponent"

export const SettingsListItem = newFunction();


export const Separator = class Separator extends Component {
	render() {
		return <View style={styles.separator} />;
	}
};

function newFunction() {
	return class SettingsListItem extends Component {

		subTitle(subTitle) {
			if (subTitle != undefined) {
				return (
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						style={{ color: "#777777" }}
					>{subTitle}</Text>
				);
			} else
				return;
		}

		render() {
			const { icon, onPress, title, subTitle, titleInfoStyle, titleInfo, hasNavArrow = true, lastItem = false } = this.props;
			return <TouchableHighlight
				onPress={onPress}>
				<View style={(lastItem) ? styles.outerViewLast : styles.outerView}>
					{icon}
					<View style={styles.innerView}>
						<View>
							<Text style={[titleInfoStyle, { color: "#333333" }]}>{title || ""}</Text>
							{this.subTitle(subTitle)}
						</View>

						<View>
							<Text style={[titleInfoStyle, { color: "#777777" }]}>{titleInfo || ""}</Text>
						</View>
					</View>

					<View style={styles.rightChevron}>{hasNavArrow && <Feather name="chevron-right" size={22} color="#777777" />}</View>
				</View>
			</TouchableHighlight>;
		}
	};
}


const styles = StyleSheet.create({
	innerView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},
	innerView3: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},
	innerView2: {
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
	}
});