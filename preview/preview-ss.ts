// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → imperatively return the 'Email' Sheet object
function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return SpreadsheetApp.getActive().getSheetByName('Email') as GoogleAppsScript.Spreadsheet.Sheet;
}

function previewHelper() {
    const mergedColSize = 3;
    const sheet = getSheet();
    const groupOneVals = sheet.getRange(2, 1, 4, mergedColSize).getValues() as string[][];
    const groupdTwoVals = sheet.getRange(2, 4, 4, mergedColSize).getValues() as string[][];
    const template: GoogleAppsScript.HTML.HtmlTemplate = HtmlService.createTemplateFromFile('preview-cs');
    template.groupOneVals = groupOneVals;
    template.groupTwoVals = groupdTwoVals;
    const html: GoogleAppsScript.HTML.HtmlOutput = template.evaluate().setWidth(500).setHeight(700);
    const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Preview');

}