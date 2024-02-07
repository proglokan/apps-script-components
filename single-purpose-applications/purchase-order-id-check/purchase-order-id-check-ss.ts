'use strict';

const data = [
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00120'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00122'],
  ['10-00203'],
  ['10-00203'],
  ['10-00203'],
  ['10-00203'],
  ['10-00209'],
  ['10-00209'],
  ['10-00209'],
  ['10-00209'],
  ['10-00209'],
  ['10-00209'],
  ['10-00213'],
  ['10-00214'],
  ['10-00215'],
  ['10-00216'],
  ['10-00222'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00218'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00220'],
  ['10-00222'],
  ['10-00223'],
  ['10-00224'],
  ['10-00222'],
]; // ? See what happens, not sure of the expected result

const test1 = [
  ['10-00122'],
  ['10-00122'],
  ['10-00123'],
  ['10-00123'],
  ['10-00122'],
  ['10-00123'],
  ['10-00123'],
  ['10-00125'],
  ['10-00124'],
  ['10-00124'],
]; // ! [3]

const test2 = [
  ['10-00123'],
  ['10-00123'],
  ['10-00123'],
  ['10-00124'],
  ['10-00125'],
  ['10-00125'],
  ['10-00125'],
  ['10-00124']
]; // ! [3, 7]

const test3 = [
  ['10-00123'],
  ['10-00123'],
  ['10-00123'],
  ['10-00124'],
  ['10-00123'],
  ['10-00125'],
  ['10-00125']
]; // ! [2, 3, 4]

const test4 = [
  ['10-00122'],
  ['10-00122'],
  ['10-00123'],
  ['10-00123'],
  ['10-00123'],
  ['10-00123'],
  ['10-00123'],
  ['10-00125'],
  ['10-00124'],
  ['10-00124'],
  ['10-00124'],
  ['10-00124'],
  ['10-00124'],
  ['10-00124'],
  ['10-00124'],
  ['10-00126'],
  ['10-00127'],
  ['10-00128'],
  ['10-00128'],
  ['10-00128'],
  ['10-00128'],
  ['10-00128'],
]; // * []

function findOutOfPlaceIds(data: string[][]): { outOfPlaceIds: string[], outOfPlacePositions: number[] } {
  const idCountMap: Map<string, number[]> = new Map();
  const outOfPlaceIds: string[] = [];
  const outOfPlacePositions: number[] = [];

  for (let x = 0; x < data.length; ++x) {
    const id = data[x][0];
    if (!idCountMap.has(id)) {
      idCountMap.set(id, []);
    }
    idCountMap.get(id)?.push(x);
  };

  for (const [id, positions] of idCountMap) {
    if (positions.length > 1) {
      for (let x = 0; x < positions.length - 1; ++x) {
        if (positions[x] !== positions[x + 1] - 1) {
          outOfPlaceIds.push(id);
          outOfPlacePositions.push(positions[x]);
        }
      }
    }
  };

  return { outOfPlaceIds, outOfPlacePositions };
}

const { outOfPlaceIds, outOfPlacePositions } = findOutOfPlaceIds(data);
outOfPlaceIds; //?
outOfPlacePositions; //?
