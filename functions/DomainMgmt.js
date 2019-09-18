const functions = require("firebase-functions");
const admin = require("firebase-admin");
const GoogleSpreadsheet = require("google-spreadsheet");


exports.onCreateDomain = functions.firestore
  .document('domains/{domainID}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    console.log("domains onCreate", newValue);

    // access a particular field as you would any JS property
    //const name = newValue.name;

    // perform desired operations ...

    admin
      .firestore()
      .collection(newValue.node)
      .doc(newValue.name)
      .set({
        nameAlias: newValue.nameAlias
      });
  });

// get all Accounts
const getDomains = async () => {
  let domainData = [];


  let snapshot = await admin
    .firestore()
    .collection("domains")
    .get();

  if (snapshot.empty) {
    console.log("No domains");
    return;
  }
  snapshot.forEach(doc => {
    dataItem = doc.data();
    console.log("dataItem", dataItem);
    domainData.push(dataItem);
  });

  console.log("domainData", domainData);
  return domainData;

};

exports.populateDomainMgmt = functions.https.onRequest((req, res) => {

  const {
    minRow,
    maxRow,
    minCol,
    maxCol
  } = req.body;
  var async = require("async");
  var doc = new GoogleSpreadsheet("1lGYbmoyUn-BJgxR0DNrvSd-nYt4TE8cyjUoh7NR8VAo");
  var sheet;
  var dataDictUpdate = [];

  console.log("start populateDomainMgmt");

  async.series(
    [
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require("./Calendar App-915d5dbe4185.json");
        doc.useServiceAccountAuth(creds, step);
        console.log(step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function (err, info) {
          console.log("err", err);

          console.log("Loaded doc: " + info.title + " by " + info.author.email);
          sheet = info.worksheets[1];
          console.log("sheet 2: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
          step();
        });
      },

      function loadData(step) {
        getDomains().then(domainData => {
          dataDictUpdate = domainData;
          console.log("dataDictUpdate", dataDictUpdate);

          step();
        });
      },

      function resizeSheetRigthSize(step) {
        sheet.resize({
          rowCount: dataDictUpdate.length + minRow,
          colCount: 20
        }, function (err) {
          step();
        }); //async
      },
      function workingWithCells(step) {
        let rows = dataDictUpdate.length;
        sheet.getCells({
          "min-row": minRow,
          "max-row": rows + minRow,
          "min-col": minCol,
          "max-col": 3,
          "return-empty": true,
        },
          function (err, cells) {
            let rowDataIndex = 0;
            for (var i = 0; i < cells.length; i = i + 3) {
              let rowData = dataDictUpdate[rowDataIndex];
              if (!rowData) break;
              cells[i].value = rowData.name;
              cells[i + 1].value = rowData.node;
              cells[i + 2].value = rowData.nameAlias;
              rowDataIndex++;
            }
            sheet.bulkUpdateCells(cells, () => step());
          },
        );
      },
      function done(step) {
        res.send("done - populateDomainMgmt ");
        step();
      }
    ],
    function (err) {
      if (err) {
        console.log("Error: " + err);
      }
    },
  );
});

exports.createDomain = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const {
    row
  } = req.body;
  console.log({
    row
  });

  var async = require("async");
  var doc = new GoogleSpreadsheet("1lGYbmoyUn-BJgxR0DNrvSd-nYt4TE8cyjUoh7NR8VAo");
  var sheet;

  console.log("start createDomain");

  async.series(
    [
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require("./Calendar App-915d5dbe4185.json");
        doc.useServiceAccountAuth(creds, step);
        console.log(step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function (err, info) {
          // console.log("info", info);
          sheet = info.worksheets[1];
          console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
          step();
        });
      },
      function workingWithCells(step) {
        sheet.getCells({
          "min-row": row,
          "max-row": row,
          "min-col": 1,
          "max-col": 5,
          "return-empty": true
        },
          async function (err, cells) {
            const domainName = cells[0].value;
            const domainNode = cells[1].value;
            const domainNameAliasArr = cells[2].value.split(",");

            console.log({
              name: domainName,
              node: domainNode,
              nameAlias: domainNameAliasArr
            });
            const domainRef = admin.firestore().collection("domains").doc(domainNode);
            const domainExist = await domainRef.get()
              .then(async (docSnapshot) => {
                if (docSnapshot.exists) {
                  return true;
                } else {
                  return false;
                }
              });
            console.log("domainExist", domainExist);
            if (domainExist) {
              await admin
                .firestore()
                .collection("domains")
                .doc(domainNode)
                .set({
                  name: domainName,
                  nameAlias: domainNameAliasArr
                })
                .catch(function (error) {
                  console.error("Error adding document: ", error);
                });
            } else {
              await admin
                .firestore()
                .collection("domains")
                .doc(domainNode)
                .set({
                  name: domainName,
                  node: domainNode,
                  nameAlias: domainNameAliasArr
                })
                .catch(function (error) {
                  console.error("Error adding document: ", error);
                });
            }


            res.send("Create Domain Completed");
            step();
          },
        );
      },
    ],
    function (err) {
      if (err) {
        console.log("Error: " + err);
      }
    },
  );

  console.log("done - createDomain ");
});

exports.deleteDomain = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const {
    row
  } = req.body;
  console.log({
    row
  });

  var async = require("async");
  var doc = new GoogleSpreadsheet("1lGYbmoyUn-BJgxR0DNrvSd-nYt4TE8cyjUoh7NR8VAo");
  var sheet;

  console.log("start deleteDomain");

  async.series(
    [
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require("./Calendar App-915d5dbe4185.json");
        doc.useServiceAccountAuth(creds, step);
        console.log(step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function (err, info) {
          // console.log("info", info);
          sheet = info.worksheets[1];
          console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
          step();
        });
      },
      function workingWithCells(step) {
        sheet.getCells({
          "min-row": row,
          "max-row": row,
          "min-col": 1,
          "max-col": 5,
          "return-empty": true
        },
          async function (err, cells) {
            const domainName = cells[0].value;
            const domainNode = cells[1].value;

            console.log({
              name: domainName,
              node: domainNode,
            });

            await admin
              .firestore()
              .collection("domains").doc(domainNode).delete().then(function () {
                console.log("Document successfully deleted!");
              }).catch(function (error) {
                console.error("Error removing document: ", error);
              });


            res.send("Delete Domain Completed");
            step();
          },
        );
      },
    ],
    function (err) {
      if (err) {
        console.log("Error: " + err);
      }
    },
  );

  console.log("done - deleteDomain ");
});