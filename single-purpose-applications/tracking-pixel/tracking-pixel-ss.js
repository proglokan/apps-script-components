"use strict";
// https://docs.google.com/spreadsheets/d/17NY0wiA-90cD_QINeJiauHht8Bdq7cZd09YJDKUrgKY/edit#gid=0
// @subroutine {Procedure} Void → find the target email address and update its status to 'Opened'
// @arg targetEmailAddress: string → email address to update status of
function updateEmailStatus(targetEmailAddress) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Email Tracking');
    const upperY = sheet.getLastRow();
    const emailAddresses = sheet.getRange(1, 1, upperY, 2).getValues();
    for (let x = 0; x < emailAddresses.length; ++x) {
        if (emailAddresses[x][0] !== targetEmailAddress)
            continue;
        const row = x + 1;
        sheet.getRange(row, 2).setValue('Open');
        const time = new Date().toLocaleTimeString();
        Logger.log(time);
        sheet.getRange(row, 3).setValue(time);
        break;
    }
}
// @subroutine {Procedure} Void → update email status in spreadsheet respective to req.parameter
// @arg req: { parameter: { method: string, email: string } } → GET request made from rendered img in email
function doGet(req) {
    const method = req.parameter['method'];
    switch (method) {
        case 'track':
            const email = req.parameter['email'];
            updateEmailStatus(email);
        default:
            break;
    }
}
// @subroutine {Procedure} Void → send an email to test the tracking pixel
function sendEmails() {
    if (MailApp.getRemainingDailyQuota() <= 1)
        return;
    const template = HtmlService.createTemplateFromFile('email-tracker-cs.html');
    template.email = 'kanproglo@gmail.com';
    const message = template.evaluate().getContent();
    GmailApp.sendEmail('kanproglo@gmail.com', 'Subject: tracking pixel 5', 'Body: body contents', {
        htmlBody: message,
    });
}
//# sourceMappingURL=tracking-pixel-ss.js.map