import React, { useState, useEffect } from 'react'
import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageLibraryGrid from '../components/ImageLibraryGrid';
import { useCameraRoll } from '../../hooks/useCameraRoll';
import { saveSelectedImages, storageSend } from "../lib/albumAPI";
import I18n from "../lib/i18n";

interface TProps {
	storyKey: string,
	route: any,
	navigation: any,
	album: string
}

export default function FormAlbum(props: TProps) {
	const [items, setItems] = useState<MediaLibrary.Asset[]>([]);

	const { storyKey, album, key } = props.route.params;
	const navigation = props.navigation;

	let filter = ""

	if (key === "RECENT") {
		filter = key
	} else {
		filter = album
	}
	const camRoll = useCameraRoll(filter);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: I18n.t("photoChoose"),
			headerRight: () => { return <Button onPress={() => save()} title={I18n.t("save")} /> },
		});
	}, [items])

	const save = () => {
		console.log("SAVE:", storyKey)
		saveSelectedImages(items, storyKey)
			.then(() => {
				console.log("SAVE COMPLETE to LOCAL and FIREBASE")
				storageSend(storyKey)
				navigation.pop();
				navigation.pop();
			})
	}

	const handleSelected = async (selectedItems: MediaLibrary.Asset[]) => {
		setItems(selectedItems);
	}

	const noItems = camRoll.images.length === 0 && !camRoll.isRefreshing;

	if (!camRoll.permissionsGranted) return <NoPermissionsMessage />;

	return (
		<View style={styles.container}>
			{noItems ? (
				<NoItemsMessage handleRefresh={camRoll.doRefresh} />
			) : (
					<ImageLibraryGrid
						images={camRoll.images}
						onSelectedChange={handleSelected}
						refreshing={camRoll.isRefreshing}
						loadingMore={camRoll.isLoadingMore}
						onRefresh={camRoll.doRefresh}
						onEndReached={camRoll.loadMore}
					/>
				)}
		</View>
	);
}

function NoItemsMessage(props: { handleRefresh: () => void }) {
	return (
		<View style={styles.messageContainer}>
			<Text style={styles.messageText}>There are no photos in your camera roll!</Text>
			<Ionicons name="ios-refresh" onPress={props.handleRefresh} style={styles.refreshIcon} size={20} />
			<Text style={styles.secondaryText}>Click to refresh</Text>
		</View>
	);
}

function NoPermissionsMessage() {
	return (
		<View style={styles.messageContainer}>
			<Text style={styles.messageText}>You need permissions to access Camera Roll!</Text>
			<TouchableOpacity onPress={() => Linking.openSettings()}>Open Settings</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	messageContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	messageText: {
		fontSize: 15,
	},
	refreshIcon: {
		fontSize: 50,
		paddingTop: 20,
	},
	secondaryText: {
		color: '#555',
		fontSize: 12,
	},

});
