import React, { useState} from "react";
import * as firebase from "firebase";
import {useAuth} from "../lib/globalState";



interface IAuth {
	uid: string;
	displayName: string;
	photoURL: string;
	email: string;
}


export function Login(email, password) {
	const [refresh, setter, state, isUpdated] = useAuth();
	const [loading, setLoading] = useState(false);

		console.log("login:", email, password)
		//setLoading(true);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((auth: firebase.auth.UserCredential) => {
				//saveAuth(auth);

				const authObj: IAuth = {
					uid: auth.user.uid,
					displayName: auth.user.displayName === null ? "" : auth.user.displayName,
					email: auth.user.email,
					photoURL: auth.user.photoURL === null ? "" : auth.user.photoURL,
				};

				//setLoading(false);
				setLoading(false)
				//setter(JSON.stringify(authObj));

				//props.navigation.popToTop();
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
				//setLoading(false);
				console.log(error);
			});
	};

