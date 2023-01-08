const express = require('express');
require('dotenv').config()
const controller = require('./controller');
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.get('/qa/questions/:id/:page/:count', async (req, res) => {
  let id = Number(req.params.id)
  let page = Number(req.params.page);
  let count = Number(req.params.count);

  if(isNaN(page)) {
    page = 1;
  }
  if(isNaN(count)) {
    count = 5;
  }
  let data = await controller.getProductQuestions(id, page, count)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

app.get('/qa/questions/:question_id/answers', async(req, res) => {
  let questionID = Number(req.params.question_id);
  let count;
  let page;
  if(isNaN(Number(req.query.count))) {
    count = 5
  } else {
    count = req.query.count;
  }
  if(isNaN(Number(req.query.page))) {
    page = 1
  } else {
    page = req.query.page;
  }
  if(isNaN(questionID)) {
    res.send('Not a valid questionID');
  }

  let data = await controller.getAnswers(questionID, page, count)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

app.post('/qa/questions', (req, res) => {
  let body = req.body.body;
  let name = req.body.name;
  let email = req.body.email;
  let product_id = Number(req.body.product_id);

  if(!body) {
    res.send('Question body is empty');
  }
  if(!name) {
    res.send('Enter a name');
  }
  if(!email) {
    res.send('Enter a email');
  }
  if(!product_id) {
    res.send('Need product ID');
  }

  controller.postQuestion(body, name, email, product_id)
  .then(() => {
    res.status(201).send('Question Posted')
  })
  .catch((err) => {
    res.status(400).send(err)
  })
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
    let questionID = Number(req.params.question_id);
    let body = req.body.body;
    let name = req.body.name;
    let email = req.body.email;
    let photosArray = req.body.photosArray;
    if(!questionID) {
      res.send("Question ID doesn't exist");
    }
    if(!body) {
      res.send('Question body is empty');
    }
    if(!name) {
      res.send('Enter a name');
    }
    if(!email) {
      res.send('Enter a email');
    }
    if(photosArray.length === 0 || Array.isArray(photosArray) !== true) {
      res.send('Need an array of photos');
    }
    controller.postAnswer(questionID, body, name, email, photosArray)
    .then(() => {
      res.status(201).send('Answer Posted');
    })
    .catch(() => {
      res.status(400).send(err);
    })

});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let questionID = Number(req.params.question_id);
  if(isNaN(questionID)) {
    res.status(400).send('Bad id');
  }

  controller.changeQuestionHelpful(questionID)
  .then(() => {
    res.status(200).send('Marked Helpful');
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

app.put('/qa/questions/:question_id/report', async (req, res) => {
  let questionID = Number(req.params.question_id);
  if(isNaN(questionID)) {
    res.status(400).send('Bad id');
  }

  await controller.toggleQuestionReport(questionID)
  .then(() => {
    res.status(204).send('Reported');
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  let answerID = Number(req.params.question_id);
  if(isNaN(answerID)) {
    res.status(400).send('Bad id');
  }

  controller.changeAnswerHelpful(answerID)
  .then(() => {
    res.status(200).send('Marked Helpful');
  })
  .catch((err) => {
    res.status(400).send(err);
  })
})

app.put('/qa/answers/:answer_id/report', async(req, res) => {
  let answerID = Number(req.params.question_id);
  if(isNaN(answerID)) {
    res.status(400).send('Bad id');
  }

  await controller.toggleAnswerReport(answerID)
  .then(() => {
    res.status(204).send('Reported');
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

app.listen(port, () => {
  console.log(`Server Listening on port: ${port}`)});