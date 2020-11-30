import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "./AlbumAPI"

interface IProps {
	feature: string,
	refreshFunction: any,
	edit:boolean,
}

export default function ImageList(props: IProps) {
	const [photos, setPhotos] = useState([]);
	const feature = props.feature

	useEffect(() => {
		if (Array.isArray(photos)) {
			let x = listenPhotos(feature, refreshFunction)
		}
	}, []);

	function refreshFunction(photos) {
		setPhotos(photos);
	}

	return (
		<View>
			{
				Object.keys(photos).map(function (key, index) {
					return <AlbumImage
						key={photos[key].key}
						local={photos[key].local}
						server={photos[key].server}
						thumb={photos[key].thumb}
						edit={props.edit}
					/>
				})
			}
		</View >
	);
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
