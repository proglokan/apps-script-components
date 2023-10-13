"use strict";
const contents = 'FromCountry,FromName,FromCompany,FromPhone,FromStreet1,FromStreet2,FromCity,FromZip,FromState,ToCountry,ToName,ToCompany,ToPhone,ToStreet1,ToStreet2,ToCity,ToZip,ToState,Length,Height,Width,Weight\r\nUS,kan,proglo,7757278690,1321 pioche,,pahrump,89048,CA,US,DINH SAM LU,N/A,14820971635,3165 W TYLER AVE,,ANAHEIM,92801,CA,13,78,64,20\r\nUS,chance,N/A,7024687626,1011 avocadodrive,,las vegas,89148,CA,US,DINH SAM LU,N/A,14820971635,3165 W TYLER AVE,,ANAHEIM,92801,CA,71,81,12,8\r\nUS,maddy,mp construction,7024687620,3209 fritz street,,pahrump,89048,CA,US,DINH SAM LU,N/A,14820971635,3165 W TYLER AVE,,ANAHEIM,92801,CA,53,15,22,1\r\nUS,kota,mp construction,7757278690,3209 fritz street,,pahrump,89048,CA,US,DINH SAM LU,N/A,14820971635,3165 W TYLER AVE,,ANAHEIM,92801,CA,11,23,12,63'
const rows = contents.split('\r\n');
const [headers, ...values] = rows.map(row => row.split(','));
const csv = new Map();
for (const header of headers) csv.set(header, []);
for (const row of values) {
    for (let x = 0; x < row.length; ++x) {
        const header = headers[x];
        csv.get(header).push(row[x]);
    }
}
csv; //?