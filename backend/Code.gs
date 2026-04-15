function doPost(e) {
  try {
    // Parse incoming JSON data. We expect the frontend to send POST request
    var data = JSON.parse(e.postData.contents);
    var employeeName = data.employeeName;
    var base64Data = data.fileBase64;
    var mimeType = data.mimeType;
    var fileName = data.fileName || (employeeName + "_" + new Date().getTime());

    // Remove the prefix (e.g. data:image/png;base64,) if present
    var dataParts = base64Data.split(',');
    var content = null;
    if (dataParts.length > 1) {
      content = dataParts[1];
    } else {
      content = dataParts[0];
    }

    var decodedData = Utilities.base64Decode(content);
    var blob = Utilities.newBlob(decodedData, mimeType, fileName);

    // Get or Create Drive Folder named "2026posters"
    var folderName = "2026posters";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // Create File in Google Drive
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();

    // Update Spreadsheet Count
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    var updated = false;
    
    // Assuming Column A is Employee Name, Column B is Count, Column C is Last Upload Date
    for (var i = 1; i < values.length; i++) {
        // match name (case-insensitive and trim spaces)
      if (values[i][0].toString().trim().toLowerCase() === employeeName.toString().trim().toLowerCase()) {
        var currentCount = values[i][1];
        if (!currentCount || isNaN(currentCount)) currentCount = 0;
        
        sheet.getRange(i + 1, 2).setValue(currentCount + 1);
        sheet.getRange(i + 1, 3).setValue(new Date());
        updated = true;
        break;
      }
    }

    if (!updated) {
      // If employee not found, append a new row
      sheet.appendRow([employeeName, 1, new Date()]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "File uploaded and count updated successfully.",
      url: fileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Needed to pass CORS policy from frontend for preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
