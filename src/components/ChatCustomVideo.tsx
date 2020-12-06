
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Modal, ImageBackground, CameraRoll } from "react-native";
import { Video } from "expo";
import I18n from "../lib/i18n";

export default class CustomVideo extends React.Component {
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

	_share(uri) {
		CameraRoll.saveToCameraRoll(uri, "video");
		this.setState({ saveTitle: I18n.t("saved") });
	}

	render() {
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};
		const uri = this.props.currentMessage.video;

		if (this.props.currentMessage.video) {
			return <View>
				<TouchableOpacity onPress={() => {
					this.setModalVisible(!this.state.modalVisible);
				}}>
					<Modal transparent={false} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)}>
						<TouchableOpacity onPress={() => {
							this.setModalVisible(!this.state.modalVisible);
						}}>
							<Text style={styles.acb9ca510b16711ea999f193302967c6e}>
								{" "}
                  Close{" "}
							</Text>
						</TouchableOpacity>

						<Video source={{
							uri: uri
						}} rate={1.0} volume={1.0} resizeMode="cover" shouldPlay isLooping style={styles.acb9ca511b16711ea999f193302967c6e} />
					</Modal>

					<ImageBackground style={styles.acb9ca512b16711ea999f193302967c6e} {...{ preview, uri }} resizeMode={"contain"}>
						<View style={styles.acb9ca513b16711ea999f193302967c6e}>
							<Video source={{
								uri: uri
							}} rate={1.0} volume={1.0} isMuted={false} resizeMode="cover" style={styles.acb9ca514b16711ea999f193302967c6e} />
						</View>
					</ImageBackground>
				</TouchableOpacity>
			</View>;
		} else return null;
	}
}

const styles = StyleSheet.create({
	acb9ca510b16711ea999f193302967c6e: {
		fontSize: 20,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingTop: 50
	},
	acb9ca511b16711ea999f193302967c6e: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	acb9ca512b16711ea999f193302967c6e: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center"
	},
	acb9ca513b16711ea999f193302967c6e: {
		alignItems: "center",
		justifyContent: "center"
	},
	acb9ca514b16711ea999f193302967c6e: { height: 300, width: 300 },


});

