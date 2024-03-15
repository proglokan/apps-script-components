"use strict";
const doGet = (e) => {
    const sku = e.parameter.sku;
    return ContentService.createTextOutput(`SKU: ${sku}`);
};
const doPost = (e) => {
    return ContentService.createTextOutput('POST request received');
};
// test request
const testRequest = () => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbz';
    const payload = {
        sku: '12345'
    };
    const options = {
        method: 'post',
        payload: payload
    };
    fetch(scriptUrl, options);
};
//# sourceMappingURL=purchase-order-sheet-endpoint-ss.js.map