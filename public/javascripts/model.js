/* eslint-disable class-methods-use-this */
class Model {
  constructor(view) {
    this.view = view;
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', '/signup');
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          resolve(request.response);
        } else {
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
        }
      });
      request.send(data);
    });
  }

  signin(data) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', '/signin');
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          if (!(request.response === 'false')) {
            const data = JSON.parse(request.response);
            resolve(data);
          } else {
            reject(new Error('invalid'));
          }
        }
      });
      request.send(data);
    });
  }

  signout() {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', '/signout');
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          resolve('signed out');
        } else {
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
        }
      });
      request.send();
    });
  }

  getProviders() {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', '/providers');
      request.responseType = 'json';
      request.addEventListener('load', () => {
        const data = request.response;
        if (data && (request.status >= 200 && request.status < 400)) {
          if (data.rowCount > 0) {
            resolve(data.rows);
          }
        } else {
          resolve([]);
        }
      });
      request.send();
    });
  }

  // getFull() {
  //   return new Promise((resolve, reject) => {
  //     const request = new XMLHttpRequest();
  //     request.open('GET', '/full');
  //     request.responseType = 'json';
  //     request.addEventListener('load', () => {
  //       const data = request.response;
  //       if (request.status >= 200 && request.status < 400) {
  //         resolve(data);
  //       } else {
  //         reject(request.response);
  //       }
  //     });
  //     request.send();
  //   }).then((result) => result)
  //     .catch((error) => error);
  // }
}

export default Model;
