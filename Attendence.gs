function doGet() {
  return HtmlService.createHtmlOutputFromFile("attendenceTracker");
}

function getLatestClassDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ClassDetails");
  if (!sheet) {
    Logger.log("Sheet 'ClassDetails' not found!");
  return "";
  }

  var lastRow = sheet.getRange("B:B").getValues().filter(String).length; 
  var data = sheet.getRange("B2:B" + lastRow).getValues();

  Logger.log("Raw Data from B2:B: " + JSON.stringify(data));
  // Convert to valid dates
  var classDates = data.flat().map(date => {
    return (date instanceof Date) ? date : new Date(date);
  }).filter(date => !isNaN(date)); // Remove invalid dates
  
  Logger.log("Filtered Dates: " + JSON.stringify(classDates));

  if (classDates.length === 0) {
    Logger.log("No valid dates found!");
    return "";
  }

  // Sort dates in descending order
  classDates.sort((a, b) => b - a);

  var latestDate = Utilities.formatDate(classDates[0], Session.getScriptTimeZone(), "MM-dd-yyyy");
  
  Logger.log('Latest Class Date: ' + latestDate); // Debugging log
  return  latestDate; // Return latest class date 
}


function getStudentNames() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RegisteredStudents");
  if (!sheet) return [];

  var studentData = sheet.getRange("B2:B").getValues(); // Assuming names are in column B from row 2
  return studentData.flat().filter(name => name); // Remove empty values
}

function feeCollected(latestDate, studentName) {
  // Open the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AttendenceData");

  // Get all the data from the sheet (assuming classDate is in column 1 and studentName is in column 2)
  var data = sheet.getDataRange().getValues(); 

  // Search for the matching classDate and studentName
  for (var i = 1; i < data.length; i++) { // start from 1 if there is a header row
    if (data[i][0] == latestDate && data[i][1] == studentName) {
      var fee = data[i][2];  // Assuming fees collected is in column 3
      return fee || 0;  // If fee is found, return it, otherwise return 0
    }
  }

  // If no match is found, return 0
  return 0;
}

function submitAttendance(latestDate, studentName, feesCollected) {

 //  var classDate = "03-01-2025";  // Example class date
 //  var studentName = "John Doe";  // Example student name
 //  var feesCollected = 100; 

  Logger.log("Received Parameters: latestDate = " + latestDate + ", studentName = " + studentName + ", feesCollected = " + feesCollected);


  if (!latestDate || !studentName) {
    Logger.log("Error: Class date and student name cannot be empty!");
    return "Error: Class date and student name cannot be empty!";
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AttendenceData");
  if (!sheet) {
    Logger.log("Error: Sheet 'AttendenceData' not found!");
    return "Error: Attendance data sheet not found!";
  }

  var data = sheet.getDataRange().getValues(); // Get all existing data
  Logger.log("Existing Attendance Data: " + JSON.stringify(data));

  Logger.log("Checking for duplicate entry...");
  for (var i = 1; i < data.length; i++) { // Skip header row
    Logger.log('Checking row ${i + 1}: [${data[i][0]}, ${data[i][1]}]');
    if (data[i][0] == latestDate && data[i][1] == studentName) {
      Logger.log("Duplicate Entry Found!");
      return "Error: Duplicate entry found!";
    }
  }

  Logger.log("No duplicate found, appending row...");
  sheet.appendRow([latestDate, studentName, feesCollected]);
  Logger.log("Success: Attendance recorded!");

  return "Success: Attendance recorded!";
}
