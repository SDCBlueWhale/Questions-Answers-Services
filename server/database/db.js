const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sdc', '', '', {
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Unable to connect to database'));

const Answer = sequelize.define('Answers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  helpfulness: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  answerer_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answerer_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reported: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
});

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  asker_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  asker_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reported: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  helpfulness: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Question.hasMany(Answer);
Answer.belongsTo(Question);

const AnswerPhoto = sequelize.define('AnswerPhotos', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Answer.hasMany(AnswerPhoto);
AnswerPhoto.belongsTo(Answer);

sequelize.sync();

module.exports = { Question, Answer, AnswerPhoto };