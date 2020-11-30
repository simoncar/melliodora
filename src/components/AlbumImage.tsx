import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import _ from "lodash";
import I18n from "../lib/i18n";

interface IProps {
	local: string,
	server: string,
	thumb: string,
	key: string,
	edit: boolean,
}

function deleteButton() {
	return <TouchableOpacity
		style={styles.SubmitButtonStyle}
		activeOpacity={0.5}
		onPress={() => {
			console.log("delete:")
		}}>
		<Text>
			{I18n.t("delete")}
		</Text>
	</TouchableOpacity >;
}


export default function AlbumImage(props: IProps) {
	const [isLoading, setIsLoading] = useState(true);

	const imageURI = props.thumb
	const edit = props.edit

	if (imageURI != undefined && imageURI.length > 1) {
		if (edit) {

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
				<Image style={styles.storyPhoto}
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
