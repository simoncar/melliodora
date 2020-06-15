// CustomText.js    
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text as RNText } from "native-base"

export function Text(props) {
	const { style, ...rest } = props;

	return (
		<RNText {...rest} style={[styles.defaultStyle, style]}>
			{rest.children}
		</RNText>
	);
}



const styles = StyleSheet.create({
	// ... add your default style here
	defaultStyle: {
		fontFamily: "SegoeUI",
	},
});
