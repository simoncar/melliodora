import React, { Component } from "react";
import { FlatList, StyleSheet, View, SafeAreaView } from "react-native";
import { SettingsListItem } from "../components/SettingsListItem";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

export interface CameraRollResult {
	images: MediaLibrary.Asset[];
	isRefreshing: boolean;
	isLoadingMore: boolean;
	permissionsGranted: boolean;
}

interface TProps {
	navigation: any;
	albums: [];
	route: any;
	storyKey: string;
}
interface TState {
	storyKey: string;
	albums: {
		title: string;
		key: string;
	}[];
}

export default class SelectAlbum extends Component<TProps, TState> {
	constructor(props: Readonly<TProps>) {
		super(props);

		const { storyKey } = this.props.route.params;

		this.state = {
			albums: [],
			storyKey: storyKey,
		};

		const albums: {
			title: string;
			key: string;
		}[] = [];

		MediaLibrary.requestPermissionsAsync().then(() => {
			albums.push({
				title: "Recent",
				key: "RECENT",
			});

			MediaLibrary.getAlbumsAsync()
				.then((albumsList) => {
					if (albumsList != undefined) {
						albumsList.forEach((album) => {
							albums.push({
								title: album.title,
								key: album.id,
							});
						});
					}
					this.setState({
						albums,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		});
	}


	_renderItem = ({ item }) => (
		<View style={styles.card}>
			<SettingsListItem
				hasSwitch={false}
				hasNavArrow={true}
				title={item.title}
				onPress={() => {
					this.props.navigation.navigate("FormAlbum", {
						storyKey: this.state.storyKey,
						album: item.title,
						key: item.key,
					});
				}}
				icon={<MaterialIcons name="camera" size={35} />}
			/>
		</View>
	);

	render() {
		return (
			<SafeAreaView style={styles.adminContainer}>
				<View style={styles.card}>
					<FlatList data={this.state.albums} renderItem={this._renderItem} />
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	adminContainer: {
		alignItems: "center",
		flex: 1,
		marginTop: 10,
	},
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},
});
