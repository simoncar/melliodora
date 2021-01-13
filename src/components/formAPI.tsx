import firebase from "../lib/firebase";

export function SaveFeature(domain: string, dict) {
	const { _key, summary, description, order, photo1, showIconChat, visible, date_start } = dict;

	const storyDict = {
		summary: summary || "Title",
		summaryEN: summary || "Title",
		description: description || "Description",
		descriptionEN: description || "Description",
		order: order !== undefined ? Number(order) : 1,
		showIconChat: showIconChat,
		visible: visible,
		translated: false,
		photo1: photo1,
		dateTimeStart: null,
		dateTimeEnd: null,
		date_start: date_start != undefined ? date_start : "",
	};

	if (_key == "") {
		firebase.firestore().collection(domain).doc("feature").collection("features").add(storyDict);
		// .then(() => navigation.goBack());
	} else {
		const storyRef = firebase.firestore().collection(domain).doc("feature").collection("features").doc(_key);

		storyRef.set(storyDict, { merge: true });
	}

	return;
}

export function DeleteFeature(domain, _key, handler) {
	if (_key) {
		firebase
			.firestore()
			.collection(domain)
			.doc("feature")
			.collection("features")
			.doc(_key)
			.delete()
			.then(() => handler);
	}

	return;
}
