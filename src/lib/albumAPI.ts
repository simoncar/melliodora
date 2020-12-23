import * as firebase from "firebase";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import uuid from "uuid";
const globalAny: any = global;

export const saveSelectedImages = (items: MediaLibrary.Asset[], storyKey: string) => {
	return new Promise((resolve, reject) => {
		const promises = []

		for (var key in items) {
			if (items.hasOwnProperty(key)) {

				const filename: string = uuid() + '.jpg'

				const pCopy = copyToLocal(items[key].uri, filename)
				promises.push(pCopy)
				const pSave = saveNewPhotoToFirebase(filename, storyKey)
				promises.push(pSave)
			}
		}

		console.log("Promise All - storageSend")
		Promise.all(promises)
			.then(() => {
				resolve("Saved Locally and to Firebase DB (BUT NOT to Storage yet)");
			})
			.catch(error => {
				reject(Error("It broke " + error));
			})
	});
};


async function copyToLocal(uri: string, filename: string) {
	return new Promise((resolve, reject) => {
		console.log("copyToLocal start :", filename)
		FileSystem.copyAsync({ from: uri, to: FileSystem.documentDirectory + filename })
			.then(() => {
				console.log("copyToLocal [promise ] resolve : ", filename)
				resolve("copyToLocal end");
			})
			.catch(error => {
				console.log("copyToLocal [promise ] resolve : ", filename)
				reject(Error("copyToLocal broke:" + error));
			})
		console.log("copyToLocal end :", filename)
	});
}

async function saveNewPhotoToFirebase(localFileName: string, storyKey: string) {
	console.log("saveNewPhoto start 1")
	var photo = {
		local: localFileName,
		timestamp: firebase.firestore.Timestamp.now(),
	};

	console.log("saveNewPhoto start 2:", globalAny.domain)
	console.log("saveNewPhoto start 2a:", storyKey)
	console.log("saveNewPhoto start 2b:", photo)

	return firebase
		.firestore()
		.collection(global.domain)
		.doc("feature")
		.collection("features")
		.doc(storyKey)
		.collection("photos")
		.add(photo)
}

export async function storageSend(featureID: string) {
	return new Promise((resolve, reject) => {
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
						console.log("Promise Push - storageSend")
						promises.push(p)
					}
				})

				console.log("Promise All - storageSend")
				Promise.all(promises)
					.then(() => {
						resolve("Stuff worked!");
					})
					.catch(error => {
						reject(Error("It broke " + error));
					})
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
			reject(new TypeError("Network request failed:"));
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


export function listenPhotos(domain:string,featureID: string, callbackRefreshFunction: any) {

	if (!featureID) {
		callbackRefreshFunction([])
	} else {
		firebase
			.firestore()
			.collection(domain)
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


export function deleteImage(domain:string,featureID: string, photoKey: string) {
	console.log("API delete photo", featureID, photoKey)

	firebase
		.firestore()
		.collection(domain)
		.doc("feature")
		.collection("features")
		.doc(featureID)
		.collection("photos")
		.doc(photoKey)
		.delete()
		.then(() => {
			console.log("photo deleted")
		})

}