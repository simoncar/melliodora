import firebase from "../lib/firebase";
import uuid from "uuid";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export async function getPermissionAsync() {
	const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
	return status;
}

export const saveProfilePic = async (imgURI) => {
	if (!imgURI) return "";

	var mime = "image/jpeg";

	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", imgURI, true);
		xhr.send(null);
	});

	const ref = firebase.storage().ref("smartcommunity/profile").child(uuid.v4());
	console.log("sending to server")
	const snapshot = await ref.put(blob, { contentType: mime, cacheControl: 'max-age=31536000' });
	const downloadURL = await snapshot.ref.getDownloadURL();
	console.log("DURL:",downloadURL)
	blob.close();
	return downloadURL;
};

export async function launchProfileImagePicker() {
	return await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		allowsMultipleSelection:false,
		aspect: [4, 4],
		quality: 0,
	});
}
