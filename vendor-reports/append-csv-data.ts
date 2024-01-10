import { fetchSheet } from "../global/global"
import { reconstructEntry } from "./vendor-reports-global";

function getParsedRow(row: string[]) {
	const [date, string] = row[0].split('→');
	const array = JSON.parse(string) as string[][];
	return [date, array];
}

function splitArray(array: string[], index: number) {
	const first = array.slice(0, index);
	const second = array.slice(index);
	return [first, second];
}

function mutateSubArrays(data: string[][], string: string, index: number) {
	for (let x = 1; x < data.length; ++x) {
		const row: string[] = data[x];
		const [date, array] = getParsedRow(row) as [string, string[][]];
		if (!array.length) continue;
		if (index === 0) {
			array.forEach((x: string[]) => x.unshift(string));
			const newRow = reconstructEntry(date, array);
			data[x] = [newRow];
			continue;
		}
		if (index === row.length - 1) {
			array.forEach((x: string[]) => x.push(string));
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
}

// @subroutine {Helper} → given a string and index, append each row of CSV Management data in the Middleware Workbook
function appendCsvDataMain() {
	const sheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet('', "CSV Management");
	const data: string[][] = sheet.getDataRange().getValues();
	const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
	const prompt: GoogleAppsScript.Base.PromptResponse = ui.prompt('Enter a string and an index', 'string, index', ui.ButtonSet.OK_CANCEL);
	const responseText = prompt.getResponseText();
	const [string, index] = responseText.split(',').map((x: string) => x.trim());
	const values = mutateSubArrays(data, string, +index);
}