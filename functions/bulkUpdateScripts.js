const admin = require("firebase-admin");
var response = "";
var i = 0;
var grade = -2;
var gradeTitle = "";
batchCount = 0;
var batch;
admin.initializeApp();

bulkAllocateTestData(batchCount);

function bulkAllocateTestData(batchCount) {
  var ClassCode = "";
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

        i++;
        grade++;
        if (grade > 12) {
          grade = -2;
        }

        classCode = getClassCode(grade, i);
        gradeTitle = getGradeTitle(grade, i);

        var dataDict = {
          grade: grade,
          gradeTitle: gradeTitle,
          class: classCode
        };

        // console.log(child.grade);
        // For each doc, add a delete operation to the batch
        if ((child.gradeTitle == undefined) & (batchCount < 500)) {
          //console.log("childA=", child);
          //console.log("childB=", child.grade);
          batchCount++;
          console.log("childC=", dataDict);
          batch.update(doc.ref, dataDict);
        }
        //response = response + "i" + i + ":" + doc.ref + "<br>";
        // console.log(response);
      });
      console.log("commit the batch + " + i + " response = " + response);
      batch.commit();
      return;
    })
    .then(function() {
      console.log("update complete ") + i;
      if (batchCount < 10) {
        //update(batchCount);
      }
    });

  response = response + "Batch = " + batch + "<br>Done3" + i;
  console.log(response);
}

function bulkDelete(batchCount) {
  admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .where("mac", ">", "47F906BDD6B6")
    .orderBy("mac", "asc")
    .limit(1)
    .get()
    .then(function(querySnapshot) {
      var batch = admin.firestore().batch();

      querySnapshot.forEach(function(doc) {
        i++;
        grade++;
        if (grade > 12) {
          grade = -2;
        }

        var dataDict = {
          grade: grade
        };
        // For each doc, add a delete operation to the batch
        batch.update(doc.ref);
        //response = response + "i" + i + ":" + doc.ref + "<br>";
        // console.log(response);
      });
      console.log("commit the batch + " + i + " response = " + response);
      batch.commit();
      return;
    })
    .then(function() {
      console.log("update complete ") + i;
      if (batchCount < 10) {
        update(batchCount);
      }
    });

  response = response + "Batch = " + batch + "<br>Done3" + i;
  console.log(response);
}

function getGradeTitle(grade, i) {
  var gradeTitle = "";
  switch (grade) {
    case -2:
      gradeTitle = "Nursery";
      break;
    case -1:
      gradeTitle = "KG 1";
      break;
    case 0:
      gradeTitle = "KG 2";
      break;

    default:
      gradeTitle = "Grade " + grade;
  }
  return gradeTitle;
}

function getClassCode(grade, i) {
  var teacherString = getTeacherString(i);
  var classCode = "";

  switch (grade) {
    case -2:
      classCode = "N-" + teacherString;
      gradeTitle = "Nursery";
      // code block
      break;

    case -1:
      classCode = "KG1-" + teacherString;
      gradeTitle = "KG 1";
      // code block
      break;
    case 0:
      classCode = "KG2-" + teacherString;
      gradeTitle = "KG 2";
      break;

    default:
      classCode = "G" + grade + "-" + teacherString;
      gradeTitle = "Grade " + grade;
    // code block
  }
  return classCode;
}

function getTeacherString(i) {
  var firstDigitstring = i.toString().substring(0, 1);
  var firstDigit = parseInt(firstDigitstring, 10);
  switch (firstDigit) {
    case 0:
      teacherString = "AAYW";
      break;
    case 1:
      teacherString = "BBEE";
      break;
    case 2:
      teacherString = "DDEF";
      break;
    case 3:
      teacherString = "EEFG";
      break;
    case 4:
      teacherString = "SSRW";
      break;
    case 5:
      teacherString = "WWJU";
      break;
    case 6:
      teacherString = "UUIU";
      break;
    case 7:
      teacherString = "FFGT";
      break;
    case 8:
      teacherString = "RRHD";
      break;
    case 9:
      teacherString = "SSAG";
      break;
    default:
      teacherString = "DSEF";
  }

  return teacherString;
}
