const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize);
const Student = require('./student')(sequelize, Sequelize);
const Fees = require('./fees')(sequelize, Sequelize);
const Budget = require('./budget')(sequelize, Sequelize);

const db = {
  User,
  Student,
  Fees,
  Budget,
  sequelize, 
  Sequelize,
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;