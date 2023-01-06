const fs = require('fs');
const fastcsv = require('fast-csv');
const { Question, sequelize } = require('../db');
let stream = fs.createReadStream('/Users/jacksonzhu/Desktop/Hack Reactor Precourse/Questions-Answers-Services/CSVData/questions.csv');


async function loadData() {
  console.log('load3')
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
        product_id: Number(data[1]),
        body: String(data[2]),
        date: String(data[3]),
        asker_name: String(data[4]),
        asker_email: String(data[5]),
        reported: Boolean(Number(data[6])),
        helpfulness: Number(data[7]),
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
          await Question.bulkCreate(chunk);
          index = 0;
        } else {
          index++;
        }

      }
      chunk = chunk.slice(0, index);
      await Question.bulkCreate(chunk);
    })

    stream.pipe(csvStream);
}


loadData();

// // const data = await Model.Question.create({
// //   id: row[0],
// //   product_id: row[1],
// //   body: row[2],
// //   date: row[3],
// //   helpfulness: row[4],
// //   asker_name: row[5],
// //   asker_email: row[6],
// //   reported: row[7],
// // })

// DROP TABLE "AnswerPhotos";
// DROP TABLE "Answers";
// DROP TABLE "Questions";