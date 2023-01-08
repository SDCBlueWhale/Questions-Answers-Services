const { Answer, Question, AnswerPhoto, sequelize } = require('./database/db');

const getProductQuestions = async (productID, page, count) => {
  let productQuestions = await Question.findAll({
    benchmark: true,
    logging: console.log,
    include: [{
      model: Answer, include: [{model:AnswerPhoto}],
    }],
    where: {
      product_id: productID,
    },
  })
  productQuestions = JSON.stringify(productQuestions);
  productQuestions = JSON.parse(productQuestions);

  let startIndex = count * (page - 1);
  let filteredData = productQuestions.slice(startIndex, startIndex + count );
  let finalData = {}
  finalData['product_id'] = 5;
  finalData['results'] = filteredData
  for(let i = 0; i < finalData['results'].length; i++) {
    finalData['results'][i]['question_id'] = finalData['results'][i]['id'];
    delete finalData['results'][i]['asker_email'];
    delete finalData['results'][i]['id'];
    let answers = {};
    for(let n = 0; n < finalData['results'][i]['Answers'].length; n++) {
      answers[finalData['results'][i]['Answers'][n]['id']] = finalData['results'][i]['Answers'][n]
    }
    finalData['results'][i]['Answers'] = answers;
  }
  return finalData;
}
const getAnswers = async(questionID, page, count) => {
  let data = await Answer.findAll({
    include: [{
      model: AnswerPhoto
    }],
    where: {
      'QuestionId': questionID,
      'reported': false,
    }
  })
  data = JSON.stringify(data);
  data = JSON.parse(data);
  for(let i = 0; i < data.length; i++) {
    delete data[i]['QuestionId'];
    data[i]['date'] = new Date(data[1]['date']).toISOString()
    delete data[i]['reported'];
    for(let n = 0; n < data[i]['AnswerPhotos'].length; n++) {
      delete data[i]['AnswerPhotos'][n]['AnswerId'];
    }
  }
  let finalData = {};
  finalData['question'] = questionID;
  finalData['page'] = page;
  finalData['count'] = count;
  finalData['results'] = data;
  return finalData;
}

const postQuestion = async (body, name, email, productID) => {
  let date = String(new Date());
  const question = await Question.create({
    product_id: productID,
    'body': body,
    'date': date,
    'asker_name': name,
    'asker_email': email,
    //without this we get error "helpfulness cannot be null". Has something to do with allowNull and defaultValue in db.js
    'helpfulness': 0
  })
}

const postAnswer = async (questionID, body, name, email, photosArray) => {
  let date = String(new Date());
  const answer = await Answer.create({
    "body": body,
    "date": date,
    //default value set at 0 and allowNull set as false. not sure why I have to manually do it. report has same config i believe and it works.
    "helpfullness": 0,
    "answerer_name": name,
    "answerer_email": email,
  })

  let row = await sequelize.query('SELECT COUNT(*) FROM "Answers";');
  row = (Number(row[0][0]["count"]));

  photosArray.forEach((photo) => {
    const answerPhoto = AnswerPhoto.create({
      "url": photo,
      "AnswerId": row
    })
  })
}

const changeQuestionHelpful = async (questionID) => {
  Question.increment('helpfulness', {by: 1, where: {id: questionID}});

}

const toggleQuestionReport = async (questionID) => {
  Question.update(
    {reported: true},
    {where: {
      id: questionID,
    }}
  );
}

const changeAnswerHelpful = async (answerID) => {
  Answer.increment('helpfulness', {by: 1, where: {id: answerID}});

}

const toggleAnswerReport = async (answerID) => {
  Answer.update(
    {reported: true},
    {where: {
      id: answerID,
    }}
  );
}

module.exports.getProductQuestions = getProductQuestions;
module.exports.getAnswers = getAnswers;
module.exports.postQuestion = postQuestion;
module.exports.postAnswer = postAnswer;
module.exports.changeQuestionHelpful = changeQuestionHelpful;
module.exports.toggleQuestionReport = toggleQuestionReport;
module.exports.changeAnswerHelpful = changeAnswerHelpful;
module.exports.toggleAnswerReport = toggleAnswerReport;
