import Papa from 'papaparse';

/** For the usage of this function, check src/components/main/index.js, which call parseData and add addtional data process*/

/***
 * function used to download the original Anime dataset (https://www.kaggle.com/vishalmane10/anime-dataset-2022)
 * @param {function} complete: a callback function that would be called after download success
 */
export function parseData(complete) {
  Papa.parse('https://raw.githubusercontent.com/yuxin-miao/silver-doodles/main/Anime.csv', { 
      download: true,
      dynamicTyping: true,
      complete: complete
  });
}

/**
 * function used to download the set of all data, for this csv creation check src/utils/createSet.js
 * @param {function} complete: a callback function that would be called after download success 
 */
export function parseSetData(complete) {
  Papa.parse('https://raw.githubusercontent.com/yuxin-miao/silver-doodles/main/setOfData.csv', { 
      download: true,
      dynamicTyping: true,
      complete: complete
  });
}