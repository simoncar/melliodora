const functions = require('firebase-functions');
const admin = require('firebase-admin');
var fetch = require('node-fetch')


admin.initializeApp(functions.config().firebase);

//send the push notification 
exports.sendPushNotification = functions.database.ref('contacts/').onCreate((snap, context) => {

    const createdData = snap.val(); 



    var messages = []

    messages.push({
        "to": "ExponentPushToken[_fADI_E3xWnqNKWxZurGun]",
        "sound": "default",
        "body": "Simon says: Put your hands on your head"
    });

    //return the main promise 
  
        
    
        return Promise.all(messages)

        .then(messages => {
            // console.log(messages)
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages)

            });
        })
        .catch(reason => {
            console.log(reason)
        })


});
