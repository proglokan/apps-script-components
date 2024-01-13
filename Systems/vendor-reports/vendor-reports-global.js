'use strict';
// @subroutine {Function} Pure: string → reconstructs an entry from a date and appended report data
function reconstructEntry(date, array) {
    const string = JSON.stringify(array);
    const entry = `${date}→${string}`;
    return entry;
}
export { reconstructEntry };
//# sourceMappingURL=vendor-reports-global.js.map