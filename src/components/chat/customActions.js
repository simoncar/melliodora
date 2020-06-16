import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity, View, ViewPropTypes, SafeAreaView } from "react-native";
import Constants from "expo-constants";
import { Text } from "../../components/sComponent"
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
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
			<SafeAreaView style={{ backgroundColor: "#fff" }}>
				<NavBar
					style={{
						statusBar: {
							backgroundColor: "#FFF",
						},
						navBar: {
							backgroundColor: "#FFF",
						},
					}}>
					<NavButton
						onPress={() => {
							this.setModalVisiblePhoto(false);
						}}>
						<NavButtonText
							style={{
								color: "#000",
							}}>
							{"Cancel"}
						</NavButtonText>
					</NavButton>
					<NavTitle
						style={{
							color: "#000",
						}}>
						{"Photos"}
					</NavTitle>
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
						<NavButtonText
							style={{
								color: "#000",
							}}>
							{"Send"}
						</NavButtonText>
					</NavButton>
				</NavBar>
			</SafeAreaView>
		);
	}

	renderNavBarVideo() {
		return (
			<SafeAreaView style={{ backgroundColor: "#fff" }}>
				<NavBar
					style={{
						statusBar: {
							backgroundColor: "#FFF",
						},
						navBar: {
							backgroundColor: "#FFF",
						},
					}}>
					<NavButton
						onPress={() => {
							this.setModalVisibleVideo(false);
						}}>
						<NavButtonText
							style={{
								color: "#000",
							}}>
							{"Cancel"}
						</NavButtonText>
					</NavButton>
					<NavTitle
						style={{
							color: "#000",
						}}>
						{"Videos"}
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
						<NavButtonText
							style={{
								color: "#000",
							}}>
							{"Send"}
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
				<Entypo name="camera" style={{ fontSize: 25, color: "#0284FF" }} />
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
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: "#b2b2b2",
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: "#b2b2b2",
		fontWeight: "bold",
		fontSize: 16,
		backgroundColor: "transparent",
		textAlign: "center",
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
	onSend: () => { },
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
