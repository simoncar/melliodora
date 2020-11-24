import * as firebase from "firebase";
import * as FileSystem from 'expo-file-system';

export function rebuildAlbum(featureID) {

	console.log("featureID rebuild:", featureID)
	var album = {}
	let i = 0;

	firebase
		.firestore()
		.collection(global.domain)
		.doc("feature")
		.collection("features")
		.doc(featureID)
		.collection("photos")
		.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				console.log("doc:", doc.data())
				album[i] = {
					"local": doc.data().local,
					"server": doc.data().server
				}
				i++

			})

			firebase
				.firestore()
				.collection(global.domain)
				.doc("feature")
				.collection("features")
				.doc(featureID)
				.set(
					{
						album: album
					}, { merge: true })
				.then(() => {
					console.log("Done updating album")
				})
		})

	storageSend(featureID)
}

export function storageSend(featureID) {

	console.log("storage send:", featureID)
	var album = []

	firebase
		.firestore()
		.collection(global.domain)
		.doc("feature")
		.collection("features")
		.doc(featureID)
		.collection("photos")
		.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				console.log("doc:", doc.data())
				album.push(doc.data().local)

				if (doc.data().server === undefined) {
					console.log("file not on server", doc.data().local)
					const imageURI = FileSystem.documentDirectory + doc.data().local
					uploadImage(featureID, imageURI, doc.data().local)
						.then((downloadURL) => {

							console.log("downloadURL:", downloadURL)
							firebase
								.firestore()
								.collection(global.domain)
								.doc("feature")
								.collection("features")
								.doc(featureID)
								.collection("photos")
								.doc(doc.id)
								.set(
									{
										server: downloadURL
									}, { merge: true })
								.then(() => {
									console.log("Done updating album")
								})
						})
				}
			})
		})
}

const uploadImage = async (feature: string, imgURI: string, filename: string) => {
	if (!imgURI) return "";

	var mime = "image/jpeg";

	const blob: any = await new Promise((resolve, reject) => {
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

	const ref = firebase.storage().ref("album/2020/11/" + feature + "/" + filename);

	const snapshot = await ref.put(blob, { contentType: mime, cacheControl: 'max-age=31536000' });
	const downloadURL = await snapshot.ref.getDownloadURL();
	blob.close();
	console.log("-----")
	console.log("XMLHttpRequest SEND:", imgURI, downloadURL)
	return downloadURL;
};