const express = require('express');
const db = require('./models');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true // Optional: enable credentials (e.g., cookies/auth headers)
}));

app.use(express.json());

app.use('/users/signup', require('./authentication/signup'));
app.use('/users/login', require('./authentication/login'));
app.use('/users/change-password', require('./authentication/changePassword'));
app.use('/users/student', require('./students/createStudent'));
app.use('/users/student', require('./students/getStudents'));
app.use('/users/fees', require('./students/payFess'));
app.use('/users/fees', require('./students/getFees'));
app.use('/users/budget', require('./budget/createBudget'));
app.use('/users/budget', require('./budget/pendingBudget'));
app.use('/users/budget', require('./budget/updateBudget'));
app.use('/users/budgets', require('./budget/myBudgets'));
app.use('/users/balance', require('./budget/getBalance'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
