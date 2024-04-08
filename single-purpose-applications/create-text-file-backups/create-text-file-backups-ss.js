import { fetchSheet, newError } from "../../global/global";
const sheetToListOfObjectLiterals = (values) => {
    const keys = values.shift();
    if (keys === undefined)
        return newError('createTextFileBackups', 'No keys found in sheet');
    const data = [];
    for (let x = 0; x < values.length; x++) {
        const row = values[x];
        const obj = {};
        for (let y = 0; y < row.length; y++) {
            const key = keys[y];
            const value = row[y];
            obj[key] = value;
        }
        data.push(obj);
    }
    return data;
};
const createTextFileBackups = () => {
    const sheet = fetchSheet(null, 1844782191);
    const values = sheet.getDataRange().getValues();
    const data = sheetToListOfObjectLiterals(values);
    const fileData = JSON.stringify(data, null, 2);
    const date = Utilities.formatDate(new Date(), 'PST', 'dd MMM yyyy');
    const hour = new Date().getHours();
    const fileName = `${date} Backup ${hour}`;
    const fileType = 'text/plain';
    const textFileBlob = Utilities.newBlob(fileData, fileType, fileName);
    DriveApp.createFile(textFileBlob);
};
//# sourceMappingURL=create-text-file-backups-ss.js.map


