import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "./AlbumAPI"
import ImageView from "react-native-image-viewing";

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
	const images = [];
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


	photos.map(image => {
		if (image.thumb != undefined && image.thumb.length > 1) {
			images.push({ uri: image.thumb })
			console.log("Push:", image.thumb)
		}
	})

	// const images = [
	// 	{
	// 		uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
	// 	},
	// 	{
	// 		uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
	// 	},
	// 	{
	// 		uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
	// 	},
	// ];

	const [visible, setIsVisible] = useState(true);

	return (
		<View>
			<View>
				<ImageView
					images={images}
					imageIndex={0}
					visible={visible}
					onRequestClose={() => setIsVisible(false)}
					presentationStyle="fullScreen"
				/>

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

