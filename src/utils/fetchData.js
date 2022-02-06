import Papa from 'papaparse';


export function parseData(complete) {
  Papa.parse('https://raw.githubusercontent.com/yuxin-miao/silver-doodles/main/Anime.csv', { 
      download: true,
      dynamicTyping: true,
      complete: complete
  });
}

