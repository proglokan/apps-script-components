'use strict';
function runTest() {
    const info =
        [
            ["GL wholesale", "https://www.glwholesale.com/", "pzpurchasing@proglo.biz", "ProgloPurchase", "GL Wholesale _Nov 28, 2023.xlsx", "-", false],
            ["Ultra DS / Ultra Standard Distributors", "https://www.ultradst.com/cgi/cgictl.pgm?PGMNAME=BSTHOM", "N/A", "N/A", "Ultra DS / Ultra Standard Distributors_Nov. 28, 2023.xlsx", "Weekly they provide updated CSV file thru email", false],
            ["Aromar", "https://www.aromar.net/wholesale/", "pzpurchasing@proglo.biz", "ProgloPurchase", "Aromar_Nov. 28, 2023.xlsx", "-", true],
            ["Lev trading 2.0", "https://www.levtradingllc.com/", "N/A", "N/A", "Lev trading 2.0_Nov. 28, 2023.xlsx", "most upc\'s is wrong - need to go over manually", false],
            ["EE SCHENCK", "https://eeschenck.com/", "N/A", "N/A", "EE SCHENCK_Nov. 28, 2023.xlsx", "-", false],
            ["Brand Name Distributor ", "https://brandnamedistributors.com/", "N/A", "N/A", "BND _Nov 28,2023.xlsx", "-", true],
            ["Diamond Trading Group", "-", "mas@dtgny.us", "-", "DTG_Nov. 28, 2023 .xlsx", "-", true],
        ];

    const data =
        [
            ["GL wholesale", "https://www.glwholesale.com/", "pzpurchasing@proglo.biz", "ProgloPurchase", "GL Wholesale _Nov 28, 2023.xlsx", "-", false],
            ["Ultra DS / Ultra Standard Distributors", "https://www.ultradst.com/cgi/cgictl.pgm?PGMNAME=BSTHOM", "N/A", "N/A", "Ultra DS / Ultra Standard Distributors_Nov. 28, 2023.xlsx", "Weekly they provide updated CSV file thru email", false],
            ["Awesome Perfumes", "https://www.awesomeperfumes.com/", "pzpurchasing@proglo.biz", "ProgloPurchase", "Awesome Perfumes_Nov. 28, 2023.xlsx", "Can download thru website", false],
            ["Aromar", "https://www.aromar.net/wholesale/", "pzpurchasing@proglo.biz", "ProgloPurchase", "Aromar_Nov. 28, 2023.xlsx", "-", false],
            ["Lev trading 2.0", "https://www.levtradingllc.com/", "N/A", "N/A", "Lev trading 2.0_Nov. 28, 2023.xlsx", "most upc\'s is wrong - need to go over manually", false],
            ["EE SCHENCK", "https://eeschenck.com/", "N/A", "N/A", "EE SCHENCK_Nov. 28, 2023.xlsx", "-", false],
            ["One World Distributor ", "https://onewdist.com/", "supplychain@proglo.biz", "Supplychainpg2023", "OWD NY_Nov 28, 2023.xlsx", "-", false],
            ["Weiner\'s LTD", "https://weinersltd.com/", "supplychain@proglo.biz", "Supplychainpg2023", "Weiner\'s LTD _Nov 28, 2023.xlsx", "-", false],
            ["Brand Name Distributor ", "https://brandnamedistributors.com/", "N/A", "N/A", "BND _Nov 28,2023.xlsx", "-", false],
            ["Diamond Trading Group", "-", "mas@dtgny.us", "-", "DTG_Nov. 28, 2023 .xlsx", "-", false],
        ];
        test(info, data);
}

function test(info: (string | boolean)[][], data: (string | boolean)[][]) {
    for (let x = 0; x < data.length; ++x) {
        const sourceString = data[x].slice(0, 5).join('');
        for (let y = 0; y < info.length; ++y) {
            const targetString = info[y].slice(0, 5).join('');
            if (sourceString !== targetString) continue;
            const lastElement = data[x].length - 1; 
            data[x][lastElement] = info[y][lastElement];
            break;
        }     
    }
    return data;
}
