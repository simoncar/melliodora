import React from "react";
import firebase from "./firebase";
import * as ImageManipulator from "expo-image-manipulator";
import _ from "lodash";
import uuid from "uuid";
import { MessageEntity, UserEntity } from "../lib/interfaces";
import { avatar } from "../components/Imgix";

export function getMessages(domain: string, language: string, chatroom: string, callback) {
	const unsubscribe = firebase
		.firestore()
		.collection(domain)
		.doc("chat")
		.collection("chatrooms")
		.doc(chatroom)
		.collection("messages")
		.orderBy("createdAt", "asc")
		//.where("translated", "==", true)
		.onSnapshot((snapshot) => {
			const messages: MessageEntity[] = [];
			snapshot.docChanges().forEach((change) => {
				if (change.type === "added") {
					const message: MessageEntity = getMessage(change.doc.data(), change.doc.id, language);
					messages.push(message);
					callback(message);
				}
			});
		});

	return () => unsubscribe();
}

export function getMessage(messageObj: any, id: string, language: string): MessageEntity {
	const message = [
		{
			_id: messageObj._id,
			createdAt: messageObj.createdAt,
			text: messageObj.text,
			user: {
				_id: messageObj.user._id,
				name: messageObj.user.name,
				avatar: avatar(messageObj.user.avatar),
			},
		},
	];

	return message;
}

export function addMessage(
	domain: string,
	language: string,
	chatroom: string,
	messages: MessageEntity[],
	auth: UserEntity
) {
	return new Promise((resolve, reject) => {
		const promises = [];

		for (let i = 0; i < messages.length; i++) {
			// if (undefined != messages[i].image && messages[i].image.length > 0) {
			// 	var uploadUrl = uploadImageAsync(messages[i], chatroom, messages[i].user);
			// } else {
			var messageDict = {
				_id: messages[i]._id,
				text: messages[i].text,
				textLanguage: language,
				chatroom: chatroom,
				chatroomTitle: chatroom,
				user: {
					_id: auth.uid,
					name: auth.displayName,
					email: auth.email,
					avatar: auth.photoURL,
				},
				createdAt: Date.now(),
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				system: false,
				//pushToken: pushToken,
			};

			const p1 = firebase
				.firestore()
				.collection(domain)
				.doc("chat")
				.collection("chatrooms")
				.doc(chatroom)
				.collection("messages")
				.add(messageDict);

			promises.push(p1);
			//}
		}

		Promise.all(promises)
			.then(() => {
				resolve("saved to db");
			})
			.catch((error) => {
				reject(Error("It broke " + error));
			});
	});
}

export class Backend extends React.Component {
	messageRef = null;

	constructor(props) {
		super(props);
		this.state = {
			chatroom: "",
			language: "",
		};
	}

	setLanguage(language) {
		this.language = language;
	}

	setDomain(domain) {
		this.domain = domain;
	}

	setUID(uid) {
		this.uid = uid;
	}
	aagetUid() {
		return this.uid;
	}

	setChatroom(chatroom, title) {
		this.state.chatroom = chatroom;
		this.state.title = title;
	}

	getLanguageMessage(message, language) {
		switch (language) {
			case "fr":
				return message.textFR;
			case "ko":
				return message.textKO;
			case "zh":
				return message.textZH;
			case "es":
				return message.textES;
			case "ja":
				return message.textJA;
			case "id":
				return message.textID;
			default:
				return message.textEN;
		}
	}

	loadMessages = async (callback) => {
		this.ref = firebase
			.firestore()
			.collection(this.domain)
			.doc("chat")
			.collection("chatrooms")
			.doc(this.state.chatroom)
			.collection("messages")
			.orderBy("timestamp")
			.where("translated", "==", true);

		this.unsubscribe = this.ref.onSnapshot((messages) => {
			messages.docChanges().forEach((change) => {
				if (change.type === "added") {
					const message = change.doc.data();

					if (message.textLanguage == this.language) {
						var mesageText = message.text;
					} else {
						var mesageText = this.getLanguageMessage(message, this.language);
					}
					callback({
						_id: message._id,

						text: mesageText,
						textEN: message.textEN,
						textFR: message.textFR,
						textJA: message.textJA,
						textKO: message.textKO,
						textZH: message.textZH,
						textES: message.textES,
						textID: message.textID,

						detectedSourceLanguage: message.detectedSourceLanguage,
						createdAt: new Date(message.timestamp),
						timestamp: new Date(message.timestamp),
						chatroom: this.state.chatroom,
						user: {
							_id: message.user._id,
							name: message.user.name,
							email: message.user.email,
						},
						uid: message.uid,
						image: message.image,
						video: message.video,
						system: message.system,
						quickReplies: message.quickReplies,
					});
				}
			});
		});
	};

	get uid() {
		return (firebase.auth().currentUser || {}).uid;
	}

	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
	}

	SendMessage(message) {
		if (undefined === global.pushToken) {
			global.pushToken = "";
		}
		if (!_.isString(this.language)) {
			this.language = "en";
		}

		for (let i = 0; i < message.length; i++) {
			if (undefined != message[i].image && message[i].image.length > 0) {
				var uploadUrl = uploadImageAsync(message[i], this.state.chatroom, message[i].user);
			} else {
				let user = message[i].user;
				user.name = user.name ? user.name : "";
				user.id = user.id ? user.id : "";
				var messageDict = {
					_id: message[i]._id,
					text: message[i].text,
					textLanguage: this.language,
					chatroom: this.state.chatroom,
					chatroomTitle: this.state.title ? this.state.title : this.state.chatroom,
					user: user,
					timestamp: Date.now(),
					system: false,
					pushToken: global.pushToken,
					uid: this.uid,
				};

				this.messageRef = firebase
					.firestore()
					.collection(this.domain)
					.doc("chat")
					.collection("chatrooms")
					.doc(this.state.chatroom)
					.collection("messages")
					.add(messageDict);
			}
		}
	}

	setMute(muteState) {
		if (_.isString(global.pushToken) && global.pushToken.length > 0) {
			if (_.isBoolean(muteState)) {
				var messageDict = {
					mute: muteState,
					pushToken: global.pushToken,
					timestamp: Date.now(),
					uid: this.uid,
					language: this.language,
				};
			} else {
				var messageDict = {
					pushToken: global.pushToken,
					timestamp: Date.now(),
					uid: this.uid,
					language: this.language,
				};
			}

			firebase
				.firestore()
				.collection(this.domain)
				.doc("chat")
				.collection("chatrooms")
				.doc(this.state.chatroom)
				.collection("notifications")
				.doc(global.safeToken)
				.set(messageDict, { merge: true });
		}
	}

	closeChat() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}
}

async function uploadImageAsync(message, chatroom, user) {
	// Why are we using XMLHttpRequest? See:
	// https://github.com/expo/expo/issues/2402#issuecomment-443726662

	var URLfile;
	var mime = "";
	var d = new Date();

	if (undefined == message.filename && message.playableDuration > 0) {
		message.filename = "image.MOV";
	} else if (undefined == message.filename && message.playableDuration == 0) {
		message.filename = "image.JPG";
	}

	var fileType = message.filename.split(".").pop().split(/\#|\?/)[0];
	var fileToUpload = "";
	fileType = fileType.toUpperCase();
	if (fileType == "JPG" || fileType == "HEIC" || fileType == "PNG") {
		const convertedImage = await new ImageManipulator.manipulateAsync(
			message.image,
			[{ resize: { height: 1000 } }],
			{
				compress: 0,
			}
		);
		fileToUpload = convertedImage.uri;
		mime = "image/jpeg";
	} else {
		fileToUpload = message.image;
		mime = "video/mp4";
	}

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

	const ref = firebase
		.storage()
		.ref("chatimage/" + chatroom + "/" + d.getUTCFullYear() + ("0" + (d.getMonth() + 1)).slice(-2))
		.child(uuid.v4());

	const snapshot = await ref
		.put(blob, { contentType: mime, cacheControl: "max-age=31536000" })
		.then((snapshot) => {
			return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
		})
		.then((downloadURL) => {
			URLfile = downloadURL;
			return downloadURL;
		})

		.catch((error) => {
			// Use to signal error if something goes wrong.
		});

	// We're done with the blob, close and release it
	blob.close();

	user.name = user.name ? user.name : "";
	user.id = user.id ? user.id : "";

	if (fileType == "JPG" || fileType == "HEIC" || fileType == "PNG") {
		var messageDict = {
			_id: message._id,
			translated: true,
			image: URLfile,
			chatroom: chatroom,
			user: user,
			timestamp: Date.now(),
			system: false,
			pushToken: global.pushToken,
		};
	} else {
		var messageDict = {
			_id: message._id,
			translated: true,
			video: URLfile,
			chatroom: chatroom,
			user: user,
			timestamp: Date.now(),
			system: false,
			pushToken: global.pushToken,
		};
	}

	firebase
		.firestore()
		.collection(this.domain)
		.doc("chat")
		.collection("chatrooms")
		.doc(chatroom)
		.collection("messages")
		.add(messageDict);
	return;
}

export default new Backend();
