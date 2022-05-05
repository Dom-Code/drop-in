class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindSignin(this.signin.bind(this));
    this.view.bindSignout(this.signout.bind(this));
    this.view.bindGetProviders(this.getProviders.bind(this));
    this.view.init();
  }

  async signin(data) {
    const signinRequest = await this.model.signin(data);
    if (signinRequest) {
      const providersData = signinRequest[1];
      this.view.signedIn = true;
      this.view.userName = signinRequest[0].first_name;
      this.view.closeSignIn();
      this.view.checkSignedIn();
      this.getProviders(providersData);
      this.view.providers = providersData;
    } else {
      this.view.incorrectLogin();
      console.log('not signed in.');
    }
  }

  async signout() {
    await this.model.signout();
    this.view.signedIn = false;
    this.view.userName = '';
    this.getProviders();
  }

  // async getFull() {
  //   const providers = await this.model.getFull();
  //   this.view.fullProviders = providers;
  // }

  async getProviders(prov) {
    let providers;
    if (!prov) {
      const result = await this.model.getProviders();
      console.log(result);
      if (Array.isArray(result)) {
        providers = result;
      } else {
        providers = [];
      }
    } else {
      providers = prov;
    }
    this.view.providers = providers;
    this.view.buildProvidersTemplate(providers);
    this.view.clearSelect();
    this.view.loadCities(providers);
    this.view.loadSpecialties(providers);
    this.view.enableFilter();
  }
}

export default Controller;
