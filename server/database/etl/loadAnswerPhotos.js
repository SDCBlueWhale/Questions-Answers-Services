const fs = require('fs');
const fastcsv = require('fast-csv');
const { AnswerPhoto } = require('../db');
let stream = fs.createReadStream('/Users/jacksonzhu/Desktop/Hack Reactor Precourse/Questions-Answers-Services/CSVData/answers_photos.csv');

async function loadData() {
  console.log('load');
  let csvData = [];
  let hasHeader = true;
  let index = 0;
  let csvStream = fastcsv
    .parse()
    .on('data', async function(data) {
      let obj = {
        id: Number(data[0]),
        AnswerId: Number(data[1]),
        url: String(data[2]),

      }

      if(hasHeader) {
        hasHeader = false;
      } else {
        csvData.push(obj);
      }
    })
    .on('end', async function() {
      // csvData.shift();
      let chunk = [];
      let index = 0;
      for(let i = 0; i < csvData.length; i++) {
        chunk[index] = csvData[i];
        if(index >= 25000) {
          await AnswerPhoto.bulkCreate(chunk);
          index = 0;
        } else {
          index++;
        }

      }
      chunk = chunk.slice(0, index);
      await AnswerPhoto.bulkCreate(chunk);
    })

    stream.pipe(csvStream);
}



loadData();