// @subroutine {Function} Impure: string[] → transform the messy csv contents into a usable shape
// @arg {String} contents → raw content from the csv file
function transformContents(contents) {
    const rows = contents.split('\n');
    for (let x = 0; x < 2; ++x) rows[x] = rows[x].split(',');
    return [...rows[0], ...rows[1]];
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

// same logic for bulk orders, waiting to write it with Next
// @subroutine {Procedure} Void & Helper → parse the uploaded csv, validate the data, and serve a quote to the user
document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.querySelector('#csvFileInput');
    const orderSubmissionCTA = document.querySelector('#submitOrders');
    orderSubmissionCTA.addEventListener('click', () => {
        const file = csvFileInput.files[0];
        const reader = new FileReader();
        const payload = {};
        reader.readAsText(file);
        reader.onload = (event) => {
            const contents = event.target.result;
            const row = transformContents(contents);
            for (let x = 0, y = 22; y < row.length; ++x, ++y) {
                if (!/Street2/.test(row[x]) && row[x] === '') {
                    throwError(row[x], row[y]);
                    break; 
                }
                payload[row[x]] = row[y];
            }
        };
        const quote = calculateQuote(payload);
        // do some component shit that tells the user the price so they can 'Create Labels'
    });
});