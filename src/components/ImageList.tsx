import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ListRenderItemInfo, View as BareView } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "./AlbumAPI"

interface IProps {
	feature: string,
	refreshFunction: any,
	edit: boolean,
}

export default function ImageList(props: IProps) {
	const [photos, setPhotos] = useState([]);

	const feature = props.feature

	console.log("feature props:", props)

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
						feature={photos[key].feature}
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

