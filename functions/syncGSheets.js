const admin = require("firebase-admin");
var GoogleSpreadsheet = require("google-spreadsheet");

admin.initializeApp();

//writeFile();

var async = require("async");

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet("1BxmVcXAA47rtcKgWE-cb9B6n-8dfmfsRybHSCPKkmkc");
var sheet;

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
        console.log(
          "sheet 1: " +
            sheet.title +
            " " +
            sheet.rowCount +
            "x" +
            sheet.colCount
        );
        step();
      });
    },
    function workingWithRows(step) {
      // google provides some query options
      sheet.getRows(
        {
          offset: 1,
          limit: 20,
          orderby: "col2"
        },
        function(err, rows) {
          console.log("Read " + rows.length + " rows");

          // the row is an object with keys set by the column headers
          //rows[0].colname = "new val";
          //rows[0].save(); // this is async

          // deleting a row
          //rows[0].del(); // this is async

          step();
        }
      );
    },
    function workingWithCells(step) {
      var n = 2;

      for (var i = 2; i < 45; i++) {
        console.log(n, n + 100);
        updateCells(n, n + 100);
        n = n + 101;
      }

      step();
    },
    function managingSheets(step) {
      //   doc.addWorksheet(
      //     {
      //       title: "my new sheet"
      //     },
      //     function(err, sheet) {
      //       // change a sheet's title
      //       sheet.setTitle("new title"); //async
      //       //resize a sheet
      //       sheet.resize({ rowCount: 50, colCount: 20 }); //async
      //       sheet.setHeaderRow(["name", "age", "phone"]); //async
      //       // removing a worksheet
      //       sheet.del(); //async
      //       step();
      //     }
      //   );
    }
  ],
  function(err) {
    if (err) {
      console.log("Error: " + err);
    }
  }
);

function updateCells(start, end) {
  var firstName = "";
  var lastName = "";
  var fullname = "";
  var studentNo = "";
  var beacon = "";
  var email = "";

  sheet.getCells(
    {
      "min-row": start,
      "max-row": end,
      "min-col": 1,
      "max-col": 10,
      "return-empty": true
    },
    function(err, cells) {
      if (undefined == cells) {
        return;
      }
      var arrayLength = cells.length;

      var batch = admin.firestore().batch();
      for (var i = 0; i < arrayLength; i++) {
        //console.log(cells[i]);
        var cell = cells[i];

        switch (cell.col) {
          case 1:
            beacon = cell.value;

          case 2:
            studentNo = cell.value;
            break;
          case 3:
            firstName = cell.value;
            break;
          case 4:
            lastName = cell.value;
            break;
          case 5:
            email = cell.value;
            break;
          case 6:
            var grade = cell.value;
            break;
          case 7:
            var gradeTitle = cell.value;
            break;
          case 10:
            var classCode = cell.value;
            break;
        }

        var dataDict = {
          firstName: firstName,
          lastName: lastName,
          fullname: firstName + " " + lastName,
          email: email,
          studentNo: studentNo,
          class: classCode,
          grade: grade,
          gradeTitle: gradeTitle
        };

        if (cell.col == 10) {
          let ref = admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(beacon);

          batch.update(ref, dataDict);
        }
      }

      batch.commit();

      //
    }
  );
}

function writeFile() {
  const fs = require("fs");
  var sF = "";
  admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .get()
    .then(function(querySnapshot) {
      var batch = admin.firestore().batch();

      querySnapshot.forEach(function(doc) {
        child = doc.data();
        sF = sF + "\n" + child.mac;
      });

      fs.writeFile("/tmp/test.txt", sF, function(err) {
        if (err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });
    });
}
