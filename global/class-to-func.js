"use strict";
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → fetch a sheet obj from internal and external workbooks
// @arg {string} ssid → the ID of the external spreadsheet
// @arg {string} sid → the ID of the sheet in the spreadsheet
// function fetchSheet(
//   ssid: string | null,
//   sid: number
// ): GoogleAppsScript.Spreadsheet.Sheet | Error {
//   const external = (id: string): GoogleAppsScript.Spreadsheet.Spreadsheet => {
//     const ss = SpreadsheetApp.openById(id);
//     return ss;
//   };
//   const internal = (): GoogleAppsScript.Spreadsheet.Spreadsheet => {
//     const ss = SpreadsheetApp.getActiveSpreadsheet();
//     return ss;
//   };
//   const ss: GoogleAppsScript.Spreadsheet.Spreadsheet | null = ssid ? external(ssid) : internal();
//   const searchForSheet = (ss: GoogleAppsScript.Spreadsheet.Spreadsheet): GoogleAppsScript.Spreadsheet.Sheet | null  | Error => {
//     const sheets = ss.getSheets();
//     for (let x = 0; x < sheets.length; ++x) {
//       const sheet = sheets[x];
//       const id = sheet.getSheetId();
//       if (id !== sid) continue;
//       return sheet;
//     }
//     return new Error(`Sheet ${sid} not found`);
//   }
//   const sheet: GoogleAppsScript.Spreadsheet.Sheet | null | Error = ss ? searchForSheet(ss) : null;
//   if (sheet === null) throw new Error(`Sheet ${sid} not found`);
//   return sheet;
// }
class FetchSheet {
    ssid;
    sid;
    ss;
    sheet;
    constructor(ssid, sid) {
        this.ssid = ssid;
        this.sid = sid;
        this.ss = this.ssid ? SpreadsheetApp.openById(this.ssid) : SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = this.ss ? this.searchForSheet(this.ss) : null;
        if (this.sheet === null)
            throw new Error(`Sheet ${sid} not found`);
    }
    searchForSheet(ss) {
        const sheets = ss.getSheets();
        for (let x = 0; x < sheets.length; ++x) {
            const sheet = sheets[x];
            const id = sheet.getSheetId();
            if (id !== this.sid)
                continue;
            return sheet;
        }
        return new Error(`Sheet ${this.sid} not found`);
    }
    getSheet() {
        return this.sheet;
    }
}
const sheet = new FetchSheet(null, 123049);
sheet.getSheet();
//# sourceMappingURL=class-to-func.js.map