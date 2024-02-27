// server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Sample JSON data
const users = JSON.parse(fs.readFileSync('users.json'));

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email_id === email && u.password === password);
  if (user) {
    res.cookie('loggedIn', true);
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware to check if user is logged in
const checkLoggedIn = (req, res, next) => {
  if (req.cookies.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
};

// Home Page endpoint
app.get('/home', checkLoggedIn, (req, res) => {
  res.send('Home Page');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
