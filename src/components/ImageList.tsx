import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "./AlbumAPI"
import * as ScreenOrientation from 'expo-screen-orientation';

interface IProps {
	feature: string,
	refreshFunction: any,
	edit: boolean,
}

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');


export default function ImageList(props: IProps) {
	const [photos, setPhotos] = useState([]);
	const [dimensions, setDimensions] = useState({ window, screen });

	const feature = props.feature

	const onChange = ({ window, screen }) => {
		setDimensions({ window, screen });
	};

	useEffect(() => {

		if (Array.isArray(photos)) {
			let x = listenPhotos(feature, refreshFunction)
		}

		Dimensions.addEventListener('change', onChange);
		return () => {
			Dimensions.removeEventListener('change', onChange);
		};

	}, []);

	function refreshFunction(photos) {
		setPhotos(photos);
	}

	return (
		<View>
			<View>

				{
					Object.keys(photos).map(function (key: number, index) {
						return <AlbumImage
							key={photos[key].key}
							feature={photos[key].feature}
							local={photos[key].local}
							server={photos[key].server}
							thumb={photos[key].thumb}
							edit={props.edit}
							windowHeight={dimensions.window.height}
							windowWidth={dimensions.window.width}
						/>
					})
				}
			</View >
		</View >
	);
}

