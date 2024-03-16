"use strict";
const projects = [
    {
        id: 'D3',
        date: '15 Dec 2023',
        materials: [
            {
                name: '2X4X16 (PTGC)',
                price: 13.48,
                quantity: 6,
                total: 80.88
            },
            {
                name: '2X4X10 (GDF)',
                price: 5.82,
                quantity: 22,
                total: 128.04
            },
            {
                name: '10" HG Spike',
                price: .58,
                quantity: 48,
                total: 27.84
            },
            {
                name: '20\'X100\' 6mill black poly sheeting',
                price: 127,
                quantity: 1,
                total: 127
            },
            {
                name: '3/4\" Gal Nipple',
                price: 4.11,
                quantity: 1,
                total: 4.11
            },
            {
                name: '3/4\" Garden valve',
                price: 14.44,
                quantity: 1,
                total: 14.44
            },
        ],
        projectTotal: 403.94,
        salesTax: 28.53,
        discount: 6.90
    },
    {
        id: 'D4',
        date: '18 Dec 2023',
        materials: [
            {
                name: '2X4X16',
                price: 9.18,
                quantity: 6,
                total: 55.08
            },
            {
                name: 'FIRM GRIP 15 PAIR PU DIPPED GLOVE',
                price: 9.88,
                quantity: 1,
                total: 9.88
            },
            {
                name: 'HEAVY DUTY L  NUPLA FGL LANDSCAPE RAKE',
                price: 69.98,
                quantity: 1,
                total: 69.98
            },
            {
                name: '3/8IN X 4 FT REBAR',
                price: 5.34,
                quantity: 7,
                total: 37.38
            },
            {
                name: '3/8 IN X 3 FT REBAR',
                price: 4.96,
                quantity: 2,
                total: 9.92
            },
            {
                name: '60LB QUIKRETE MORTAR MIX',
                price: 6.98,
                quantity: 3,
                total: 20.94
            },
            {
                name: '8"X8"X16"CNCRT MW BNDBM BLCK CHKOFF',
                price: 2.14,
                quantity: 6,
                total: 12.84
            },
            {
                name: '8"X8"X16" CONCRETE BLOCK CHKOFF',
                price: 2.67,
                quantity: 9,
                total: 24.03
            }
        ],
        projectTotal: 255.22,
        salesTax: 18.02,
        discount: 2.85
    },
    {
        id: 'D5',
        date: '19 Dec 2023',
        materials: [
            {
                name: '90LB QUIKRETE CONCRETE MIX',
                price: 6.46,
                quantity: 3,
                total: 19.38
            },
            {
                name: 'SHARPIE PERMANENT MARKER-BLACK 2PK',
                price: 2.68,
                quantity: 1,
                total: 2.68
            },
            {
                name: 'CLR SILICONE II DR/WINDOW #5000',
                price: 10.98,
                quantity: 1,
                total: 10.98
            },
            {
                name: 'SUPREME SILICONE W&D 10.1 OZ BROWN',
                price: 13.98,
                quantity: 2,
                total: 27.96
            },
            {
                name: '5/8IN BONDERIZED Z BAR',
                price: 9.92,
                quantity: 2,
                total: 19.84
            }
        ],
        projectTotal: 84.45,
        salesTax: 5.96,
        discount: 2.35
    }
];
const calculateProjectTotal = (project) => {
    let total = 0;
    const materials = project?.materials;
    if (materials === undefined)
        return total;
    for (let x = 0; x < materials.length; ++x)
        total += materials[x].total;
    total += project.salesTax;
    total -= project.discount;
    return total;
};
// calculateProjectTotal(projects[2]); //?
//# sourceMappingURL=project-tracker-ss.js.map