import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import _ from "lodash";

interface IProps {
	local: string,
	server: string,
	thumb: string,
	key: string
}

export default function AlbumImage(props: IProps) {
	const [isLoading, setIsLoading] = useState(true);

	const imageURI = props.thumb

	if (imageURI != undefined && imageURI.length > 1) {
		return <View>
			<Image style={styles.storyPhoto}
				source={{
					uri: imageURI,
				}}
				key={imageURI}
			/>
		</View>;
	} else {
		return null
	}
}

const styles = StyleSheet.create({
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
