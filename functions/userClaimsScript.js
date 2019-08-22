// ** Currently not in use
// script is for https://docs.google.com/spreadsheets/d/1EysUcUI-0emDZeo24mGSlbXMwjBSGZeSNhswtPXv81o
// It is copied here for source control only


function getToken() {

    const userName = Session.getActiveUser().getEmail();
    const pwd = 'xyz' //For example get the password via a prompt. 
    //This is NOT the password of the account authenticated with Google Sheet, but the password of the Firebase user. In this example, the emails are the same but they are different accounts. 

    const verifyPasswordUrl = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw" //Replace with your Web API Key

    const payload = JSON.stringify({ "email": userName, "password": pwd, "returnSecureToken": true });

    const verifyPasswordResponse = UrlFetchApp.fetch(verifyPasswordUrl, {
        method: 'post',
        contentType: 'application/json',
        muteHttpExceptions: true,
        payload: payload
    });

    const token = JSON.parse(verifyPasswordResponse.getContentText()).idToken;
    return token;

}


var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheets()[0];

var startRow = 6
var ClaimValues = sheet.getRange(startRow - 1, 4, startRow - 1, sheet.getLastColumn()).getValues();
ClaimValues = ClaimValues[0].filter(function (e) { return e != "" });


function clear() {
    var maxRows = sheet.getLastRow();
    Logger.log(maxRows);
    if (maxRows > startRow - 1) {
        sheet.deleteRows(startRow, maxRows - startRow + 1);
    }
}


function callGetAcctsAPI() {
    const url = "https://us-central1-calendar-app-57e88.cloudfunctions.net/getAccounts";

    const response = UrlFetchApp.fetch(url, {
        method: 'get'
    })

    var respObj = JSON.parse(response.getContentText());

    return respObj;
}

function getAcct() {
    // clear existing records
    clear();

    // get data from API
    var respObj = callGetAcctsAPI();

    // populate sheet with data
    var data = [];

    var dataLength = respObj.length;
    for (var i = 0; i < respObj.length; i++) {
        var values = [respObj[i].uid, respObj[i].email, ""];
        for (var j = 0; j < ClaimValues.length; j++) {
            var key = ClaimValues[j];
            var val = respObj[i].customClaims[key];
            if (val) {
                values.push(val);
            } else {
                values.push("");
            }
        }
        data.push(values);
    }

    var sheetMaxRange = dataLength;
    var range = sheet.getRange(startRow, 1, sheetMaxRange, data[0].length);
    range.setValues(data);

    //set last updated datetime
    sheet.getRange("D1").setValue(new Date());
}


function updateClaims() {
    const url = "https://us-central1-calendar-app-57e88.cloudfunctions.net/updateUserClaims";
    const sheetValues = sheet.getRange(startRow, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

    for (var i = 0; i < sheetValues.length; i++) {

        var claims = {};
        for (var j = 0; j < ClaimValues.length; j++) {
            var key = ClaimValues[j];

            var claimValue = sheetValues[i][3 + j];
            if (claimValue) {
                claims[key] = claimValue;
            }
        }
        var UID = sheetValues[i][0];

        if (UID && Object.getOwnPropertyNames(claims).length > 0) {
            Logger.log(UID);
            var payload = { UID: sheetValues[i][0], claims: claims };
            response = UrlFetchApp.fetch(url, {
                'method': 'post',
                'contentType': 'application/json',
                // Convert the JavaScript object to a JSON string.
                'payload': JSON.stringify(payload)
            });
        }

    }
    Logger.log(sheetValues.length);
}
