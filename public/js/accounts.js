let formElem = document.querySelector("[action='/sign-up']");

formElem.addEventListener("submit", function (event) {
  let passwordInputElem = event.currentTarget.querySelector("[type='password']");
  let password = passwordInputElem.value;

  // at least 6 characters, one symbol, one upper case, one number
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[- !"#\$%&'\(\)\*\+,\./:;<=>\?@\[\\\]\^_`{\|}~])(?=.{8,})/;
  let isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    event.preventDefault();
    event.currentTarget.classList.add("has-invalid-password");
  }
});