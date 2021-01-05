import firebase from "../lib/firebase";
import { UserEntity } from "../lib/interfaces";

interface IAuth {
	uid: string;
	displayName: string;
	photoURL: string;
	email: string;
}

export function Login(email: string, password: string) {
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((auth: firebase.auth.UserCredential) => {
			const authObj: IAuth = {
				uid: auth.user.uid,
				displayName: auth.user.displayName === null ? "" : auth.user.displayName,
				email: auth.user.email,
				photoURL: auth.user.photoURL === null ? "" : auth.user.photoURL,
			};
		})
		.catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === "auth/wrong-password") {
				//setErrorMessage("Wrong password.");
			} else {
				//setErrorMessage(errorMessage);
			}
			console.log(error);
		});
}

export function UpdateUser(user: UserEntity, setGDisplayName: any, setGPhotoURL: any) {
	//are you updating yourself?
	var loggedInUser = firebase.auth().currentUser;

	if (loggedInUser != null) {
		if (user.uid === loggedInUser.uid) {
			loggedInUser
				.updateProfile({
					displayName: user.displayName,
					photoURL: user.photoURL,
				})
				.then(function () {
					// Update successful.

					firebase.firestore().collection("users").doc(loggedInUser.uid).set(user, { merge: true });

					setGDisplayName(user.displayName);
					setGPhotoURL(user.photoURL);
				})
				.catch(function (error) {
					// An error happened.
					console.log("update failed", error);
				});
		}
	}

}
