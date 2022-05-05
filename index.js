#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const store = require('connect-loki');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const bcrypt = require('bcrypt');
const config = require('./public/lib/config');
const PgPersistence = require('./public/lib/pg-persistence');
const catchError = require('./public/lib/catch-error');

const host = config.HOST;
const port = config.PORT || 3000;
const saltRounds = 10;

const app = express();
const LokiStore = store(session);

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: '/',
    secure: false,
  },
  name: 'seen-session-id',
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  req.session.signedIn = false;
  next();
});

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, host, () => {
  console.log(`listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/app.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signup.html'));
});

app.post(
  '/signup',
  catchError(async (req, res, next) => {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { pw } = req.body;

    const hash = bcrypt.hashSync(pw, saltRounds);
    const results = await res.locals.store.addUser(firstName, lastName, email, hash);
    res.json(results);
  }),
);

app.post(
  '/signin',
  catchError(async (req, res) => {
    const email = req.body.email.trim();
    const password = String(req.body.pw);

    const hash = await res.locals.store.getHashedPw(email);

    if (hash) {
      if (bcrypt.compareSync(password, String(hash))) {
        const results = await res.locals.store.signIn(email);
        const firstName = results.first_name;
        req.session.username = firstName;
        req.session.signedIn = true;
        res.json([results, await res.locals.store.getFullProviders()]);
      } else {
        res.json(null);
      }
    }
  }),
);

app.post(
  '/signout',
  catchError(async (req, res) => {
    req.session.username = null;
    req.session.signedIn = false;
    res.json(true);
  }),
);

app.get(
  '/providers',
  catchError(async (req, res) => {
    const providers = await res.locals.store.getPartialProviders();
    res.json(providers);
  // res.json(await res.locals.store.getPartialProviders());
  }),
);
