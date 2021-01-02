import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity, View, ViewPropTypes, SafeAreaView } from "react-native";
import Constants from "expo-constants";
import { Text } from "./sComponent";
import * as Permissions from "expo-permissions";
import NavBar, { NavButton, NavButtonText, NavTitle } from "react-native-nav";
import { Entypo } from "@expo/vector-icons";

export default class CustomActions extends React.Component {
	constructor(props) {
		super(props);
		this._images = [];
		this.state = {
			image: null,
			modalVisiblePhoto: false,
			modalVisibleVideo: false,
		};
		this.onActionsPress = this.onActionsPress.bind(this);
		this.selectImagesPhoto = this.selectImagesPhoto.bind(this);
		this.selectImagesVideo = this.selectImagesVideo.bind(this);
	}

	componentDidMount() {
		this.getPermissionAsync();
	}

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		}
	};

	setImages(images) {
		this._images = images;
		//uploadUrl = await uploadImageAsync(images.uri);
	}

	getImages() {
		return this._images;
	}

	setModalVisiblePhoto(visible = false) {
		this.setState({ modalVisiblePhoto: visible });
	}

	setModalVisibleVideo(visible = false) {
		this.setState({ modalVisibleVideo: visible });
	}

	onActionsPress() {
		//_pickImage();

		const options = ["Photo", "Video", "Cancel"];
		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						//_pickImage();
						//this.setModalVisiblePhoto(true);
						break;
					case 1:
						// _pickVideo();

						break;
					case 2:
						break;
					default:
				}
			}
		);
	}

	selectImagesPhoto(images) {
		// dont use as it fires after every image is selected

		this.setImages(images);
	}

	selectImagesVideo(images) {
		// dont use as it fires after every image is selected

		this.setImages(images);
	}

	renderNavBarPhoto() {
		return (
			<SafeAreaView style={styles.ab62223e0b16711ea999f193302967c6e}>
				<NavBar style={styles.ab6224af0b16711ea999f193302967c6e}>
					<NavButton
						onPress={() => {
							this.setModalVisiblePhoto(false);
						}}>
						<NavButtonText style={styles.ab6224af1b16711ea999f193302967c6e}>{"Cancel"}</NavButtonText>
					</NavButton>
					<NavTitle style={styles.ab6224af2b16711ea999f193302967c6e}>{"Photos"}</NavTitle>
					<NavButton
						onPress={() => {
							this.setModalVisiblePhoto(false);

							const images = this.getImages().map((image) => {
								// fires for every individual image

								return {
									image: image.uri,
									filename: image.filename,
									playableDuration: 0,
								};
							});

							this.props.onSend(images);
							//this.handleAddPicture();
						}}>
						<NavButtonText style={styles.ab6227200b16711ea999f193302967c6e}>{"Send"}</NavButtonText>
					</NavButton>
				</NavBar>
			</SafeAreaView>
		);
	}

	renderNavBarVideo() {
		return (
			<SafeAreaView style={styles.ab6227201b16711ea999f193302967c6e}>
				<NavBar style={styles.ab6227202b16711ea999f193302967c6e}>
					<NavButton
						onPress={() => {
							this.setModalVisibleVideo(false);
						}}>
						<NavButtonText style={styles.ab6227203b16711ea999f193302967c6e}>
							<Text>Cancel</Text>
						</NavButtonText>
					</NavButton>
					<NavTitle style={styles.ab6227204b16711ea999f193302967c6e}>
						<Text>Videos</Text>
					</NavTitle>
					<NavButton
						onPress={() => {
							this.setModalVisibleVideo(false);

							const images = this.getImages().map((image) => {
								// fires for every individual image

								return {
									image: image.uri,
									filename: image.filename,
									playableDuration: 1,
								};
							});

							this.props.onSend(images);
							//this.handleAddPicture();
						}}>
						<NavButtonText style={styles.ab6229910b16711ea999f193302967c6e}>
							<Text>Send</Text>
						</NavButtonText>
					</NavButton>
				</NavBar>
			</SafeAreaView>
		);
	}

	renderIcon() {
		if (this.props.icon) {
			return this.props.icon();
		}
		return (
			<View>
				<Entypo name="camera" style={styles.ab622c020b16711ea999f193302967c6e} />
			</View>
		);
	}

	render() {
		return (
			<TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={this.onActionsPress}>
				{this.renderIcon()}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	ab62223e0b16711ea999f193302967c6e: { backgroundColor: "#fff" },
	ab6224af0b16711ea999f193302967c6e: {
		navBar: {
			backgroundColor: "#FFF",
		},
		statusBar: {
			backgroundColor: "#FFF",
		},
	},
	ab6224af1b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab6224af2b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab6227200b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab6227201b16711ea999f193302967c6e: { backgroundColor: "#fff" },
	ab6227202b16711ea999f193302967c6e: {
		navBar: {
			backgroundColor: "#FFF",
		},
		statusBar: {
			backgroundColor: "#FFF",
		},
	},
	ab6227203b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab6227204b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab6229910b16711ea999f193302967c6e: {
		color: "#000",
	},
	ab622c020b16711ea999f193302967c6e: { color: "#0284FF", fontSize: 25 },

	container: {
		height: 26,
		marginBottom: 10,
		marginLeft: 10,
		width: 26,
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
	onSend: () => {},
	options: {},
	icon: null,
	containerStyle: {},
	wrapperStyle: {},
	iconTextStyle: {},
};

CustomActions.propTypes = {
	onSend: PropTypes.func,
	options: PropTypes.object,
	icon: PropTypes.func,
	containerStyle: ViewPropTypes.style,
	wrapperStyle: ViewPropTypes.style,
	iconTextStyle: Text.propTypes.style,
};
