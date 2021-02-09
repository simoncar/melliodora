import firebase from "../lib/firebase";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import uuid from "uuid";
import { DomainEntity } from "./interfaces";
const globalAny: any = global;

export const saveSelectedImages = (items: MediaLibrary.Asset[], storyKey: string, domain: DomainEntity) => {
	return new Promise((resolve, reject) => {
		const promises = [];

		for (var key in items) {
			const filename: string = uuid.v4() + ".jpg";

			const pCopy = copyToLocal(items[key].uri, filename);
			promises.push(pCopy);
			const pSave = saveNewPhotoToFirebase(filename, storyKey, domain);
			promises.push(pSave);
		}

		Promise.all(promises)
			.then(() => {
				resolve("Saved Locally and to Firebase DB (BUT NOT to Storage yet)");
			})
			.catch((error) => {
				reject(Error("It broke " + error));
			});
	});
};

async function copyToLocal(uri: string, filename: string) {
	return new Promise((resolve, reject) => {
		FileSystem.copyAsync({ from: uri, to: FileSystem.documentDirectory + filename })
			.then(() => {
				resolve("copyToLocal end");
			})
			.catch((error) => {
				reject(Error("copyToLocal broke:" + error));
			});
	});
}

async function saveNewPhotoToFirebase(localFileName: string, storyKey: string, domain: DomainEntity) {
	var photo = {
		local: localFileName,
		timestamp: firebase.firestore.Timestamp.now(),
	};

	return firebase
		.firestore()
		.collection(domain.node)
		.doc("feature")
		.collection("features")
		.doc(storyKey)
		.collection("photos")
		.add(photo);
}

export async function storageSend(featureID: string, domain: DomainEntity) {
	return new Promise((resolve, reject) => {
		var album = [];
		const promises = [];

		firebase
			.firestore()
			.collection(domain.node)
			.doc("feature")
			.collection("features")
			.doc(featureID)
			.collection("photos")
			.get()
			.then((snapshot) => {
				snapshot.forEach(async (doc) => {
					album.push(doc.data().local);

					if (doc.data().server === undefined) {
						const imageURI = FileSystem.documentDirectory + doc.data().local;
						const p = uploadImage(featureID, imageURI, doc.data().local, doc.id, domain).then(
							(downloadURL) => {
								firebase
									.firestore()
									.collection(domain.node)
									.doc("feature")
									.collection("features")
									.doc(featureID)
									.collection("photos")
									.doc(doc.id)
									.set(
										{
											server: downloadURL,
										},
										{ merge: true }
									)
									.then(() => {
										console.log("Done updating storage send ");
									});
							}
						);
						promises.push(p);
					}
				});

				Promise.all(promises)
					.then(() => {
						resolve("Stuff worked!");
					})
					.catch((error) => {
						reject(Error("It broke " + error));
					});
			});
	});
}

const uploadImage = async (
	feature: string,
	imgURI: string,
	filename: string,
	photoDocId: string,
	domain: DomainEntity
) => {
	if (!imgURI) return "";
	console.log("commence upload....", imgURI);
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

	const snapshot = await ref.put(blob, {
		contentType: mime,
		cacheControl: "max-age=11536000",
		customMetadata: {
			feature: feature,
			domain: domain.node,
			uid: globalAny.uid,
			name: globalAny.name,
			email: globalAny.email,
			photoDocId: photoDocId,
		},
	});
	const downloadURL = await snapshot.ref.getDownloadURL();
	blob.close();
	console.log("XMLHttpRequest SEND:", imgURI, downloadURL);
	return downloadURL;
};

export function listenPhotos(domain: string, featureID: string, callbackRefreshFunction: any) {
	if (!featureID) {
		callbackRefreshFunction([]);
		return null;
	} else {
		const unsubscribe = firebase
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
					};

					photos.push(photo);
				});
				callbackRefreshFunction(photos);
			});

		return () => unsubscribe();
	}
}

export function deleteImage(domain: string, featureID: string, photoKey: string) {
	console.log("API delete photo", featureID, photoKey);

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
			console.log("photo deleted");
		});
}
