function doGet() {
  return HtmlService.createHtmlOutputFromFile('expenseTracker');  // This will serve the expenseTracker.html page
}
function getClassDates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ClassDetails");
  if (!sheet) return [];

  var data = sheet.getRange("B2:B").getValues(); // Assuming class dates are in column B from row 2
  var classDates = data.flat().filter(date => date instanceof Date); // Filter valid dates

  if (classDates.length === 0) return [];

  // Sort dates in ascending order (optional: adjust as per your needs)
  classDates.sort((a, b) => a - b);

  // Return class dates in 'dd-MM-yyyy' format
  return classDates.map(function(date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd-MM-yyyy");
  });
}
function submitExpenseData(classDate, details, spendAmount) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expense");

  // Generate next ExpenseId
  var expenseId = getNextExpenseId();
  
  // Append the new data as a new row in the sheet
  sheet.appendRow([expenseId, classDate, details, spendAmount]);
}

// Function to generate the next ExpenseId
function getNextExpenseId() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expense");
  var data = sheet.getDataRange().getValues();
  
  // Get the last row, and the last ExpenseId
  var lastRow = data.length;
  var lastExpenseId = lastRow > 1 ? data[lastRow - 1][0] : 0;  // Default to 0 if no data
  
  return lastExpenseId + 1; // Return the next ExpenseId
}
function submitExpenseData(classDate, details, spendAmount) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expense");

  // Log the data being passed to the function
  Logger.log('classDate: ' + classDate + ', details: ' + details + ', spendAmount: ' + spendAmount);

  // Generate next ExpenseId
  var expenseId = getNextExpenseId();
  
  // Append the new data as a new row in the sheet
  sheet.appendRow([expenseId, classDate, details, spendAmount]);

  // Log success
  Logger.log('Expense added: ' + expenseId);
}