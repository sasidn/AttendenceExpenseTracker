function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function getLatestClassDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ClassDetails");
  if (!sheet) return "";

  var data = sheet.getRange("B2:B").getValues(); // Assuming class dates are in column B from row 2
  var classDates = data.flat().filter(date => date instanceof Date); // Filter valid dates

  if (classDates.length === 0) return "";

  // Sort dates in descending order and return the latest one
  classDates.sort((a, b) => b - a);
  return Utilities.formatDate(classDates[0], Session.getScriptTimeZone(), "dd-MM-yyyy");
}

function getStudentNames() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RegisteredStudents");
  if (!sheet) return [];

  var studentData = sheet.getRange("B2:B").getValues(); // Assuming names are in column B from row 2
  return studentData.flat().filter(name => name); // Remove empty values
}

function feeCollected(classDate, studentName) {
  // Open the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AttendenceData");

  // Get all the data from the sheet (assuming classDate is in column 1 and studentName is in column 2)
  var data = sheet.getDataRange().getValues(); 

  // Search for the matching classDate and studentName
  for (var i = 1; i < data.length; i++) { // start from 1 if there is a header row
    if (data[i][0] == classDate && data[i][1] == studentName) {
      var fee = data[i][2];  // Assuming fees collected is in column 3
      return fee || 0;  // If fee is found, return it, otherwise return 0
    }
  }

  // If no match is found, return 0
  return 0;
}

function submitAttendance(classDate, studentName, feesCollected) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AttendenceData");
  var data = sheet.getDataRange().getValues(); // Get all existing data

  // Check for duplicates (ClassDate + StudentName)
  for (var i = 1; i < data.length; i++) { // start from 1 if there is a header row
    if (data[i][0] == classDate && data[i][1] == studentName) {
      return "Error: Duplicate entry found!";
    }
  }

  // If no duplicate, append new entry with feesCollected
  sheet.appendRow([classDate, studentName, feesCollected]);
  return "Success: Attendance recorded!";
}
