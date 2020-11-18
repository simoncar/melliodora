import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import { IImage } from '../../core/interfaces';
import BadgeIcon from './BadgeIcon';
import { useTheme } from '@react-navigation/native';



export default function ImageList(props: any) {




	return (
		<View>
			<Text>Image List Component</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		height: 100,
		width: "100%",
		resizeMode: "contain",
	},
	overlay: {
		//...StyleSheet.absoluteFillObject,
		//backgroundColor: 'rgba(255,255,255,0.7)',
		borderColor: "blue",
		margin: 2,
	},
	selectionBorder: {
		borderRadius: 3,
		borderRightWidth: 50,
		flex: 1,
	},
	itemView: {
		flex: 1,
		flexDirection: 'column',
		margin: 1,
	},
	badge: {
		position: 'absolute',
		top: 10,
		left: 10,
	},
});
