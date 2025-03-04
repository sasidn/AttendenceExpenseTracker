function doGet() {
  return HtmlService.createHtmlOutputFromFile('expenseTracker');  
}
function getClassDates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ClassDetails");
  if (!sheet) {
    Logger.log("Error: Sheet 'ClassDetails' not found!");
    return [];
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data found in column B (Class Dates).");
    return [];
  }

  var data = sheet.getRange("B2:B" + lastRow).getValues().flat();
  Logger.log("Raw Data from Column B: " + data);

  var classDates = data.map(function(item) {
    if (item instanceof Date) { 
      // It's already a Date object, format it
      return Utilities.formatDate(item, Session.getScriptTimeZone(), "dd-MM-yyyy");
    } else {
      // Try to parse it as a date
      var parsedDate = new Date(item);
      if (!isNaN(parsedDate.getTime())) { 
        Logger.log("Parsed valid date: " + parsedDate);
        return Utilities.formatDate(parsedDate, Session.getScriptTimeZone(), "dd-MM-yyyy");
      } else {
        Logger.log("Still invalid date: " + item);
        return null;
      }
    }
  }).filter(Boolean); // Remove null values

  if (classDates.length === 0) {
    Logger.log("No valid dates found in ClassDetails!");
    return [];
  }

  Logger.log("Valid Class Dates: " + classDates);
  return classDates;
}

function submitExpenseData(classDate, details, spendAmount, creditDebit) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ExpenseData");

  // Generate the next ExpenseId
  var expenseId = getNextExpenseId();

  // Append the new data as a new row in the sheet
  sheet.appendRow([expenseId, classDate, details, spendAmount, creditDebit]);

  Logger.log('Expense added successfully');
}

// Function to generate the next ExpenseId
function getNextExpenseId() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ExpenseData");
  var data = sheet.getDataRange().getValues();
  
  // Get the last row and the last ExpenseId
  var lastRow = data.length;
  var lastExpenseId = lastRow > 1 ? data[lastRow - 1][0] : 0;  // Default to 0 if no data
  
  return lastExpenseId + 1; // Return the next ExpenseId
}



