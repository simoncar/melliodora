
import * as firebase from "firebase";

class Firebase {

    /**
     * Initialises Firebase
     */
    static initialise() {
        firebase.initializeApp({
            apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi",
            authDomain: "calendar-app-57e88.firebaseapp.com",
            databaseURL: "https://calendar-app-57e88.firebaseio.com",
            storageBucket: "calendar-app-57e88.appspot.com"
        });
    }

}

module.exports = Firebase;
