const functions = require('firebase-functions');
const admin = require('firebase-admin');
var fetch = require('node-fetch')


admin.initializeApp(functions.config().firebase);

//send the push notification 
exports.sendPushNotification = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/3SHMU/{createdID}').onCreate((snap, context) => {

    const createdData = snap.val(); 
    console.log(createdData)
    console.log(createdData.user.name + ': ' + createdData.text)


    var messages = []

    //simon android
    

        
    messages.push({
        "to": "ExponentPushToken[0_rniBFtyWshjEYnkzcQXF]",
        "title": "3SHMU > " + createdData.user.name,
        "sound": "default",
        "body": createdData.text
    });

    // Android
    messages.push({
        "to": "ExponentPushToken[rXb2wQB9LjaLe3JlSarOsk]",
        "title": "3SHMU > " + createdData.user.name,
        "sound": "default",
        "body": createdData.text
    });

    //simon
    messages.push({
        "to": "ExponentPushToken[_fADI_E3xWnqNKWxZurGun]",
        "title": "3SHMU > " + createdData.user.name,
        "sound": "default",
        "body": createdData.text
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
