import React, { useState } from 'react';
import { StyleSheet, ImageBackground, TouchableHighlight, View, Image } from 'react-native';
import I18n from "../lib/i18n";
import { deleteImage } from "./AlbumAPI"
import { Foundation } from "@expo/vector-icons";

interface IProps {
	local: string,
	server: string,
	thumb: string,
	key: string,
	photoKey: string,
	edit: boolean,
	feature: string,
	windowHeight: number,
	windowWidth: number
}

export default function AlbumImage(props: IProps) {
	const [imageHeight, setHeight] = useState(1000);

	const imageURI = props.thumb
	const edit = props.edit
	//const windowWidth = Dimensions.get('window').width

	if (imageURI != undefined && imageURI.length > 1) {
		Image.getSize(imageURI, (width, height) => {
			setHeight(height / width * props.windowWidth)
		});

		const imageWidth = props.windowWidth

		return <View>

			<ImageBackground source={{ uri: imageURI, }}
				style={{
					width: imageWidth,
					height: imageHeight
				}}>
				{edit && <TouchableHighlight
					onPress={() => deleteImage(props.feature, props.photoKey)}
				>
					<Foundation
						name="x-circle"
						size={34}
						color="red"
						style={styles.iconDelete}
					/>
				</TouchableHighlight>
				}
			</ImageBackground>


		</View>;

	} else {
		return null
	}
}

const styles = StyleSheet.create({
	iconDelete: {
		alignSelf: 'flex-end'
	},

});
