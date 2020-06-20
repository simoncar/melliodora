import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import _ from "lodash";

export function Text(props) {
	const { style, ...rest } = props;

	return (
		<RNText {...rest} style={[styles.defaultStyle, style]}>
			{rest.children}
		</RNText>
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
});
