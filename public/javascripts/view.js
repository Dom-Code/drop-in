/* eslint-disable class-methods-use-this */

class View {
  constructor() {
    this.screens = [
      this.homeScreen = document.querySelector('#home'),
      this.howScreen = document.querySelector('#how'),
      this.findScreen = document.querySelector('#find-container'),
      this.contact = document.querySelector('#contact'),

    ];
    this.navButtons = [
      this.homeButton = document.querySelector('#home-button'),
      this.howButton = document.querySelector('#how-button'),
      this.findDoctorButton = document.querySelector('#find'),
    ];
    this.signinButton = document.querySelector('#signin-link');
    this.signinModalLayer = document.querySelector('#signin-modal-layer');
    this.signedIn = false;
    this.contactingProvider = false;
    this.userName = null;
    this.signOutDiv = document.querySelector('#signed-out');
    this.signInDiv = document.querySelector('#signed-in');
    this.providerUl = document.querySelector('#provider-list');
    this.citiesSelect = document.querySelector('#filter-city');
    this.specialtiesSelect = document.querySelector('#filter-spec');
    this.partialProviders = null;
    this.providers = null;
    this.selects = [this.specialtiesSelect, this.citiesSelect];
  }

  bindSignin(func) {
    this.signin = func;
  }

  bindSignout(func) {
    this.signout = func;
  }

  bindGetProviders(func) {
    this.getProviders = func;
  }

  init() {
    this.enableNavEvents();
    this.enableSigninButton();
    this.enableSignupButton();
    this.checkSignedIn();
    this.getProviders();
  }

  checkSignedIn() {
    if (this.signedIn) {
      this.signOutDiv.classList.add('hidden');
      this.signInDiv.classList.remove('hidden');
      this.userGreeting = document.querySelector('#user-greeting');
      this.userGreeting.textContent = `Hello ${this.userName}`;
      this.enableLogout();
    } else if (!this.signedIn) {
      if (this.signOutDiv.classList.contains('hidden')) {
        this.signOutDiv.classList.remove('hidden');
        this.signInDiv.classList.add('hidden');
        this.triggerEvent(this.homeButton, 'click');
      }
    }
  }

  closeSignIn() {
    const loggingIn = document.querySelector('#logging-in');
    this.signContainer = document.querySelector('#signin-container');
    this.signContainer.classList.add('hidden');
    this.signinForm.reset();
    loggingIn.classList.remove('hidden');

    setTimeout(() => {
      this.signinModalLayer.classList.add('hidden');
      this.signContainer.classList.remove('hidden');
      loggingIn.classList.add('hidden');
      this.hideAll();
      if (this.contactingProvider) {
        this.screens[3].classList.remove('hidden');
        this.contactingProvider = false;
      } else {
        this.homeScreen.classList.remove('hidden');
      }

      // this.navSigninButton.textContent = 'Sign out';
    }, 2000);
  }
  // this will close the signin menu from the controller file.
  // this will also switch signup/login to welcome user.

  enableLogout() {
    const logoutButton = document.querySelector('#signout-link');
    logoutButton.addEventListener('click', () => {
      this.signout();
      this.signedIn = false;
      this.checkSignedIn();
      this.hideAll();
      this.homeScreen.classList.remove('hidden');
    });
  }

  enableNavEvents() {
    this.enableHomeButton();
    this.enableHowButton();
    this.enableFindDoctorButton();
  }

  enableFindDoctorButton() {
    this.findDoctorButton.addEventListener('click', () => {
      this.clearNavButtonSelect();
      this.hideAll();
      this.findDoctorButton.classList.add('selected');
      this.findScreen.classList.remove('hidden');
      this.specialtiesSelect.selectedIndex = 0;
      this.citiesSelect.selectedIndex = 0;
      this.buildProvidersTemplate(this.providers);
    });
  }

  enableHomeButton() {
    this.homeButton = document.querySelector('#home-button');
    this.homeButton.addEventListener('click', () => {
      this.clearNavButtonSelect();
      this.hideAll();
      this.homeScreen.classList.remove('hidden');
    });
  }

  displayProviders() {
    const findNotSignedIn = document.querySelector('#find-not-signed-in');
    const findSignedIn = document.querySelector('#find-signed-in');
    if (!this.signedIn) {
      if (findNotSignedIn.classList.contains('hidden')) {
        findNotSignedIn.classList.remove('hidden');
      }
      if (!findSignedIn.classList.contains('hidden')) {
        findSignedIn.classList.add('hidden');
      }
    } else if (this.signedIn) {
      if (!findNotSignedIn.classList.contains('hidden')) {
        findNotSignedIn.classList.add('hidden');
      }
      if (findSignedIn.classList.contains('hidden')) {
        findSignedIn.classList.remove('hidden');
      }
    }
  }

  enableHowButton() {
    this.howButton = document.querySelector('#how-button');
    this.howButton.addEventListener('click', () => {
      this.clearNavButtonSelect();
      this.hideAll();
      this.howButton.classList.add('selected');
      this.howScreen.classList.remove('hidden');
    });
  }

  enableSigninButton() {
    this.signinButton.addEventListener('click', () => {
      this.signinModalLayer.classList.remove('hidden');
      this.enableCloseModal();
      this.enableSubmitButton();
    });
  }
  // enableSigninButton will add an event listener to signin button about the nav
  // It will show modal and enable the closing and submitting of signin info.

  enableSignupButton() {
    const signupButton = document.querySelector('#signup-link');
    signupButton.addEventListener('click', () => {
      window.location.replace('/signup');
    });
  }

  enableSubmitButton() {
    this.signinForm = document.querySelector('#signin-form');
    this.signinForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const keysValues = [];

      for (let i = 0; i < this.signinForm.elements.length; i += 1) {
        const element = this.signinForm.elements[i];
        let key;
        let value;

        if (element.type !== 'submit') { key = encodeURIComponent(element.name); }
        value = encodeURIComponent(element.value);
        keysValues.push(`${key}=${value}`);
      }
      const data = keysValues.join('&');
      this.signin(data);
      event.stopImmediatePropagation();
    });
  }

  hideAll() {
    this.screens.forEach((screen) => {
      if (!screen.classList.contains('hidden')) {
        screen.classList.add('hidden');
      }
    });
  }

  clearNavButtonSelect() {
    this.navButtons.forEach((button) => {
      if (button.id === 'nav-signin-button') {
        button.classList.remove('selected-signin');
      }
      button.classList.remove('selected');
    });
  }

  enableCloseModal() {
    document.addEventListener('click', (event) => {
      if (event.target.className === 'btn-close' || event.target.id === 'signin-modal-layer') {
        this.signinModalLayer.classList.add('hidden');
      }
    });
  }
  // for signup.html

  enableCloseFromSignup() {
    document.addEventListener('click', (event) => {
      if (event.target.className === 'btn-close' || event.target.id === 'signin-modal-layer') {
        // window.location.replace('/');
      }
    });
  }

  // for signup.html
  userAdded() {
    this.form.reset();
    // window.location.replace('/');
    this.signinModalLayer.classList.remove('hidden');
    this.signupForm.classList.add('hidden');
    this.enableCloseFromSignup();
  }

  loadSpecialties(providers) {
    const specialties = [];
    providers.forEach((person) => {
      if (!specialties.includes(person.specialty)) {
        specialties.push(person.specialty);
      }
    });
    const intro = document.createElement('option');
    intro.textContent = 'Search by Specialty';
    this.specialtiesSelect.appendChild(intro);
    specialties.forEach((spec) => {
      const option = document.createElement('option');
      option.textContent = spec;
      this.specialtiesSelect.appendChild(option);
    });
  }
  /*
  this will load my drop down menus with specialties
  */

  loadCities(providers) {
    const cities = [];
    providers.forEach((person) => {
      if (!cities.includes(person.city)) {
        cities.push(person.city);
      }
    });
    const intro = document.createElement('option');
    intro.textContent = 'Search by City';
    this.citiesSelect.appendChild(intro);
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.textContent = city;
      this.citiesSelect.appendChild(option);
    });
  }
  /*
  this will load my drop down menus with cities
  */

  clearSelect() {
    this.selects.forEach((sel) => {
      sel.innerHTML = '';
    });
  }

  enableFilter() {
    this.enableReset();
    this.selects.forEach((sel) => {
      sel.addEventListener('change', () => {
        const data = this.getSelectValues();
        let spec;
        let city;
        if (data[0] === 'Search by Specialty') {
          spec = null;
        } else {
          spec = data[0];
        }

        if (data[1] === 'Search by City') {
          city = null;
        } else {
          city = data[1];
        }

        this.updateProviders(spec, city);
      });
    });
  }

  enableReset() {
    const clear = document.querySelector('#clear-button');
    clear.addEventListener('click', (event) => {
      event.preventDefault();
      this.specialtiesSelect.selectedIndex = 0;
      this.citiesSelect.selectedIndex = 0;
      this.buildProvidersTemplate(this.providers);
    });
  }

  getSelectValues() {
    return this.selects.map((select) => select.value);
  }

  updateProviders(spec, city) {
    if (!spec && !city) {
      this.buildProvidersTemplate(this.providers);
      return;
    }
    const providers = [];
    if (!spec) {
      this.providers.forEach((prov) => {
        if (prov.city === city) {
          providers.push(prov);
        }
      });
    } else if (!city) {
      this.providers.forEach((prov) => {
        if (prov.specialty === spec) {
          providers.push(prov);
        }
      });
    }

    this.providers.forEach((prov) => {
      if (prov.specialty === spec && prov.city === city) {
        providers.push(prov);
      }
    });
    if (providers.length > 0) {
      this.buildProvidersTemplate(providers);
    } else {
      this.buildProvidersTemplate([]);
    }
  }

  // updateProviders gethers all the of providers that match
  // a certain criteria
  // takes specialty and city as input
  // will then pass list of providers to buildProvidersTemplate function.

  buildProvidersTemplate(providers) {
    console.log(providers);
    const providerList = Handlebars.compile(document.querySelector('#provider-list-template').innerHTML);
    const partialTemplate = document.querySelector('#partialTemplate').innerHTML;
    const partialCompiled = Handlebars.compile(partialTemplate);
    Handlebars.registerPartial('partialTemplate', partialTemplate);
    this.providerUl.innerHTML = providerList({ providers });
    this.enableProviderLinks();
  }

  enableProviderLinks() {
    this.providerUl.addEventListener('click', (event) => {
      if (event.target.closest('li')) {
        const { id } = event.target.closest('li');
        let providerInfo;

        this.providers.forEach((prov) => {
          if (prov.id === +id) {
            providerInfo = prov;
          }
        });
        this.buildProfileModal(providerInfo);
      }
      event.stopImmediatePropagation();
    });
  }

  // enableProviderLinks this enables a click event on all the providers
  // in the provider list.

  buildProfileModal(providerInfo) {
    this.profileModalLayer = document.querySelector('#profile-modal-layer');
    this.profileModalLayer.classList.remove('hidden');
    this.enableCloseProfileModal();

    const profileTemplate = document.querySelector('#profile-template').innerHTML;
    const profileContainer = document.querySelector('#profile-modal');
    const profileCompiled = Handlebars.compile(profileTemplate);
    profileContainer.innerHTML = profileCompiled(providerInfo);
    this.enableContactLink();
  }

  // this is the function that will build the template to load the providers
  // in the provider-list ul element.

  enableContactLink() {
    const contactProvider = document.querySelector('#contact-provider');
    contactProvider.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.signedIn) {
        this.hideAll();
      } else {
        this.contactingProvider = true;
        this.triggerEvent(this.signinButton, 'click');
      }
    });
  }

  // enableContactLink this opens contact information for the clicked provider.

  enableCloseProfileModal() {
    this.profileModalLayer.addEventListener('click', () => {
      this.profileModalLayer.classList.add('hidden');
    });
  }
  // enableCloseProfileModal this will close profile modals when
  // click on the outside of the modal.

  incorrectLogin() {
    const signinMessage = document.querySelector('#signin-message');
    signinMessage.classList.remove('hidden');
  }

  // incorrectLogin will create an notification that email or password was not correct.
}

export default View;
