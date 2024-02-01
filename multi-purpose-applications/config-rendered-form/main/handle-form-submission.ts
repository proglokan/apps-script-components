import { fetchSheet, getHeaders, _Headers, getBody, Body } from "../../../global/global";
type InputData = { [key: string]: string | boolean };
function sendData(targetSpreadsheet: string | null, targetSheetID: number, inputData: InputData[]) {
  const targetSheet = fetchSheet(targetSpreadsheet, targetSheetID);
  const targetHeaders = getHeaders(targetSheet);
  const targetSheetBody = getBody(targetSheet);
  // . . .
  return true;
}
