## Tech Stack
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

## Running Locally

Questions and Answers service consists of two parts, an API server and a postgres instance.

## From Source

Install dependencies and load csv files into postgres (csv files not provided)

```
$ npm install
$ node loadAnswerPhotos.js
$ node loadAnswers.js
$ node loadQuestions.js
```

## Endpoints

```
/qa/questions/:id/:page/:count
```

```
/qa/questions/:question_id/answers
```

```
/qa/questions
```

```
/qa/questions/:question_id/answers
```

```
/qa/questions/:question_id/helpful
```

```
/qa/questions/:question_id/report
```

```
/qa/answers/:answer_id/helpful
```

```
/qa/answers/:answer_id/report
```
