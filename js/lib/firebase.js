
import * as firebase from "firebase";
import { Constants } from 'expo';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions'
import ApiKeys from '../ApiKeys';

var switches = [];

class Firebase {

    static initialise() {

        if (!firebase.apps.length) {
            firebase.initializeApp(
                ApiKeys.FirebaseConfig
            );
        }

        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });


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

       // this.switches = firebase.database().ref('instance/' + Constants.manifest.extra.instance + '/switch');

       // console.log("global = " + global.switch_address)

       // loadFromRedux();
       // listenLoadFromFirebase(this.switches);

    }
};

function loadFromRedux() {

    dataSnapshot = (this.props.switchesX.items)
    key = '';

    for (var key in dataSnapshot) {

        if (!dataSnapshot.hasOwnProperty(key)) continue;

        var snapshot = dataSnapshot[key];

        global.switch_address = snapshot("address")
        global.switch_helpEmail = snapshot("helpEmail")
        global.switch_portalName = snapshot("portalName")

    }
}

function listenLoadFromFirebase(switches) {

    switches.on('value', (dataSnapshot2) => {
        this.props.setSwitches(dataSnapshot2)

        dataSnapshot = dataSnapshot2

        dataSnapshot.forEach((snapshot) => {

            global.switch_address = snapshot.child("address").val()
            global.switch_helpEmail = snapshot.child("helpEmail").val()
            global.switch_portalName = snapshot.child("portalName").val()

            this.setState({
                switches: switches
            });

            //this.state.items = [];
        });
    });
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch)
};

const mapStateToProps = state => ({
    switchesX: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Firebase);


