/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');
const { dbQuery } = require('./db-query');

module.exports = class PgPersistence {
  constructor(session) {
    this.username = session.username;
  }

  async authenticate(username, password) {
    const findHashedPW = 'SELECT password FROM users WHERE username = $1';
    const result = await dbQuery(findHashedPW, username);
    if (result.rowCount === 0) return false;

    return bcrypt.compare(password, result.row[0].password);
  }

  async addUser(...params) {
    const createUser = 'INSERT INTO users(first_name, last_name, email, pw)'
    + 'VALUES($1, $2, $3, $4)';
    const results = await dbQuery(createUser, ...params);
    console.log(results);
    results.then(() => {
      console.log('user was added');
      return true;
    }).catch(() => {
      console.log('user was not added');
      return null;
    });
    // if (results.rowCount > 0) {
    //   console.log('user was added');
    //   return true;
    // }
    // console.log('user was not added');
    // return null;
  }

  async getHashedPw(email) {
    const findHashedPW = 'SELECT pw FROM users WHERE email = $1';
    const result = await dbQuery(findHashedPW, email);
    if (result.rowCount > 0) {
      return result.rows[0].pw;
    }
    return null;
  }

  async signIn(...params) {
    const getUserData = 'SELECT first_name, last_name FROM users WHERE email = $1';
    const results = await dbQuery(getUserData, ...params);
    if (results.rowCount > 0) {
      return results.rows;
    }
    return null;
  }

  async getFullProviders() {
    const query = 'SELECT * FROM providers';
    const results = await dbQuery(query);
    if (results.rowCount > 0) {
      return results.rows;
    }
    return null;
  }

  async getPartialProviders() {
    const query = 'SELECT photo, id, first_name, last_name, city, specialty, average_app_time FROM providers;';
    let result;
    try {
      result = await dbQuery(query);
      return result;
    } catch (error) {
      console.log(error);
    }

    // const results = await dbQuery(query);
    // if (results.rowCount > 0) {
    //   return results.rows;
    // }
    // return null;
  }
};
