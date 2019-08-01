const admin = require("firebase-admin");
admin.initializeApp();

var async = require("async");
var messageItem = {};
var userItem = {};
var messageArray = [];
async.series(
  [
    function loadData(step) {
      admin
        .firestore()
        .collection("sais_edu_sg")
        .doc("push")
        .collection("message")
        .where("state", "==", "pending")
        .get()
        .then(async function(messages) {
          messages.forEach(doc => {
            messageItem = doc.data();

            // 1 record for each grade
            console.log("message to process: ", messageItem);
            messageArray.push({
              messageItem,
            });
          });
          step();
        });
    },
    function createIndividualMessages(step) {
      // find all the parents for this grade and make them individual messages

      messageArray.forEach(doc => {
        admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("user")
          .collection("usernames")
          .where("grade", "array-contains", 12)
          .get()
          .then(async function(users) {
            users.forEach(docUser => {
              userItem = docUser.data();

              // 1 record for each parent

              var dataDict = {
                pushToken: userItem.id,
                text: messageItem.text,
                image: messageItem.image,
                from: messageItem.from,
                timestamp: Date.now(),
              };

              console.log("message this user : ", userItem, messageItem);
              let queueItem = admin
                .firestore()
                .collection("sais_edu_sg")
                .doc("push")
                .collection("queue")
                .add(dataDict);
            });
          });
      });
    },
  ],

  function(err) {
    if (err) {
      console.log("Error: " + err);
    }
  },
);
