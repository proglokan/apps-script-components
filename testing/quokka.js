'use strict';
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const logOptions = [
    'Client deposited {{ amount }} ILS to Mizrahi Tfahot',
    '{{ amount }} ILS converted to {{ amount }} USD at a rate of {{ ILS / USD }}',
    '{{ amount }} USD deposited to Profitzon Payoneer',
    '{{ amount }} USD deposited to Roy\'s payoneer',
];
// display log options with indexes
rl.question('Choose a log option: \n' + logOptions.map((option, index) => `${index + 1}. ${option}`).join('\n') + '\n', (answer) => {
    console.log('You chose:', logOptions[parseInt(answer) - 1]);
    rl.close();
});
const logs = new Map();
//# sourceMappingURL=quokka.js.map