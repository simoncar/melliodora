import React, { useState, useEffect } from 'react'
import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectableImageGrid from '../components/SelectableImageGrid';
import { useCameraRoll } from '../../hooks/useCameraRoll';
import { saveSelectedImages } from "../components/AlbumAPI";
import I18n from "../lib/i18n";

interface TProps {
	storyKey: string
	route: any
	navigation: any
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
			headerTitle: "Add Photos",
			headerRight: () => <Button onPress={() => save()} title={I18n.t("save")} />,
		});
	}, [items])

	const save = () => {

		saveSelectedImages(items, storyKey)

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
					<SelectableImageGrid
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	messageText: {
		fontSize: 15,
	},
	refreshIcon: {
		paddingTop: 20,
		fontSize: 50,
	},
	secondaryText: {
		fontSize: 12,
		color: '#555',
	},
	fab: {
		position: 'absolute',
		bottom: 16,
		left: '30%',
		right: '30%',
	},
});
