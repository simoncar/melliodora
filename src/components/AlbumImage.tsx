import React, { useState } from 'react';
import { StyleSheet, ImageBackground, TouchableHighlight, TouchableOpacity, Text, View, Image } from 'react-native';
import I18n from "../lib/i18n";
import { deleteImage } from "./AlbumAPI"
import { Foundation } from "@expo/vector-icons";

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

		return <View>

			<ImageBackground source={{ uri: imageURI, }}
				style={{
					width: props.windowWidth,
					height: imageHeight
				}}>
				{edit && <TouchableHighlight
					onPress={() => deleteImage("feature", "image")}
				>
					<Foundation
						name="x-circle"
						size={34}
						color="red"
						style={{ alignSelf: 'flex-end' }}
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

});
