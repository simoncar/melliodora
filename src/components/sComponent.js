import React from 'react';
import { StyleSheet, Text as RNText, View, TouchableOpacity } from 'react-native';
import _ from "lodash";

export function Text(props) {
	const { style, ...rest } = props;

	return (
		<RNText {...rest} style={[styles.defaultStyle, style]}>
			{rest.children}
		</RNText>
	);
}

export function Button(props) {
	const { style, ...rest } = props;

	return (


		<View style={styles.buttonView}>
			<TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={rest.onPress}>
				<Text>{rest.title}</Text>
			</TouchableOpacity>
		</View>

	);
}


export function ShortList(props) {
	const { navigation } = props;

	const features = props.data ? props.data : [];
	if (!_.isEmpty(features)) {

		return (
			<View>
				{
					features.map((el) => {
						return props.renderItem(navigation, el)
					})
				}
			</View >
		);
	} else {
		return <Text></Text>
	}
}

const styles = StyleSheet.create({
	defaultStyle: {
		fontFamily: "SegoeUI",
	},
	buttonView: { alignItems: "center", flexDirection: "column", marginTop: 12 },
	SubmitButtonStyle: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		elevation: 4,
		height: 50,
		justifyContent: "center",
		marginBottom: 30,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		width: 250
	},
});
