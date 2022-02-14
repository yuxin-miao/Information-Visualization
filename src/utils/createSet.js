import { parseData } from "./fetchData";


/**
 * @param {Array} inputList 
 * @returns a set of items of the inputList without undefined / null ,and the spaces on both end of each string is removed
 */
function createSet(inputList) {
  return removeSpaces([...new Set(inputList)].filter(x => x !== undefined && x !== null));
}

export function extractColumn(array, colNum) {
  return array.map(x => x[colNum]);
}

function removeSpaces(list) {
  return list.map(x => x.trim());
}

/**
 * 
 * @param {Array} inputList: a list of string, each string consists of different values, separated by ',' 
 * @returns a set of all the values
 */
function setFromArrayOfStrings(inputList) {
  let tmpList = [];

  inputList.forEach(item => {
    if(item) tmpList = tmpList.concat(item.split(","));
  })
  return createSet(tmpList);
}

/******* This function should not be used again, unless need a new csv*********/
/**
 * create the set of values of some columns in the raw dataset
 * including types, studios, tags, contentWarnings, voiceActors
 */
function createSetAllData() {
  parseData((result) => {
    let rawData = result.data;

    // voice actor: only keep the name, all content after /n is deleted
    let rawVoiceActors = setFromArrayOfStrings(extractColumn(rawData, 15)); 
    const rows = [
      createSet(extractColumn(rawData, 3)), // types
      createSet(extractColumn(rawData, 5)), // studios
      setFromArrayOfStrings(extractColumn(rawData, 7)), // tags
      setFromArrayOfStrings(extractColumn(rawData, 12)), // content warnings
      rawVoiceActors.map(item => item.split('\n')[0]), // voice actors
    ]

    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    
    window.open(encodedUri);
  });
}