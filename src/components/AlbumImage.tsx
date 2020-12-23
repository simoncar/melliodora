import React, { useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { deleteImage } from "../lib/albumAPI";
import { Foundation } from "@expo/vector-icons";
import Image from "../components/Imgix";

interface IProps {
	local: string;
	server: string;
	thumb: string;
	key: string;
	photoKey: string;
	edit: boolean;
	feature: string;
	windowHeight: number;
	windowWidth: number;
	domain: string;
}

export default function AlbumImage(props: IProps) {
	const imageURI = props.thumb;
	const edit = props.edit;
	//const windowWidth = Dimensions.get('window').width

	if (imageURI != undefined && imageURI.length > 1) {
		// Image.getSize(imageURI, (width, height) => {
		// 	setHeight(height / width * props.windowWidth)
		// });

		const imageWidth = props.windowWidth;

		return (
			<View>
				<Image source={{ uri: imageURI }} autoSizeProps={true} />
				{edit && (
					<TouchableHighlight
						onPress={() =>
							deleteImage(
								props.domain,
								props.feature,
								props.photoKey
							)
						}
						testID="delete">
						<Foundation
							name="x-circle"
							size={34}
							color="red"
							style={styles.iconDelete}
						/>
					</TouchableHighlight>
				)}
			</View>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	iconDelete: {
		alignSelf: "flex-end",
	},
});
