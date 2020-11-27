import * as firebase from "firebase";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import uuid from "uuid";

export function saveSelectedImages(items: MediaLibrary.Asset[]) {


	for (var key in items) {
		if (items.hasOwnProperty(key)) {
			console.log(key + " -> " + items[key].uri);
		}
	}
	// //const cachedAsset = await MediaLibrary.createAssetAsync(asset[0].uri);
	// const filename = uuid() + '.jpg'
	// const promiseFS = FileSystem.copyAsync({ from: items[0].uri, to: FileSystem.documentDirectory + filename })
	// promiseFS.then((ret) => {

	// 	//1. save this to firebase 
	// 	var photo = {
	// 		local: filename,
	// 		timestamp: firebase.firestore.Timestamp.now(),
	// 	};

	// 	firebase
	// 		.firestore()
	// 		.collection(global.domain)
	// 		.doc("feature")
	// 		.collection("features")
	// 		.doc(storyKey)
	// 		.collection("photos")
	// 		.add(photo)
	// 		.then(() => {
	// 			rebuildAlbum(storyKey)
	// 		})

	// 	//2. upload file to storage

	// 	//3. reference the cloud version of the file if there is no local version

	// 	//4. Rebuild story array

	// })
}

export function rebuildAlbum(featureID: string) {

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
					"local": doc.data().local || "",
					"server": doc.data().server || "",
					"thumb": doc.data().thumb || ""
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

export async function storageSend(featureID) {

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
			snapshot.forEach(async doc => {
				album.push(doc.data().local)

				if (doc.data().server === undefined) {
					console.log("file not on server", doc.data().local)
					const imageURI = FileSystem.documentDirectory + doc.data().local
					await uploadImage(featureID, imageURI, doc.data().local, doc.id)
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

const uploadImage = async (feature: string, imgURI: string, filename: string, photoDocId: string) => {
	if (!imgURI) return "";
	console.log("commence upload....", imgURI)
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

	const snapshot = await ref.put(blob,
		{
			contentType: mime,
			cacheControl: 'max-age=11536000',
			customMetadata: {
				feature: feature,
				domain: global.domain,
				uid: global.uid,
				name: global.name,
				email: global.email,
				photoDocId: photoDocId,
			}
		});
	const downloadURL = await snapshot.ref.getDownloadURL();
	blob.close();
	console.log("-----")
	console.log("XMLHttpRequest SEND:", imgURI, downloadURL)
	return downloadURL;
};