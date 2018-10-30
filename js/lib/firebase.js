
import * as firebase from "firebase";
import { Constants } from 'expo';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions'

var switches = [];

class Firebase {

    static initialise() {

        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi",
                authDomain: "calendar-app-57e88.firebaseapp.com",
                databaseURL: "https://calendar-app-57e88.firebaseio.com",
                storageBucket: "calendar-app-57e88.appspot.com"
            });
        }


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

        console.log("global = " + global.switch.address)

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
    console.log('bind action creators');
    return bindActionCreators(ActionCreators, dispatch)
};


const mapStateToProps = state => ({
    switchesX: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Firebase);


