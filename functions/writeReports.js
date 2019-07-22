const admin = require("firebase-admin");
var GoogleSpreadsheet = require("google-spreadsheet");

admin.initializeApp();

//writeFile();

//  /Users/simon/Documents/code/app/functions/Calendar App-915d5dbe4185.json
//export GOOGLE_APPLICATION_CREDENTIALS="/Users/simon/Documents/code/app/functions/Calendar App-915d5dbe4185.json"
var async = require("async");

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet("19_fEifKOk22uLx-v49CDcMxdGPFObYoC_z3yzmnOBpU");
var sheet;
var dataDictUpdate = [];

async.series(
  [
    function setAuth(step) {
      // see notes below for authentication instructions!
      var creds = require("./Calendar App-915d5dbe4185.json");
      doc.useServiceAccountAuth(creds, step);
      console.log(step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        console.log(err);

        console.log("Loaded doc: " + info.title + " by " + info.author.email);
        sheet = info.worksheets[0];
        console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
        step();
      });
    },

    function loadData(step) {
      admin
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beacons")
        .orderBy("mac")
        .limit(7)
        .get()
        .then(async function(documentSnapshotArray) {
          documentSnapshotArray.forEach(doc => {
            item = doc.data();
            dataDictUpdate.push({
              beaconID: item.mac,
              studentID: item.studentNo,
              firstName: item.firstName,
              lastName: item.lastName,
            });
          });
          step();
        });
    },

    function resizeSheetRigthSize(step) {
      sheet.resize({ rowCount: dataDictUpdate.length + 1, colCount: 20 }, function(err) {
        step();
      }); //async
    },

    function workingWithCells(step) {
      //dataDictUpdate = loadData(dataDictUpdate);
      console.log("dataDictUpdate=", dataDictUpdate.length);
      var cols = 5;
      sheet.getCells(
        {
          "min-row": 2,
          "max-row": dataDictUpdate.length + 1,
          "min-col": 1,
          "max-col": cols,
          "return-empty": true,
        },
        function(err, cells) {
          var startBlock = 0;
          dataDictUpdate.forEach(doc => {
            for (var i = startBlock * cols; i < startBlock * cols + cols; i++) {
              var cell = cells[i];
              switch (cell.col) {
                case 1:
                  cell.value = doc.beaconID;
                  break;
                case 2:
                  cell.value = doc.studentID;
                  break;
                case 3:
                  cell.value = doc.firstName;
                  break;
                case 4:
                  cell.value = doc.lastName;
                  break;
              }
            }
            startBlock++;
          });
          sheet.bulkUpdateCells(cells); //async

          step();
        },
      );
    },
  ],
  function(err) {
    if (err) {
      console.log("Error: " + err);
    }
  },
);
