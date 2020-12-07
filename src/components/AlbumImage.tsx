import React, { useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Text, View, Image } from 'react-native';
import I18n from "../lib/i18n";
import { deleteImage } from "./AlbumAPI"


interface IProps {
	local: string,
	server: string,
	thumb: string,
	key: string,
	edit: boolean,
	feature: string,
	windowHeight: number,
	windowWidth: number
}

function deleteButton() {
	return <TouchableOpacity
		style={styles.SubmitButtonStyle}
		activeOpacity={0.5}
		testID="delete"
		onPress={() => {
			deleteImage("feature", "image")
		}}>
		<Text>
			{I18n.t("delete")}
		</Text>
	</TouchableOpacity >;
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

		if (edit === true) {

			return <View>
				<Image style={[styles.storyPhoto, { width: "70%" }]}
					source={{
						uri: imageURI,
					}}
					key={imageURI}
				/>
				{deleteButton()}
			</View>;
		} else {
			return <View>
				<Image style={[styles.storyPhoto,
				{
					width: props.windowWidth,
					height: imageHeight
				}]}
					source={{
						uri: imageURI,
					}}
					key={imageURI}
				/>
			</View>;
		}
	} else {
		return null
	}
}

const styles = StyleSheet.create({
	SubmitButtonStyle: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		elevation: 4,
		height: 50,
		justifyContent: "center",
		marginBottom: 30,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		width: 250,

	},
	storyPhoto: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		flex: 1,
		marginBottom: 12,
		resizeMode: "contain",
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,

	},

});
