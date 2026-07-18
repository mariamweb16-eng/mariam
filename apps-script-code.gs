/**
 * ============================================
 * Apps Script بتاع استقبال الملفات وحفظها في Drive
 * ============================================
 * الخطوات:
 * 1. غيّر MAIN_FOLDER_ID تحت بـ الـ ID بتاع الفولدر اللي عايز الملفات تتحفظ فيه
 * 2. اعمل Deploy كـ Web App (الشرح في الرسالة)
 */

var MAIN_FOLDER_ID = '1iZhGqfUj4b17_reC3OpwKne4eaqUxSo2';

function doPost(e) {
  try {
    var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);

    var data = JSON.parse(e.postData.contents);
    var category = data.category || 'Others'; // Images / Videos / VoiceNotes
    var fileName = data.fileName || ('file_' + new Date().getTime());
    var mimeType = data.mimeType || 'application/octet-stream';
    var base64Data = data.fileData;

    var subFolder = getOrCreateFolder(mainFolder, category);

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    var file = subFolder.createFile(blob);

    return jsonOutput({
      status: 'success',
      fileId: file.getId(),
      fileUrl: file.getUrl()
    });

  } catch (error) {
    return jsonOutput({
      status: 'error',
      message: error.toString()
    });
  }
}

function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parent.createFolder(name);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonOutput({ status: 'Server is running' });
}