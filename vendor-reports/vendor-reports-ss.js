'use strict';
// [+] REFERENCE FOR COMPILED FILE
// 
// type _Headers = Map<string, number>;
// 
// interface Entry {
//     size: number;
//     row: number;
//     report: string;
// }
// @subroutine {Procedure} Returns: number → initializes today's entry in the middleware workbook and returns the row of the entry
// @arg {GoogleAppsScript.Spreadsheet.Sheet} localSheet → the sheet in the middleware workbook to send the update to
function initToday(localSheet) {
    const row = localSheet.getLastRow() + 1;
    const today = new Date().toLocaleDateString();
    const entryValue = `${today}→[]`;
    localSheet.getRange(row, 1).setValue(entryValue);
    return row;
}
// @subroutine {Function} Pure: Entry → deconstruct the report info from today's entry in the middleware workbook and return the size, row, and report itself
// @arg {GoogleAppsScript.Spreadsheet.Sheet} localSheet → the sheet in the middleware workbook to send the update to
function getEntryInfo(localSheet) {
    const data = localSheet.getDataRange().getValues();
    const entry = {
        size: 0,
        row: -1,
        report: '[]'
    };
    for (let x = 1; x < data.length; ++x) {
        const today = new Date().toLocaleDateString();
        const [dateString, report] = data[x][0].split('→');
        const date = new Date(dateString).toLocaleDateString();
        if (date !== today)
            continue;
        entry.row = x + 1;
        entry.report = report;
        entry.size = JSON.parse(report).length;
    }
    if (entry.row === -1)
        entry.row = initToday(localSheet);
    return entry;
}
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → get the sheet from the source workbook using its ID
function getSourceSheet() {
    const ID = '1bnihuxvO7810UWyYdyzbVGfU2ev8c64nmz1KKSJ0gIU';
    const SHEET_NAME = 'Vendor-CSV';
    const sourceWorkbook = SpreadsheetApp.openById(ID);
    const sourceSheet = sourceWorkbook.getSheetByName(SHEET_NAME);
    if (sourceSheet === null)
        throw new Error(`Sheet ${SHEET_NAME} not found`);
    return sourceSheet;
}
// @subroutine {Function} Pure: number[] → get the column indexes containing the target cells
// @arg {_Headers} headers → the headers of the source workbook
function getTargetColumns(headers) {
    const TARGET_HEADERS = ['VENDOR NAME', 'WEBSITE', 'EMAIL', 'PASSWORD', 'CSV', 'CD Notes', 'Check Status'];
    const columns = [];
    for (const header of TARGET_HEADERS) {
        const column = headers.get(header);
        if (column === undefined)
            throw new Error(`Header ${header} not found`);
        columns.push(column);
    }
    return columns;
}
// @subroutine {Procedure} Void → cache the coordinates of the target cells
// @arg {number[][][]} updatedRows → the coordinates of the target cells
function cacheCoordinates(updatedRows) {
    const cache = CacheService.getScriptCache();
    const key = 'coordinates';
    const value = JSON.stringify(updatedRows);
    cache.put(key, value);
}
// @subroutine {Function} Pure: boolean → check if there are any updates to the source workbook based on the date in the CSV Updated Date column and caching the coordinates of the target cells if so
// @arg {number} size → the size of the report in the middleware workbook
// @arg {string[][]} data → the data from the source workbook
// @arg {_Headers} headers → the headers of the source workbook
function isUpdated(size, data, headers) {
    const today = new Date().toLocaleDateString();
    const COLUMN_NAME = 'CSV Updated Date';
    if (headers.get(COLUMN_NAME) === undefined)
        throw new Error(`Header ${COLUMN_NAME} not found`);
    const column = headers.get(COLUMN_NAME);
    const targetColumns = getTargetColumns(headers);
    const coordinates = [];
    for (let x = 1; x < data.length; ++x) {
        const cell = '' + data[x][column];
        if (cell === '' || cell.toLowerCase() === 'live inventory')
            continue;
        const date = new Date(cell).toLocaleDateString();
        if (date !== today)
            continue;
        const subCoordinates = [];
        for (const y of targetColumns)
            subCoordinates.push([x, y]);
        coordinates.push(subCoordinates);
    }
    if (size > coordinates.length)
        return false;
    cacheCoordinates(coordinates);
    return true;
}
// @subroutine {Function} Pure: number[][][] → get cached coordinates of target cells
function getCoordinates() {
    const cache = CacheService.getScriptCache();
    const key = 'coordinates';
    const value = cache.get(key);
    if (value === null)
        throw new Error(`Cache \'${key}\' not found`);
    return JSON.parse(value);
}
// @subroutine {Function} Pure: string[][] → get coordinates of target cells and return their contents
// @arg {string[][]} data → the data to use the coordinates on
function getUpdateContents(data) {
    const coordinates = getCoordinates();
    const contents = [];
    for (let x = 0; x < coordinates.length; ++x) {
        const subContents = [];
        for (let y = 0; y < coordinates[x].length; ++y) {
            const [row, column] = coordinates[x][y];
            let value = data[row][column];
            if (value === '')
                value = '-';
            subContents.push(value);
        }
        contents.push(subContents);
    }
    for (const row of contents) {
        const index = row.length - 1;
        row[index] = false;
    }
    return contents;
}
// @subroutine {Procedure} Returns: (string | boolean)[][] → compare the info in middleware to the data from the source workbook and maintain all previous statuses
// @arg {(string | boolean)[][]} report → info from today's entry in the middleware workbook
// @arg {(string | boolean)[][]} contents → data from today's updates in the source workbook
function synchronizeContents(report, contents) {
    const info = JSON.parse(report);
    for (let x = 0; x < contents.length; ++x) {
        const sourceString = contents[x].slice(0, 5).join('');
        for (let y = 0; y < info.length; ++y) {
            const targetString = info[y].slice(0, 5).join('');
            if (sourceString !== targetString)
                continue;
            const lastElement = contents[x].length - 1;
            contents[x][lastElement] = info[y][lastElement];
            break;
        }
    }
    return contents;
}
// @subroutine {Procedure} Void → send update to middleware workbook
// @arg {GoogleAppsScript.Spreadsheet.Sheet} localSheet → the sheet in the middleware workbook to send the update to
// @arg {(string | boolean)[][]} syncedContents → the data to send to the middleware workbook
function sendUpdate(localSheet, syncedContents, row) {
    const date = new Date().toLocaleDateString();
    const data = JSON.stringify(syncedContents);
    localSheet.getRange(row, 1).setValue(`${date}→${data}`);
}
// @subroutine {Helper} Void → get data from a source workbook, check for date-specific updates, transform source data into a report format, store the report in a middleware workbook
function vendorReportTrigger() {
    const localSheet = getLocalSheet('Vendor Reports');
    const { row, report, size } = getEntryInfo(localSheet);
    const sheet = getSourceSheet();
    const data = sheet.getDataRange().getValues();
    const headers = getHeaders(sheet);
    if (!isUpdated(size, data, headers))
        return newLog('vendor-reports-ss', `no updates as of ${new Date().toLocaleTimeString()} PST`);
    const contents = getUpdateContents(data);
    const syncedContents = synchronizeContents(report, contents);
    sendUpdate(localSheet, syncedContents, row);
    newLog('vendor-reports-ss', `new report entry on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} PST`);
}
//# sourceMappingURL=vendor-reports-ss.js.map