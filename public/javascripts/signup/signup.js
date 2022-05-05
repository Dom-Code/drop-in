import Controller from './signupController.js';
import Model from '../model.js';
import SignUpView from './signUpView.js';
import View from '../view.js';

class App {
  constructor() {
    this.model = new Model();
    this.signUpView = new SignUpView();
    this.controller = new Controller(this.model, this.signUpView);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
