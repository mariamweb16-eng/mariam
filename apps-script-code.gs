/**
 * ============================================
 * Apps Script بتاع استقبال الملفات وحفظها في Drive
 * ============================================
 * الخطوات:
 * 1. غيّر MAIN_FOLDER_ID تحت بـ الـ ID بتاع الفولدر اللي عايز الملفات تتحفظ فيه
 * 2. اعمل Deploy جديد (New deployment) كـ Web App بعد أي تعديل هنا
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

    // خليها قابلة للعرض عن طريق اللينك بس، عشان الموقع يقدر يعرضها
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

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

// بيرجع قايمة بكل الملفات في category معينة (Images / Videos / VoiceNotes)
// بيتنادى من الموقع كده: APPS_SCRIPT_URL?action=list&category=Images
//
// وبيرجع كمان بايتات الملف نفسه (base64) عشان نشغّله بـ <video>/<audio> بتاعنا
// من غير ما نعدّي على واجهة جوجل خالص:
// APPS_SCRIPT_URL?action=stream&id=FILE_ID
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === 'list') {
      var category = e.parameter.category || 'Images';
      var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var subFolder = getOrCreateFolder(mainFolder, category);

      var files = subFolder.getFiles();
      var items = [];
      while (files.hasNext()) {
        var f = files.next();
        items.push({
          id: f.getId(),
          name: f.getName(),
          mimeType: f.getMimeType(),
          date: f.getDateCreated().getTime()
        });
      }
      items.sort(function (a, b) { return b.date - a.date; });

      return jsonOutput({ status: 'success', items: items });
    }

    if (action === 'stream') {
      var id = e.parameter.id;
      if (!id) {
        return jsonOutput({ status: 'error', message: 'missing id' });
      }
      var file = DriveApp.getFileById(id);
      var blob = file.getBlob();

      return jsonOutput({
        status: 'success',
        mimeType: blob.getContentType(),
        data: Utilities.base64Encode(blob.getBytes())
      });
    }

    return jsonOutput({ status: 'Server is running' });

  } catch (error) {
    return jsonOutput({ status: 'error', message: error.toString() });
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
