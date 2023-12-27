"use strict";
function getSheetData() {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName('test');
    return [ss, sheet];
}
function getValues(sheet) {
    const upperX = sheet.getLastRow();
    const upperY = sheet.getLastColumn();
    const range = sheet.getRange(2, 1, upperX, upperY);
    const values = range.getValues();
    return values;
}
function createMapByCategories(values) {
    const ;
}
function accountingHelper() {
    const [ss, sheet] = getSheetData();
    const values = getValues(sheet);
    const mapByCategories = createMapByCategories(values);
    Logger.log(mapByCategories);
}
//# sourceMappingURL=accounting.js.map