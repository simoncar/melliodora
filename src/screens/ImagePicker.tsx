import * as React from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectableImageGrid from '../components/SelectableImageGrid';
import { useCameraRoll } from '../../hooks/useCameraRoll';

export default function ImagePickerScreen(props: any) {
	const camRoll = useCameraRoll();
	const [items, setItems] = React.useState<MediaLibrary.Asset[]>([]);

	const handleSelected = async (selectedItems: MediaLibrary.Asset[]) => {

		const asset = selectedItems
		console.log("creating: ", asset[0])
		//const cachedAsset = await MediaLibrary.createAssetAsync(asset[0].uri);

		const promiseFS = FileSystem.copyAsync({ from: asset[0].uri, to: FileSystem.documentDirectory + 'myFile.jpg' })
		promiseFS.then((ret) => {
			console.log("promiseFS2: ", ret)

			const promiseInfo = FileSystem.getInfoAsync(FileSystem.documentDirectory + 'myFile.jpg')
			promiseInfo.then(async (retaa) => {
				console.log("promiseInfo: ", retaa)
				const assetXX = await MediaLibrary.createAssetAsync(retaa.uri);

				const promise = MediaLibrary.getAlbumAsync("Imports - Selected")

				promise.then((ret) => {
					console.log("adding =", retaa.uri)



					const promise2 = MediaLibrary.addAssetsToAlbumAsync(assetXX, ret.id, true);
					promise2.then((ret2) => {
						console.log("ret2=", ret2, asset)
					})
						.catch((err) => {
							return err;
						});
				})
					.catch((err) => {
						return err;
					});

				setItems(selectedItems);
				props.navigation.setOptions({
					headerTitle: `Speed Pick Shortlist$${selectedItems.length} items selected`,
				});

			})

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
