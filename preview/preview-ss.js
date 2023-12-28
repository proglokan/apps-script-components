"use strict";
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → imperatively return the 'Email' Sheet object
function getSheet() {
    return SpreadsheetApp.getActive().getSheetByName('Email');
}
function previewHelper() {
    const mergedColSize = 3;
    const sheet = getSheet();
    const groupOneVals = sheet.getRange(2, 1, 4, mergedColSize).getValues();
    const groupdTwoVals = sheet.getRange(2, 4, 4, mergedColSize).getValues();
    const template = HtmlService.createTemplateFromFile('preview-cs');
    template.groupOneVals = groupOneVals;
    template.groupTwoVals = groupdTwoVals;
    const html = template.evaluate().setWidth(500).setHeight(700);
    const ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Preview');
}
//# sourceMappingURL=preview-ss.js.map