import { fetchSheet } from "../../global/global";
import { reconstructEntry } from "./vendor-reports-global";
// @subroutine {Function} Pure: [string, string[][]] → split a CSV row into a date and parse the stringified matrix
// @arg {string[]} row: a row of CSV data
function getParsedRow(row) {
    const [date, string] = row[0].split('→');
    const array = JSON.parse(string);
    return [date, array];
}
// @subroutine {Function} Pure: [string[], string[]] → split an array at a given index
// @arg {string[]} array: an array of strings
// @arg {number} index: the index at which to split the array
function splitArray(array, index) {
    const first = array.slice(0, index);
    const second = array.slice(index);
    return [first, second];
}
// @subroutine {Function} Pure: string[][] → given a string and index, mutate each row of CSV Management data
// @arg {string[][]} data: a matrix of CSV data
// @arg {string} string: a string to append to each row
// @arg {number} index: the index at which to append the string
function mutateSubArrays(data, string, index) {
    for (let x = 1; x < data.length; ++x) {
        const row = data[x];
        const [date, array] = getParsedRow(row);
        if (!array.length)
            continue;
        if (index === 0) {
            array.forEach((y) => y.unshift(string));
            const newRow = reconstructEntry(date, array);
            data[x] = [newRow];
            continue;
        }
        if (index === array.length - 1) {
            array.forEach((y) => y.push(string));
            const newRow = reconstructEntry(date, array);
            data[x] = [newRow];
            continue;
        }
        if (index > array.length - 1) {
            array.forEach((y) => y[index] = string);
            const newRow = reconstructEntry(date, array);
            data[x] = [newRow];
            continue;
        }
        for (let y = 0; y < array.length; ++y) {
            const [first, second] = splitArray(array[y], index);
            first.push(string);
            const subArray = first.concat(second);
            array[y] = subArray;
        }
        const newRow = reconstructEntry(date, array);
        data[x] = [newRow];
    }
    return data;
}
// @subroutine {Helper} → given a string and index, append each row of CSV Management data in the Middleware Workbook
function appendCsvDataMain() {
    const sheet = fetchSheet('', "CSV Management");
    const data = sheet.getDataRange().getValues();
    const ui = SpreadsheetApp.getUi();
    const prompt = ui.prompt('Enter a string and an index', 'string, index', ui.ButtonSet.OK_CANCEL);
    const responseText = prompt.getResponseText();
    const [string, index] = responseText.split(',').map((x) => x.trim());
    const values = mutateSubArrays(data, string, +index);
    values;
}
//# sourceMappingURL=append-csv-data-ss.js.map