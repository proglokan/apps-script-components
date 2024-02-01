function headersInvalid(headers) {
    const expectedHeaders = ['FromCountry', 'FromName', 'FromCompany', 'FromPhone', 'FromStreet1', 'FromStreet2', 'FromCity', 'FromZip', 'FromState', 'ToCountry', 'ToName', 'ToCompany', 'ToPhone', 'ToStreet1', 'ToStreet2', 'ToCity', 'ToZip', 'ToState', 'Length', 'Height', 'Width', 'Weight'];
    if (expectedHeaders.length !== headers.length) return true; // [+] Custom 'wrong length' error
    for (let x = 0; x < expectedHeaders.length; ++x) if (expectedHeaders[x] !== headers[x]) return true; // [+] Custom 'fields out of ourder' error
    return false;
}

// @subroutine {Function} Impure: string[] → transform the messy csv contents into a usable shape
// @arg {String} contents → raw content from the csv file
function transformContents(contents) {
    const rows = contents.split('\r\n');
    const [headers, ...values] = rows.map(row => row.split(','));
    const headersInvalidCheck = headersInvalid(headers);
    if (headersInvalidCheck) return;
    const csv = new Map();
    for (const header of headers) csv.set(header, []);
    for (const row of values) {
        for (let x = 0; x < row.length; ++x) {
            const header = headers[x];
            csv.get(header).push(row[x]);
        }
    }
    console.log(csv);
    return csv;
}

// @subroutine {Procedure} Void → throw a soft error if the user has not filled out a required field
// @arg {String} field → the field that is required
// @arg {String} requiredInput → the input that the user has provided
function throwError(field, requiredInput) {
    // prob some modal component that lets the user know what they need to fix
    // `Field` requires an input. The current input is `requiredInput`
}

// @subroutine {Function} Impure: Object → calculate the quote for the user
// @arg {Object} payload → the data from the csv file
function calculateQuote(payload) {

}

function validateValues(header, values) {
    const invalidIndexes = new Map([[header, []]]);
    if (/Street2/.test(header)) return invalidIndexes;
    for (let x = 0; x < values.length; ++x) {
        if (values[x].length <= 0) invalidIndexes.get(header).push(x);
    }
    return invalidIndexes;
}

function getPayloadCount(csvMap) {
    let payloadCount = 0;
    for (const [header, values] of csvMap) {
        payloadCount = values.length;
        break;
    }
    return payloadCount;
}

// same logic for bulk orders, waiting to write it with Next
// @subroutine {Procedure} Void & Helper → parse the uploaded csv, validate the data, and serve a quote to the user
document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.querySelector('#csvFileInput');
    const orderSubmissionCTA = document.querySelector('#submitOrders');
    orderSubmissionCTA.addEventListener('click', () => {
        const file = csvFileInput.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
            const contents = event.target.result;
            const csvMap = transformContents(contents);
            const rowsToFlag = [];
            for (const [header, values] of csvMap) {
                const indexes = validateValues(header, values);
                if (indexes.get(header).length) {
                    for (const [header, values] of indexes) {
                        const rows = values.map(value => value + 2);
                        const message = `The following rows are missing a value for ${header}: ${rows.join(', ')}`;
                        rowsToFlag.push(message);
                    }
                }
            }
            if (rowsToFlag.size) return rowsToFlag;
            const payloads = [];
            const payloadCount = getPayloadCount(csvMap);
            for (let x = 0; x < payloadCount; ++x) {
                const payload = {};
                for (const [header, values] of csvMap) {
                    payload[header] = values[x];
                }
                payloads.push(payload);
            }
            console.log(payloads);
        };
        // const quote = calculateQuote(payload);
        // do some component shit that tells the user the price so they can 'Create Labels'
    });
});