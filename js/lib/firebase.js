import * as firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../actions";
import ApiKeys from "../ApiKeys";

class Firebase {
  static initialise() {
    try {
      if (!firebase.apps.length) {
        console.log("firebase initialised");
        firebase.initializeApp(ApiKeys.FirebaseConfig);
      }

      firebase
        .auth()
        .signInAnonymously()
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
    try {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          // ...
        } else {
          // User is signed out.
          // ...
        }
        // ...
      });
    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  switchesX: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Firebase);
