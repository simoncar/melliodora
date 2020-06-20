import firebase from "firebase";
import uuid from "uuid";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export async function getPermissionAsync() {
	const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
	this.setState({ hasCameraPermission: status === "granted" });
}

export const saveProfilePic = async (imgURI) => {
	if (!imgURI) return "";
	var fileToUpload = imgURI;


	mime = "image/jpeg";
	// this.setState({ cameraIcon: "hour-glass" });

	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", fileToUpload, true);
		xhr.send(null);
	});

	const ref = firebase.storage().ref("smartcommunity/profile").child(uuid.v4());

	const snapshot = await ref.put(blob, { contentType: mime });
	const downloadURL = await snapshot.ref.getDownloadURL();

	blob.close();
	return downloadURL;
};

export async function launchProfileImagePicker() {
	return await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		aspect: [4, 3],
		quality: 1,
	});
}
