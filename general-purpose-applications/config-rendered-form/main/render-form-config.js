'use strict';
import { fetchSheet, sheetToMap, getHeaders, getBody, getUniqueIdentifier } from "../../../global/global";
// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
// type Row = Body[number];
// type InputConfigSetting = { [key: string]: string | boolean };
// type GlobalConfigSettings = [string, string | null, number, number, string];
// @subroutine {Function} Pure: GlobalConfigSettings → get global config settings for the form
// @arg {string} formName → the name of the form to render
// @arg {_Headers} gcHeaders → the headers of the global config sheet
// @arg {Body} gcBody → the body of the global config sheet
function getGlobalConfigSettings(formName, gcHeaders, gcBody) {
    const gcSettings = [];
    for (let x = 0; x < gcBody.length; ++x) {
        const row = gcBody[x];
        const formNameHeaderIndex = gcHeaders.get('Form name');
        if (formNameHeaderIndex === undefined)
            throw new Error(`Header 'Form name' not found in global config sheet`);
        const formNameInRow = row[formNameHeaderIndex];
        if (formNameInRow !== formName)
            continue;
        gcSettings.push(row);
        break;
    }
    return gcSettings[0];
}
// @subroutine {Function} Pure: InputConfigSetting[] → get local config settings for each input in the local config sheet
// @arg {MappedSheet} mappedLocalConfigSheet → the local config sheet converted to a Map() object
function getLocalConfigSettings(mappedLocalConfigSheet) {
    if (!mappedLocalConfigSheet.size)
        throw new Error(`No settings found in local config sheet`);
    const lcSettings = [];
    const entriesIterator = mappedLocalConfigSheet.entries();
    const firstEntry = entriesIterator.next().value;
    for (let x = 0; x < firstEntry[1].length; ++x)
        lcSettings.push({ uniqueIdentifier: '' });
    for (const [attribute, settings] of mappedLocalConfigSheet) {
        for (let x = 0; x < settings.length; ++x) {
            const setting = settings[x];
            const inputConfig = lcSettings[x];
            inputConfig[attribute] = setting;
        }
    }
    for (let x = 0; x < lcSettings.length; ++x)
        lcSettings[x]['uniqueIdentifier'] = getUniqueIdentifier();
    return lcSettings;
}
// @subroutine {Function} Pure: GoogleAppsScript.HTML.HtmlOutput → create an HTML output for the form & define scriptlets for local config settings and the target sheet
// @arg {string} formName → the name of the form to render
// @arg {string | null} targetSpreadsheet → the ID of the target spreadsheet, if applicable
function createHtmlOutput(formName, targetSpreadsheet, targetSheet, lcSettings) {
    const template = HtmlService.createTemplateFromFile('render-warehouse-form-cs');
    template.targetSpreadsheet = targetSpreadsheet;
    template.targetSheet = targetSheet;
    template.lcSettings = lcSettings;
    const htmlOutput = template.evaluate();
    htmlOutput.setTitle(`${new Date().toLocaleDateString()} - ${formName} Form`).setWidth(700).setHeight(800);
    return htmlOutput;
}
// @subroutine {Procedure} Void → render the HTML output based on the render type
// @arg {GoogleAppsScript.HTML.HtmlOutput} htmlOutput → the HTML output to render
// @arg {string} formName → the name of the form to render
// @arg {string} renderType → the type of render to use
function renderHtmlOutput(htmlOutput, formName, renderType) {
    const ui = SpreadsheetApp.getUi();
    switch (renderType) {
        case 'Modeless dialog':
            ui.showModelessDialog(htmlOutput, formName);
            break;
        case 'Modal dialog':
            ui.showModalDialog(htmlOutput, formName);
            break;
        case 'Sidebar':
            ui.showSidebar(htmlOutput);
            break;
    }
}
// @subroutine {Helper} Void → given a form name and global config ID, render a form based on local config settings
// @arg {string} formName → name of the form to render
// @arg {number} gcID → ID of the global config sheet
function configRenderedFormMain(formName, gcID) {
    const gcSheet = fetchSheet(null, gcID);
    const gcHeaders = getHeaders(gcSheet);
    const gcBody = getBody(gcSheet);
    const [lcName, targetSpreadsheet, lcID, targetSheet, renderType] = getGlobalConfigSettings(formName, gcHeaders, gcBody);
    const lcSheet = fetchSheet(null, lcID);
    const mappedLocalConfigSheet = sheetToMap(lcSheet);
    const lcSettings = getLocalConfigSettings(mappedLocalConfigSheet);
    const htmlOutput = createHtmlOutput(lcName, targetSpreadsheet, targetSheet, lcSettings);
    renderHtmlOutput(htmlOutput, formName, renderType);
}
export { configRenderedFormMain };
//# sourceMappingURL=render-form-config.js.map