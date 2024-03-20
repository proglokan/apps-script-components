"use strict";
import { fetchSheet, sheetToMap, getSheetHeaders, getSheetValues, getUniqueIdentifier } from "../../../global/global";
// * Get global config settings for the form
const getGlobalConfigSettings = (formName, gcHeaders, gcSheetValues) => {
    const gcSettings = [];
    for (let x = 0; x < gcSheetValues.length; ++x) {
        const row = gcSheetValues[x];
        const formNameHeaderIndex = gcHeaders.get("Form name");
        if (formNameHeaderIndex === undefined)
            throw new Error(`Header 'Form name' not found in global config sheet`);
        const formNameInSheetRow = row[formNameHeaderIndex];
        if (formNameInSheetRow !== formName)
            continue;
        gcSettings.push(row);
        break;
    }
    return gcSettings[0];
};
// * Get local config settings for each input in the local config sheet
const getLocalConfigSettings = (mappedLocalConfigSheet) => {
    if (!mappedLocalConfigSheet.size)
        throw new Error(`No settings found in local config sheet`);
    const lcSettings = [];
    const entriesIterator = mappedLocalConfigSheet.entries();
    const firstEntry = entriesIterator.next().value;
    for (let x = 0; x < firstEntry[1].length; ++x)
        lcSettings.push({ uniqueIdentifier: "" });
    for (const [attribute, settings] of mappedLocalConfigSheet) {
        for (let x = 0; x < settings.length; ++x) {
            const setting = settings[x];
            const inputConfig = lcSettings[x];
            inputConfig[attribute] = setting;
        }
    }
    for (let x = 0; x < lcSettings.length; ++x)
        lcSettings[x]["uniqueIdentifier"] = getUniqueIdentifier();
    return lcSettings;
};
// * Create an HTML output for the form & define scriptlets for local config settings and the target sheet
const createHtmlOutput = (formName, targetSpreadsheet, targetSheet, lcSettings) => {
    const template = HtmlService.createTemplateFromFile("render-warehouse-form-cs");
    template.targetSpreadsheet = targetSpreadsheet;
    template.targetSheet = targetSheet;
    template.lcSettings = lcSettings;
    const htmlOutput = template.evaluate();
    htmlOutput.setTitle(`${new Date().toLocaleDateString()} - ${formName} Form`).setWidth(700).setHeight(800);
    return htmlOutput;
};
// * Render the HTML output based on the render type
const renderHtmlOutput = (htmlOutput, formName, renderType) => {
    const ui = SpreadsheetApp.getUi();
    switch (renderType) {
        case "Modeless dialog":
            ui.showModelessDialog(htmlOutput, formName);
            break;
        case "Modal dialog":
            ui.showModalDialog(htmlOutput, formName);
            break;
        case "Sidebar":
            ui.showSidebar(htmlOutput);
            break;
    }
};
// * Given a form name and global config ID, render a form based on local config settings
const configRenderedFormMain = (formName, gcID) => {
    const gcSheet = fetchSheet(null, gcID);
    const gcHeaders = getSheetHeaders(gcSheet);
    const gcSheetValues = getSheetValues(gcSheet);
    const [lcName, targetSpreadsheet, lcID, targetSheet, renderType] = getGlobalConfigSettings(formName, gcHeaders, gcSheetValues);
    const lcSheet = fetchSheet(null, lcID);
    const mappedLocalConfigSheet = sheetToMap(lcSheet);
    const lcSettings = getLocalConfigSettings(mappedLocalConfigSheet);
    const htmlOutput = createHtmlOutput(lcName, targetSpreadsheet, targetSheet, lcSettings);
    renderHtmlOutput(htmlOutput, formName, renderType);
};
export { configRenderedFormMain };
//# sourceMappingURL=render-form-config.js.map