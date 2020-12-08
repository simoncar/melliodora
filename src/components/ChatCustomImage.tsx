
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Modal, Button } from "react-native";
import { Image } from "react-native-expo-image-cache";

import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import I18n from "../lib/i18n";

export default class CustomImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			saveTitle: I18n.t("save")
		};
	}

	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
	}

	downloadFile(uri) {
		let fileUri = FileSystem.documentDirectory + "image.jpg";
		FileSystem.downloadAsync(uri, fileUri)
			.then(({ uri }) => {
				this.saveFile(uri);
			})

	}

	saveFile = async (fileUri) => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status === "granted") {
			const asset = await MediaLibrary.createAssetAsync(fileUri)
			await MediaLibrary.saveToLibraryAsync(asset).then(
				this.setState({ modalVisible: false })
			)
		}
	}

	render() {
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};
		const uri = this.props.currentMessage.image;

		if (this.props.currentMessage.image) {
			return <View style={styles.top}>
				<TouchableOpacity testID="customImage.showImage" onPress={() => {
					this.setModalVisible(!this.state.modalVisible);
				}}>
					<Modal transparent={false} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)}>

						<View style={styles.modalActions}>
							<TouchableOpacity onPress={() => {
								this.setModalVisible(!this.state.modalVisible);
							}}>
								<Text style={styles.headerActions}>
									Close
							</Text>
							</TouchableOpacity>
							<Button
								title={this.state.saveTitle}
								testID="customImage.save"
								onPress={() => {
									this.downloadFile(uri);
								}} />
						</View>

						<Image
							style={styles.modalImageView}
							{...{ preview, uri }}
							resizeMode={"contain"}
							testID="customImage.image" />
					</Modal>

					<Image style={styles.chatImageVIew} {...{ preview, uri }} />
				</TouchableOpacity>


			</View>;
		} else {
			return null
		}
	}
}

const styles = StyleSheet.create({
	chatImageVIew: {
		height: 200,
		marginBottom: 5,
		width: 350,

	},
	headerActions: {
		fontSize: 20,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingTop: 50
	},
	modalActions: {

	},
	modalImageView: {
		alignItems: "center",
		flex: 1,
		height: null,
		justifyContent: "center",
		width: null
	},
	top: {
		margin: 5

	}

});

