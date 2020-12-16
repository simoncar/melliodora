import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import AlbumImage from "./AlbumImage"
import { listenPhotos } from "../lib/albumAPI"
import Image from "../components/Imgix"
import ImageView from "react-native-image-viewing";
import { ScrollView } from 'react-native-gesture-handler';


interface IProps {
	feature: string,
	refreshFunction: any,
	edit: boolean,
	miniRoll: boolean,
}

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');


export default function ImageList(props: IProps) {
	const [photos, setPhotos] = useState([]);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [visible, setIsVisible] = useState(false);

	const images = [];
	const feature = props.feature
	const miniRoll = props.miniRoll

	const onChange = ({ window, screen }) => {
		setDimensions({ window, screen });
	};

	useEffect(() => {

		if (Array.isArray(photos)) {
			listenPhotos(feature, refreshFunction)
		}

		Dimensions.addEventListener('change', onChange);
		return () => {
			Dimensions.removeEventListener('change', onChange);
		};

	}, []);

	function refreshFunction(photos: []) {
		setPhotos(photos);
	}


	photos.map(image => {
		if (image.thumb != undefined && image.thumb.length > 1) {
			images.push({ uri: image.thumb })
		}
	})

	if (miniRoll === true) {
		return (
			<View
				style={styles.rollView}>
				<ScrollView
					horizontal={true}>
					{
						Object.keys(photos).map(function (key: number, index) {

							return <Image
								key={photos[key].key}
								source={{
									uri: photos[key].server
								}}
								style={styles.image}
							/>


						})
					}
				</ScrollView>
			</View >
		);
	} else {
		return <View>
			{
				Object.keys(photos).map(function (key: number, index) {

					return <AlbumImage
						key={photos[key].key}
						photoKey={photos[key].key}
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


		</View>
	}
}

const styles = StyleSheet.create({
	image: {
		height: 80,
		width: 80
	},
	rollView: {
		flex: 1,
		flexDirection: "row",

	}
})

