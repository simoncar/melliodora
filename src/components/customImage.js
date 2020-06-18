
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewPropTypes, Text, View, Dimensions, Modal, Button, CameraRoll } from "react-native";
import { Image } from "react-native-expo-image-cache";
import I18n from "../lib/i18n";

const { width } = Dimensions.get("window");

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

	_share(uri) {
		CameraRoll.saveToCameraRoll(uri, "photo");
		this.setState({ saveTitle: I18n.t("saved") });
	}

	render() {
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};
		const uri = this.props.currentMessage.image;
		const images = [{
			url: uri,
			saveToLocalByLongPress: true
		}];

		if (this.props.currentMessage.image) {
			return <View style={styles.top}>
				<TouchableOpacity onPress={() => {
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
							<Button title={this.state.saveTitle} onPress={() => {
								this._share(uri);
							}} />
						</View>

						<Image style={styles.modalImageView} {...{ preview, uri }} resizeMode={"contain"} />
					</Modal>

					<Image style={styles.chatImageVIew} {...{ preview, uri }} />
				</TouchableOpacity>


			</View>;
		} else return null;
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

