class Controller {
  constructor(model, signUpView, homeView) {
    this.model = model;
    this.signUpView = signUpView;
    this.homeView = homeView;
    this.signUpView.signupInit();
    this.signUpView.bindAddUser(this.addUser.bind(this));
  }

  async addUser(userData) {
    const newUserRequest = await this.model.addUser(userData);
    console.log(newUserRequest);
    if (newUserRequest !== 'null') {
      this.signUpView.userAdded();
    } else {
      this.signUpView.userNotAdded();
    }
  }
}

export default Controller;
