const functions = require("firebase-functions");
const admin = require("firebase-admin");
const GoogleSpreadsheet = require("google-spreadsheet");

// get all Accounts
const getAccounts = async () => {
  let acctData = []
  let listUsersResult = await admin.auth().listUsers(1000);
  listUsersResult.users.forEach(function (userRecord) {
    const { uid = "", email = "", customClaims = {}, providerData } = userRecord;
    if (providerData.length > 0) {
      acctData.push({ uid, email, customClaims, providerData });
    }
  });
  while (listUsersResult.pageToken) {
    listUsersResult = await admin.auth().listUsers(1000, listUsersResult.pageToken);
    listUsersResult.users.forEach(function (userRecord) {
      const { uid = "", email = "", customClaims = {}, providerData } = userRecord;
      if (providerData.length > 0) {
        acctData.push({ uid, email, customClaims, providerData });
      }
    });
  }
  console.log("acctData", acctData);
  return acctData;
}

exports.populateUserClaimMgmt = functions.https.onRequest((req, res) => {

  const { minRow, maxRow, minCol, maxCol } = req.body;
  var async = require("async");
  var doc = new GoogleSpreadsheet("1lGYbmoyUn-BJgxR0DNrvSd-nYt4TE8cyjUoh7NR8VAo");
  var sheet;
  var dataDictUpdate = [];

  const claimKeys = [];
  const claimColStart = 4;


  console.log("start populateUserClaimMgmt");

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
          console.log(err);

          console.log("Loaded doc: " + info.title + " by " + info.author.email);
          sheet = info.worksheets[0];
          console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
          step();
        });
      },

      function loadData(step) {
        getAccounts().then(acctData => {
          dataDictUpdate = acctData;
          step();
        });
      },

      function resizeSheetRigthSize(step) {
        const _maxCol = maxCol > 20 ? maxCol : 20;
        sheet.resize({ rowCount: dataDictUpdate.length + minRow, colCount: _maxCol }, function (err) {
          step();
        }); //async
      },

      function getClaimKeys(step) {
        sheet.getCells(
          {
            "min-row": minRow - 1,
            "max-row": minRow - 1,
            "min-col": claimColStart,
            "max-col": maxCol,
            "return-empty": true
          },
          function (err, cells) {
            for (let k = 0; k < cells.length; k++) {
              const cell = cells[k]
              if (cell.value) {
                claimKeys.push(cell.value);
              }
            }
            console.log("claimKeys", claimKeys);
            step();
          },
        );
      },
      function workingWithCells(step) {
        let rows = dataDictUpdate.length;
        sheet.getCells(
          {
            "min-row": minRow,
            "max-row": rows + minRow,
            "min-col": minCol,
            "max-col": maxCol,
            "return-empty": true,
          },
          function (err, cells) {
            let rowDataIndex = 0;
            for (var i = 0; i < cells.length; i = i + maxCol) {
              let rowData = dataDictUpdate[rowDataIndex];
              if (!rowData) break;
              cells[i].value = "" + rowData.uid;
              cells[i + 1].value = "" + rowData.email;

              for (let j = claimColStart; j <= maxCol; j++) {
                const cell = cells[i + j - 1];
                const key = claimKeys[j - claimColStart];
                const claim = rowData.customClaims[key];
                if (claim) cell.value = claim;
              }
              rowDataIndex++;
            }
            sheet.bulkUpdateCells(cells, () => step());
          },
        );
      },
      function done(step) {
        console.log("done - populateUserClaimMgmt ");
        res.send("done - populateUserClaimMgmt ");
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



const updateUserClaims = async (UID, claims) => {
  if (!UID || claims.constructor !== Object) return;
  for (var key in claims) {

    if (!claims[key] === true) {
      delete claims[key]
    }
  }
  const user = await admin.auth().getUser(UID);
  console.log("Update claims of", user.uid);
  const claimsSet = await admin.auth().setCustomUserClaims(user.uid, claims);
  return claimsSet;
};

exports.writeUserClaims = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const { minRow, maxRow, minCol, maxCol } = req.body;
  console.log({ minRow, maxRow, minCol, maxCol });

  var async = require("async");
  var doc = new GoogleSpreadsheet("1lGYbmoyUn-BJgxR0DNrvSd-nYt4TE8cyjUoh7NR8VAo");
  var sheet;
  const claimKeys = [];
  const claimColStart = 4;

  console.log("start writeUserClaims");

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
          sheet = info.worksheets[0];
          console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
          step();
        });
      },

      function getClaimKeys(step) {
        sheet.getCells(
          {
            "min-row": minRow - 1,
            "max-row": minRow - 1,
            "min-col": claimColStart,
            "max-col": maxCol,
            "return-empty": true
          },
          function (err, cells) {
            for (let k = 0; k < cells.length; k++) {
              const cell = cells[k]
              if (cell.value) {
                claimKeys.push(cell.value);
              }
            }
            console.log("claimKeys", claimKeys);
            step();
          },
        );
      },
      function workingWithCells(step) {
        sheet.getCells(
          {
            "min-row": minRow,
            "max-row": maxRow,
            "min-col": minCol,
            "max-col": maxCol,
            "return-empty": true
          },
          async function (err, cells) {
            console.log("cells", cells);

            for (var i = 0; i < cells.length; i = i + maxCol) {
              let cell = cells[i];
              const UID = cell.value;
              console.log('Cell R' + cell.row + 'C' + cell.col + ' = ' + cell.value);

              const claims = {};
              for (let j = claimColStart; j <= maxCol; j++) {
                cell = cells[i + j - 1];
                const key = claimKeys[j - claimColStart];
                claims[key] = cell.value === "TRUE";
              }
              console.log(UID, JSON.stringify(claims));
              await updateUserClaims(UID, claims);
            }

            res.send("Update Claims Completed");
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

  console.log("done - writeUserClaims ");
});