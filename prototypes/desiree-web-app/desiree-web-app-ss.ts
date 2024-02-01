'use strict';
import { fetchSheet } from "../../global/global";
function doGet(request: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createTemplateFromFile('test-web-app-cs').evaluate();
}

function postFormData(array: string[]) {
  const sheet = fetchSheet(null, 'Form input');
  const range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 5);
  const values = [array];
  range.setValues(values);
  return 'Successfully stored form results!';
}