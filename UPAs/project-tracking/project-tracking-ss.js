"use strict";
function getSheet() {
    return SpreadsheetApp.getActive().getSheetByName('Project tracking');
}
function handleInputs(data) {
    const sheet = getSheet();
    const valRange = sheet.getRange(2, 1, 1, 6);
    const currentVals = valRange.getValues()[0];
    const newVals = Array(6).fill(0);
    for (let x = 0; x < data.length; ++x) {
        const val = +currentVals[x];
        const newVal = +data[x] + val;
        newVals[x] = newVal;
    }
    valRange.setValues([newVals]);
    const aggregateRange = sheet.getRange(2, 7);
    let aggregate = 0;
    for (let x = 0; x < newVals.length; ++x)
        aggregate += newVals[x];
    aggregateRange.setValue(aggregate);
}
function openForm() {
    const template = HtmlService.createTemplateFromFile('project-tracking-cs');
    const html = template.evaluate().setWidth(500).setHeight(700);
    const ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Project Tracking');
}
//# sourceMappingURL=project-tracking-ss.js.map