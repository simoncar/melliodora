const functions = require("firebase-functions");
const admin = require("firebase-admin");
const GoogleSpreadsheet = require("google-spreadsheet");


exports.createDomain = functions.firestore
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
const getDomains = async() => {
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
                doc.getInfo(function(err, info) {
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
                }, function(err) {
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
                    function(err, cells) {
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
        function(err) {
            if (err) {
                console.log("Error: " + err);
            }
        },
    );
});



const updateUserClaims = async(UID, claims) => {
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
    const {
        minRow,
        maxRow,
        minCol,
        maxCol
    } = req.body;
    console.log({
        minRow,
        maxRow,
        minCol,
        maxCol
    });

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
                doc.getInfo(function(err, info) {
                    // console.log("info", info);
                    sheet = info.worksheets[0];
                    console.log("sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount);
                    step();
                });
            },

            function getClaimKeys(step) {
                sheet.getCells({
                        "min-row": minRow - 1,
                        "max-row": minRow - 1,
                        "min-col": claimColStart,
                        "max-col": maxCol,
                        "return-empty": true
                    },
                    function(err, cells) {
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
                sheet.getCells({
                        "min-row": minRow,
                        "max-row": maxRow,
                        "min-col": minCol,
                        "max-col": maxCol,
                        "return-empty": true
                    },
                    async function(err, cells) {
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
        function(err) {
            if (err) {
                console.log("Error: " + err);
            }
        },
    );

    console.log("done - writeUserClaims ");
});