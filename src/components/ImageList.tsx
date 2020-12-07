import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ListRenderItemInfo, View as BareView } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "./AlbumAPI"
import * as ScreenOrientation from 'expo-screen-orientation';

interface IProps {
	feature: string,
	refreshFunction: any,
	edit: boolean,
}

function useForceUpdate() {
	const [value, setValue] = useState(0); // integer state
	console.log("forceUpdate:", value)
	return () => setValue(value => ++value); // update the state to force render
}

export default function ImageList(props: IProps) {
	const [photos, setPhotos] = useState([]);

	const forceUpdate = useForceUpdate();

	const feature = props.feature

	useEffect(() => {
		const subscription = ScreenOrientation.addOrientationChangeListener(() => {
			console.log('ScreenOrientation change event');
			forceUpdate()
		});
		if (Array.isArray(photos)) {
			let x = listenPhotos(feature, refreshFunction)
		}
		return () => {
			ScreenOrientation.removeOrientationChangeListeners(subscription);
		};
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

