import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import { IImage } from '../../core/interfaces';
import BadgeIcon from './BadgeIcon';
import { useTheme } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as firebase from "firebase";
import _ from "lodash";
import AlbumImage from "./AlbumImage"

interface IProps {
	album: {},
	refreshFunction: any,
}

export default function ImageList(props: IProps) {

	const album = props.album

	if ((typeof album === "object" || typeof album === 'function') && (album !== null)) {
		return (
			<View>
				{

					Object.keys(album).map(function (key, index) {
						console.log("el:", album[key])
						return <AlbumImage
							key={key}
							local={album[key].local}
							server={album[key].server}
							thumb={album[key].thumb}
						/>
					})
				}
			</View >
		);
	} else {
		return (null)
	}
}

const styles = StyleSheet.create({
	storyPhoto: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		elevation: 1,
		flex: 1,
		height: 200,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
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
