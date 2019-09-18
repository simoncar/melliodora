const _ = require("lodash");
const moment = require("moment");

exports.gatewayStats = async function(admin) {
  const xdate = moment()
    .add(8, "hours")
    .format("YYYYMMDD");

  await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("gateways")
    .get()
    .then(async snapshot => {
      for (const doc of snapshot.docs) {
        gateway = doc.data();

        var dataDict = {
          mac: doc.id,
          cpu: messageInLanguage,
          memory: chatroomTitle,
          timestamp: Date.now(),
          connections: false,
        };

        await admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("beacon")
          .collection("gatewayHistory")
          .doc(xdate)
          .collection(gateway.mac)
          .doc(xDate.now())
          .add(dataDict);
      }
    });
};
