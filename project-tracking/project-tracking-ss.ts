function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return SpreadsheetApp.getActive().getSheetByName('Project tracking') as GoogleAppsScript.Spreadsheet.Sheet;
}

function handleInputs(data: string[]) {
    const sheet: GoogleAppsScript.Spreadsheet.Sheet = getSheet();
    const valRange: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(2, 1, 1, 6);
    const currentVals = valRange.getValues()[0] as string[];
    const newVals: number[] = Array(6).fill(0);
    for (let x = 0; x < data.length; ++x) {
        const val: number = +currentVals[x];
        const newVal: number = +data[x] + val;
        newVals[x] = newVal;
    }
    valRange.setValues([newVals]);
    const aggregateRange: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(2, 7);
    let aggregate: number = 0;
    for (let x = 0; x < newVals.length; ++x) aggregate += newVals[x];
    aggregateRange.setValue(aggregate);
}

function openForm() {
    const template: GoogleAppsScript.HTML.HtmlTemplate = HtmlService.createTemplateFromFile('project-tracking-cs');
    const html: GoogleAppsScript.HTML.HtmlOutput = template.evaluate().setWidth(500).setHeight(700);
    const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Project Tracking');
}