'use strict';


// const arr = ['a', 'b', 'c', 'd'];
// JSON.stringify(arr); //?

// const data = [
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00120'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00122'],
//   ['10-00203'],
//   ['10-00203'],
//   ['10-00203'],
//   ['10-00203'],
//   ['10-00209'],
//   ['10-00209'],
//   ['10-00209'],
//   ['10-00209'],
//   ['10-00209'],
//   ['10-00209'],
//   ['10-00213'],
//   ['10-00214'],
//   ['10-00215'],
//   ['10-00216'],
//   ['10-00222'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00218'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00220'],
//   ['10-00222'],
//   ['10-00223'],
//   ['10-00224'],
//   ['10-00222'],
// ];

// function findOutOfPlaceIds(data: string[][]): { outOfPlaceIds: string[], outOfPlacePositions: number[] } {
//     const idCountMap: Map<string, number[]> = new Map();
//     const outOfPlaceIds: string[] = [];
//     const outOfPlacePositions: number[] = [];

//     // Count occurrences and track positions of each ID
//     for (let x = 0; x < data.length; ++x) {
//         const id = data[x][0];
//         if (!idCountMap.has(id)) {
//             idCountMap.set(id, []);
//         }
//         idCountMap.get(id)?.push(x);
//     };

//     // Check for out of place IDs and their positions
//     for (const [id, positions] of idCountMap) {
//         if (positions.length > 1) {
//             for (let i = 0; i < positions.length - 1; i++) {
//                 if (positions[i] !== positions[i + 1] - 1) {
//                     outOfPlaceIds.push(id);
//                     outOfPlacePositions.push(positions[i]);
//                 }
//             }
//         }
//     };

//     return { outOfPlaceIds, outOfPlacePositions };
// }

// const { outOfPlaceIds, outOfPlacePositions } = findOutOfPlaceIds(data);

// console.log("Out of place IDs:", outOfPlaceIds);
// console.log("Positions of out of place IDs:", outOfPlacePositions);

// ----------------------------------------------------------------------------------------------------------------------------

// const purchaseOrderData = {
//     creationDate: '12 Jan 2024',
//     asignee: 'Tal',
//     email: 'zilkerinvestments@gmail.com',
//     phone: '+1 (954) 909-7920',
//     orderType: 'email order',
//     totalUnits: 2454,
//     invoice: 'https://docs.google.com/spreadsheets/d/1TVReEBhve86gr3G6o9YVhWP2G0em9gPetxeJKkTdBDM/edit#gid=1173035010&range=X52',
//     vendorPoQuote: 55325.68,
//     finalCost: 55325.68,
//     products: [
//         {
//             suggestedStore: 'MOSHILOTO',
//             sku: '792179239762',
//             upc: '792179239762',
//             asin: 'B002MPQHGW',
//             name: 'Kangol Wool 504 Black, XX-Large',
//             type: '1:1',
//             unitsPerAsin: 1,
//             unitsGoingToAmazon: 72,
//             initalUnitQuantity: 72,
//             initialAskingUnitPrice: 26.22,
//             acceptedUnitsQty: 72,
//             acceptedUnitPrice: 26.22,
//             unitTotalOrder: 1887.84,
//             unitPayoneerFees: 18.88,
//             finalUnitTotal: 1906.72,
//             finalUnitCost: 26.48,
//             perUnitCostIncurred: .26,
//             shippedDate: null,
//             totalWeight: null,
//             carrierName: null,
//             trackingId: null,
//             arrivalDate: null,
//             totalPackages: null,
//             totalPallets: null
//         },
//     ]
// }

// const map = new Map([
//     ['date', '12 Jan 2024'],
// ]);

// const string = JSON.stringify(purchaseOrderData); //?
// const string2 = JSON.stringify(map); //?

// ----------------------------------------------------------------------------------------------------------------------------
// display the difference between preincrement and postincrement
