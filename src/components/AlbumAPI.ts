import * as firebase from "firebase";



export function rebuildAlbum(featureID) {

	console.log("featureID rebuild:", featureID)
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
}