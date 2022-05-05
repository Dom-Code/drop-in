/* eslint-disable class-methods-use-this */
class SignUpView {
  constructor() {
    this.form = document.querySelector('#signup-form');
    this.inputs = document.querySelectorAll('.signup-input');
    this.homeButton = document.querySelector('#signup-home-button');
    this.enableHomeButton();
  }

  bindAddUser(func) {
    this.addUser = func;
  }

  signupInit() {
    this.enableSubmit();
    this.enableInvalid();
    this.enableSeePw();
  }

  enableSeePw() {
    const eyes = document.querySelectorAll('.fa-eye');
    eyes.forEach((e) => {
      const input = e.previousElementSibling;
      e.addEventListener('click', () => {
        if (input.type === 'password') {
          input.setAttribute('type', 'text');
        } else if (input.type === 'text') {
          input.setAttribute('type', 'password');
        }
      });
    });
  }

  enableSubmit() {
    this.form.addEventListener('submit', (event) => {
      this.removeAllInvalidMessages();
      event.preventDefault();
      this.inputs.forEach((inp, index) => {
        if (index === 0 || index === 1) {
          if (inp.value.match(/^[a-zA-Z]+$/)) {
            this.hideInvalidMessage(inp);
          } else {
            this.showInvalidMessage(inp);
          }
        } else if (index === 2) {
          if (inp.value.match(/\w*\.*@\w*\.\w*/)) {
            this.hideInvalidMessage(inp);
          } else {
            this.showInvalidMessage(inp);
          }
        } else if (index === 3) {
          if ((inp.value.match(/[A-Z]+/)
          && inp.value.match(/[!@#$%^&*?]+/)
          && inp.value.match(/\d+/))
          && inp.value.length > 8 && inp.value.length < 16) {
            inp.classList.remove('invalid');
            inp.parentElement.lastElementChild.classList.add('hidden');
          } else {
            inp.classList.add('invalid');
            inp.parentElement.lastElementChild.classList.remove('hidden');
          }
        } else if (index === 4) {
          if (inp.value === this.inputs[3].value) {
            inp.classList.remove('invalid');
            inp.parentElement.lastElementChild.classList.add('hidden');
          } else {
            inp.classList.add('invalid');
            inp.parentElement.lastElementChild.classList.remove('hidden');
          }
        }
      });
      let isValid = true;
      this.inputs.forEach((input) => {
        if (input.classList.contains('invalid')) {
          isValid = false;
        }
      });

      if (isValid) {
        const keysAndValues = [];

        for (let index = 0; index < this.inputs.length; index += 1) {
          const element = this.inputs[index];
          let key;
          let value;

          if (element.type !== 'submit') {
            key = encodeURIComponent(element.name);
            value = encodeURIComponent(element.value);
            keysAndValues.push(`${key}=${value}`);
          }
        }

        const data = keysAndValues.join('&');
        this.addUser(data);
      }
    });
  }

  hideInvalidMessage(inp) {
    inp.classList.remove('invalid');
    inp.nextElementSibling.classList.add('hidden');
  }

  showInvalidMessage(inp) {
    inp.classList.add('invalid');
    inp.nextElementSibling.classList.remove('hidden');
  }

  removeAllInvalidMessages() {
    const messages = document.querySelectorAll('.invalid-response');
    messages.forEach((mes) => {
      if (!mes.classList.contains('hidden')) {
        mes.classList.add('hidden');
      }
    });
  }

  enableInvalid() {
    this.inputs.forEach((inp) => {
      inp.addEventListener('focus', () => {
        // inp.setAttribute('required', '');
      });
    });
  }

  enableHomeButton() {
    this.homeButton.addEventListener('click', () => {
      window.location.replace('/');
    });
  }

  userAdded() {
    const modalLayer = document.querySelector('#modal-layer');
    modalLayer.classList.remove('hidden');

    setTimeout(() => {
      this.homeButton.click();
    }, '1500');
  }

  userNotAdded() {
    alert('Email is already used. Please try signing in');
  }
}

export default SignUpView;
