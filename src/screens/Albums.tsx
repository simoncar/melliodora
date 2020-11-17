import React, { Component } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import { SettingsListItem } from "../components/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { Text } from "../components/sComponent";
import { connect } from "react-redux";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';


export interface CameraRollResult {
	images: MediaLibrary.Asset[];
	isRefreshing: boolean;
	isLoadingMore: boolean;
	permissionsGranted: boolean;
}

interface TProps {
	albums: []
}
interface TState {
	albums: {
		title: string;
		_key: string;
	}[]
}

export class SelectAlbum extends Component<TProps, TState>{

	constructor(props: Readonly<TProps>) {
		super(props);
		this.state = {
			albums: [],
		};

		const albums: {
			title: string;
			_key: string;
		}[] = [];

		MediaLibrary.requestPermissionsAsync()
			.then(status => {

				MediaLibrary.getAlbumsAsync()
					.then(albumsList => {
						console.log("Albums:", albumsList)
						albumsList.forEach(album => {
							console.log("Album:", album.title)
							albums.push({
								title: album.title,
								_key: album.id
							})
						})
						this.setState({
							albums,
						});
					}).catch(error => {
						console.log(error)
					})
			})


	}

	keyExtractor = (item) => item._key;

	_renderItem = ({ item }) => (
		<View style={styles.card}>
			<TouchableOpacity
				onPress={() => {
					console.log("pressed:", item)
				}}>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		</View>
	);


	//	<SettingsListItem hasSwitch={false} hasNavArrow={false} title="English" onPress={() => this._changeLanguage("en")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("en")} />} />

	render() {
		return <SafeAreaView style={styles.adminContainer}>
			<View style={styles.card}>
				<Text>Albums</Text>
			</View>
			<View style={styles.card}>
				<FlatList data={this.state.albums} renderItem={this._renderItem} keyExtractor={this.keyExtractor} />
			</View>
		</SafeAreaView>
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
	imageStyleCheckOff: {
		alignSelf: "center",
		color: "#FFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},
	imageStyleCheckOn: {
		alignSelf: "center",
		color: "#007AFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},
	restartWarning: {
		alignSelf: "center",
		color: "#8e8e93",
		fontSize: 16,
	}
});


const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(SelectAlbum);