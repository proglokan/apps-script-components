// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → return the CSV sheet or throw the user an error
function getCsvSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet: GoogleAppsScript.Spreadsheet.Sheet | null = spreadsheet.getSheetByName('CSV');
    if (!sheet) throw new Error(''); // [+] create user-friendly error handling
    return sheet;
}

// @subroutine {Procedure} Void → use a regular expression to remove all commas and newlines from the CSV data
function csvFormatter(): void {
    const csvSheet: GoogleAppsScript.Spreadsheet.Sheet = getCsvSheet();
    const csvDataRange: GoogleAppsScript.Spreadsheet.Range = csvSheet.getDataRange();
    const csvValues: string[][] = csvDataRange.getValues();
    const regex: RegExp = /[\n,]/g;

    for (let x = 0; x < csvValues.length; ++x) {
        const rawDataRow: string[] = csvValues[x];
        const rowToString: string = rawDataRow.join('◯');
        const structuredRow: string = rowToString.replace(regex, '');
        const rowToArray: string[] = structuredRow.split('◯');
        csvValues[x] = rowToArray;
    }

    csvDataRange.setValues(csvValues);
}