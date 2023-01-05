const fs = require('fs');
const fastcsv = require('fast-csv');
const { Answer } = require('../db');
let stream = fs.createReadStream('/Users/jacksonzhu/Desktop/Hack Reactor Precourse/Questions-Answers-Services/CSVData/answers.csv');

async function loadData() {
  console.log('load2');
  let csvData = [];
  let hasHeader = true;
  let index = 0;
  let csvStream = fastcsv
    .parse()
    .on('data', async function(data) {
      let time = new Date(Number(data[3]));
      time = JSON.stringify(time);
      data[3] = time;
      let obj = {
        id: Number(data[0]),
        QuestionId: Number(data[1]),
        body: String(data[2]),
        date: Date(data[3]),
        answerer_name: String(data[4]),
        answerer_email: String(data[5]),
        reported: (Boolean(data[6])),
        helpfulness: Number(data[7])
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
          await Answer.bulkCreate(chunk);
          index = 0;
        } else {
          index++;
        }

      }
      chunk = chunk.slice(0, index);
      await Answer.bulkCreate(chunk);
    })

    stream.pipe(csvStream);
}



loadData();