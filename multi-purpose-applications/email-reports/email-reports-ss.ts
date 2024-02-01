'use strict';
import { fetchSheet, getHeaders, _Headers } from '../../global/global';
type Requirements = Map<string, Array<[string, number]>>;
type AggregateData = Map<string, { headers: _Headers, body: string[][] }>;
type EmailContentRow = Map<string, Map<string, number>>;
interface EmailContent {
  standard: EmailContentRow[],
  urgent: EmailContentRow[]
}

// [+] REFERENCE FOR COMPILED FILE
// 
// type _Headers = Map<string, number>;
// type Requirements = Map<string, Array<[string, number]>>;
// type AggregateData = Map<string, { headers: _Headers, body: string[][] }>;
// type EmailContentRow = Map<string, Map<string, number>>;
// interface EmailContent {
//   standard: EmailContentRow[],
//   urgent: EmailContentRow[]
// }
  
// @subroutine {Function} Pure: Requirements → defining the data requirements for the daily email reports
function getRequirements(): Requirements {
  const requirements: Requirements = new Map([
    [
      'RFQ', [
        ['Pending Action', 1],
        ['Admin - Kesh/Nimrod', 1],
        ['PO Sent (PO Owner)', 2],
        ['PO Processing (Buying)', 3],
        ['VI/Invoice Rcvd | Need Approval', 1],
        ['Ready to Pay | Final Approval | Move to APO', 2]
      ]
    ],
    [
      'APO', [
        ['Pending Action', 1],
        ['Admin - Kesh/Nimrod', 1],
        ['VI/Ready to Pay (Buying) - Move to APO', 1],
        ['VI/PAID - PG invoice Issued', 2],
        ['Vendor - Label Provided', 2],
        ['Vendor - Partial - Shipped', 3],
        ['Vendor - Lost', 3]
      ]
    ],
    [
      'Inbound', [
        ['Wh - Partial - Rcvd', 7],
        ['Case Opened', 2], 
        ['WH-RCV-Case Open', 2], 
        ['Partial - Sent to Outbound', 2] 
      ]
    ], [
      'Outbound', [
        ['Wh Shipped', 0],
        ['Label Created - Pending Prep', 1],
        ['Prepped -  Ready for Pick up', 5],
        ['Issues - Acct suspended', 7],
        ['Issue - Need Approval', 7],
        ['Issue - Need Ungate', 7],
        ['Issue - Cubic Limit Reached', 7],
        ['Ready to Go', 2],
        ['Ready to Go - Pending Check In', 7],
        ['Prepped - Need Label', 1],
        ['Admin Issue', 2]
      ]
    ]
  ]);
  return requirements;
}

// @subroutine {Function} Pure: string[][] → get the aggregate data for the daily email reports from each sheet in the Requirements
// @arg {Requirements} requirements → the data requirements for the daily email reports
function getAggregateData(requirements: Requirements, ID: string): AggregateData {
  const aggregateData = new Map();
  for (const sheetName of requirements.keys()) {
    const sheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(ID, sheetName);
    const headers: _Headers = getHeaders(sheet);
    const body: string[][] = sheet.getDataRange().getValues();
    aggregateData.set(sheetName, { headers, body });
  }
 return aggregateData;
}

function initEmailContentRows(emailContentRows: EmailContentRow[], sheetName: string, status: string) {
  for (const emailContentRow of emailContentRows) {
    const sheet = emailContentRow.get(sheetName);
    if (!sheet) throw new Error(`No sheet found for ${sheetName}`);
    sheet.set(status, 0);
  }
}

function appendEmailContentRow(emailContentRow: EmailContentRow, sheetName: string, status: string, date: string) {
  const sheet = emailContentRow.get(sheetName);
  if (!sheet) throw new Error(`No sheet found for ${sheetName}`);
  const statusEntry = sheet.get(status);
  if (statusEntry === undefined) throw new Error(`No status found for ${status}`);
  sheet.set(status, statusEntry + 1);
}

function getEmailContent(requirements: Requirements, aggregateData: AggregateData): EmailContent {
  const emailContent: EmailContent = { standard: [], urgent: [] };
  const today = new Date();
  for (const [sheetName, statuses] of requirements) {
    const standardEmailContentRow: EmailContentRow = new Map([[sheetName, new Map()]]);
    const urgentEmailContentRow: EmailContentRow = new Map([[sheetName, new Map()]]);
    const data = aggregateData.get(sheetName);
    if (!data) throw new Error(`No data found for ${sheetName}`);
    const { headers, body } = data;
    if (headers.get('Status') === undefined) throw new Error(`No Status column found in ${sheetName}`);
    if (headers.get('Date') === undefined) throw new Error(`No Date column found in ${sheetName}`);
    const statusCol = headers.get('Status')!;
    const dateCol = headers.get('Date')!;
    for (let x = 0; x < statuses.length; ++x) {
      const [status, dayThreshold] = statuses[x];
      initEmailContentRows([standardEmailContentRow, urgentEmailContentRow], sheetName, status);
      for (let y = 1; y < body.length; ++y) {
        const row = body[y];
        const statusCell = row[statusCol];
        const dateCell = row[dateCol];
        if (statusCell !== status) continue;
        const date = new Date(dateCell);
        const diff = today.getTime() - date.getTime();
        const entryAge = Math.ceil(diff / (1000 * 3600 * 24));
        if (entryAge >= dayThreshold) appendEmailContentRow(urgentEmailContentRow, sheetName, status, dateCell);
        else appendEmailContentRow(standardEmailContentRow, sheetName, status, dateCell);
      }
    }
    emailContent.standard.push(standardEmailContentRow);
    emailContent.urgent.push(urgentEmailContentRow);
  }
  return emailContent;
}

function emailReportsTrigger(): void {
  const ID = '1TVReEBhve86gr3G6o9YVhWP2G0em9gPetxeJKkTdBDM';
  const requirements: Requirements = getRequirements();
  const aggregateData: AggregateData = getAggregateData(requirements, ID);
  const emailContent: EmailContent = getEmailContent(requirements, aggregateData);
  // iterate through all emailcontent rows
  for (let x = 0; x < emailContent.standard.length; ++x) {
    const standardEmailContentRow = emailContent.standard[x];
    const urgentEmailContentRow = emailContent.urgent[x];
    const sheetName = standardEmailContentRow.keys().next().value;
    const standardEmailContent = [...standardEmailContentRow.get(sheetName)!.entries()].map(([status, count]) => `${status}: ${count}`).join('\n');
    const urgentEmailContent = [...urgentEmailContentRow.get(sheetName)!.entries()].map(([status, count]) => `${status}: ${count}`).join('\n');
    console.log(standardEmailContent);
    console.log(urgentEmailContent);
  }
}