import * as React from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectableImageGrid from '../components/SelectableImageGrid';
import { useCameraRoll } from '../../hooks/useCameraRoll';
import uuid from "uuid";
import * as firebase from "firebase";
import { rebuildAlbum } from '../components/AlbumAPI'

interface TProps {
	storyKey: string
}

export default function ImagePickerScreen(props: TProps) {
	const camRoll = useCameraRoll();
	const [items, setItems] = React.useState<MediaLibrary.Asset[]>([]);

	const { storyKey } = props.route.params;
	console.log("StoryKey:", storyKey)

	const handleSelected = async (selectedItems: MediaLibrary.Asset[]) => {

		const asset = selectedItems
		console.log("creating: ", asset[0])
		//const cachedAsset = await MediaLibrary.createAssetAsync(asset[0].uri);
		const filename = uuid() + '.jpg'
		const promiseFS = FileSystem.copyAsync({ from: asset[0].uri, to: FileSystem.documentDirectory + filename })
		promiseFS.then((ret) => {
			console.log("promiseFS2: ", ret)

			//1. save this to firebase 
			var photo = {
				local: filename,
				timestamp: firebase.firestore.Timestamp.now(),
			};

			firebase
				.firestore()
				.collection(global.domain)
				.doc("feature")
				.collection("features")
				.doc(storyKey)
				.collection("photos")
				.add(photo)
				.then(() => {
					rebuildAlbum(storyKey)
				})

			//2. upload file to storage

			//3. reference the cloud version of the file if there is no local version

			//4. Rebuild story array

			setItems(selectedItems);
			props.navigation.setOptions({
				headerTitle: `Speed Pick Shortlist$${selectedItems.length} items selected`,
			});



		})
	}

	const noItems = camRoll.images.length === 0 && !camRoll.isRefreshing;

	if (!camRoll.permissionsGranted) return <NoPermissionsMessage />;

	const onContinue = () => {
		//props.navigation.push('Prepare', { images: items });
	};

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
