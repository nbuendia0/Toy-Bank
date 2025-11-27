const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const csrf = require('csurf');


const app = express();
const PORT = 3000;

// HTTPS credentials
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('req.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// In-memory user database
let users = {}; // Format: { username: { password: '...', balance: 1000 } }

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'toybank-insecure',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Enabling CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to pass CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Helpers
function isLoggedIn(req) {
  return req.session && req.session.user;
}

// Routes
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send('User already exists');
  }
  users[username] = { password, balance: 1000 };
  req.session.user = username;
  res.redirect('/');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.send('Invalid credentials');
  }
  req.session.user = username;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.post('/transfer', (req, res) => {
  if (!isLoggedIn(req)) return res.status(401).send('Login required');

  const sender = req.session.user;
  const { amount, recipient } = req.body;
  const amt = parseFloat(amount);

  if (!users[recipient]) return res.send('Recipient not found');
  if (isNaN(amt) || amt <= 0 || amt > users[sender].balance) {
    return res.send('Invalid amount');
  }

  users[sender].balance -= amt;
  users[recipient].balance += amt;
  res.redirect('/');
});

app.get('/balance', (req, res) => {
  if (!isLoggedIn(req)) return res.json({ user: null });
  const user = req.session.user;
  res.json({ user, balance: users[user].balance });
});

// Launch HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
});
