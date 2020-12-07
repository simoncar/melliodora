import * as firebase from "firebase";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import uuid from "uuid";
const globalAny: any = global;

async function copyToLocal(uri: string, filename: string) {
	console.log("copyToLocal start")
	FileSystem.copyAsync({ from: uri, to: FileSystem.documentDirectory + filename })
		.then(() => {
			console.log("copyToLocal end")
			return filename
		})
		.catch(error => {
			return ("error:" + error)
		})
}

async function saveNewPhoto(localFileName: string, storyKey: string) {
	console.log("saveNewPhoto start 1")
	var photo = {
		local: localFileName,
		timestamp: firebase.firestore.Timestamp.now(),
	};

	console.log("saveNewPhoto start 2:", globalAny.domain)
	console.log("saveNewPhoto start 2a:", storyKey)
	console.log("saveNewPhoto start 2b:", photo)

	firebase
		.firestore()
		.collection(global.domain)
		.doc("feature")
		.collection("features")
		.doc(storyKey)
		.collection("photos")
		.add(photo)
		.then(() => {
			console.log("saveNewPhoto end");
			return
		})
		.catch(error => {
			console.log("saveNewPhoto error:", error);
			return ("error:" + error)
		})
}

export function saveSelectedImages(items: MediaLibrary.Asset[], storyKey: string) {
	console.log("saveSelectedImages start:", storyKey);

	for (var key in items) {
		if (items.hasOwnProperty(key)) {
			const filename: string = uuid() + '.jpg'
			copyToLocal(items[key].uri, filename)
				.then(() => {
					saveNewPhoto(filename, storyKey)
						.then(() => {
							console.log("head off to storage send");

							storageSend(storyKey)
						})
						.catch(error => {
							return ("error:" + error)
						})
				})
				.catch(error => {
					return ("error:" + error)
				})
		}
	}
}



export async function storageSend(featureID: string) {

	console.log("storage send:", featureID)
	var album = []
	const promises = []

	firebase
		.firestore()
		.collection(globalAny.domain)
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
					const p = uploadImage(featureID, imageURI, doc.data().local, doc.id)
						.then((downloadURL) => {

							console.log("downloadURL:", downloadURL)
							firebase
								.firestore()
								.collection(globalAny.domain)
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
									console.log("Done updating storage send ")
								})

						})
					console.log("Promise Push")
					promises.push(p)
				}
			})

			console.log("Promise All")
			Promise.all(promises)
				.then(() => {
					console.log("Firebase I - Updated all storage in photos collection")
				})
				.catch(error => {
					console.log("error :", error)
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
				domain: globalAny.domain,
				uid: globalAny.uid,
				name: globalAny.name,
				email: globalAny.email,
				photoDocId: photoDocId,
			}
		});
	const downloadURL = await snapshot.ref.getDownloadURL();
	blob.close();
	console.log("-----")
	console.log("XMLHttpRequest SEND:", imgURI, downloadURL)
	return downloadURL;
};


export function listenPhotos(featureID: string, callbackRefreshFunction: any) {

	if (!featureID) {
		callbackRefreshFunction([])
	} else {
		firebase
			.firestore()
			.collection(globalAny.domain)
			.doc("feature")
			.collection("features")
			.doc(featureID)
			.collection("photos")
			.onSnapshot(function (querySnapshot) {
				var photos = [];
				querySnapshot.forEach(function (doc) {
					const photo = {
						key: doc.id,
						local: doc.data().local,
						server: doc.data().server,
						thumb: doc.data().thumb,
						feature: featureID,
					}

					photos.push(photo);
				});
				callbackRefreshFunction(photos)
			});
	}
}


export function deleteImage(featureID: string, imageId: string) {
	console.log("API delete photo", featureID, featureID)

}