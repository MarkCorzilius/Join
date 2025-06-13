/**
 * Switches from the login view to the registration view.
 */
function signIn() {
  let loginTemplates = document.getElementById("loginTemplates");
  loginTemplates.classList.add("d-none");
  let registerTemplates = document.getElementById("registerTemplates");
  registerTemplates.classList.remove("d-none");
}


/**
 * Collects registration input values from the form.
 * @returns {{ name: string, email: string, password: string, confirmPassword: string }}
 */
function getRegisterData() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword1").value;
  const confirmPassword = document.getElementById("registerPassword2").value;
  return { name, email, password, confirmPassword };
}


/**
 * Checks if all registration fields are filled.
 * @param {{ name: string, email: string, password: string, confirmPassword: string }} data
 * @returns {boolean}
 */
function areAllFieldsFilled({ name, email, password, confirmPassword }) {
  if (name === "" || email === "" || password === "" || confirmPassword === "") {
    return false;
  } else {
    return true;
  }
}


/**
 * Checks if the password and confirmation match.
 * @param {{ password: string, confirmPassword: string }} data
 * @returns {boolean}
 */
function isPasswordMatchConditions({ name, email, password, confirmPassword }) {
  return password === confirmPassword;
}


/**
 * Validates if the privacy policy has been accepted.
 * @returns {boolean}
 */
function isPrivacyPolicyAccepted() {
  const alert = document.getElementById("privacyDiscard");
  const privacy = document.getElementById("acceptPrivacy");
  if (privacy.classList.contains("accepted")) {
    return true;
  } else {
    alert.style.display = "block";
    return false;
  }
}


/**
 * Checks if a contact with the given email already exists.
 * @param {string} email - Email to check for duplicates.
 * @returns {Promise<boolean>}
 */
async function isExistingContact(email) {
  const contacts = await getData("contacts/");
  if (!contacts) return false;
  return Object.values(contacts).some((contact) => contact.email === email);
}


/**
 * Handles the full sign-up process, including validation and redirection.
 * @param {Event} ev - The form submit event.
 */
async function signUp(ev) {
  ev.preventDefault();
  const formData = getRegisterData();

  if (!(await validateSignUpInput(formData))) return;

  await handleSuccessfulSignUp(formData);
}


/**
 * Validates all sign-up fields and shows warnings if needed.
 * @param {{ name: string, email: string, password: string, confirmPassword: string }} formData
 * @returns {Promise<boolean>} True if all validations pass.
 */
async function validateSignUpInput({ name, email, password, confirmPassword }) {
  if (await isExistingContact(email)) {
    showWarningOverlay(emailExistsTemplate());
    return false;
  }
  if (!areAllFieldsFilled({ name, email, password, confirmPassword })) {
    showWarningOverlay(incompleteFieldsTemplate());
    return false;
  }
  return validateEmailAndPassword({ email, password, confirmPassword });
}


/**
 * Validates email format, password match and strength, and privacy acceptance.
 * @param {{ email: string, password: string, confirmPassword: string }} data
 * @returns {boolean} True if all checks pass.
 */
function validateEmailAndPassword({ email, password, confirmPassword }) {
  if (!isRealEmail(email)) {
    showWarningOverlay(getEmailValidationTemplate());
    return false;
  }
  if (!isPasswordMatchConditions({ password, confirmPassword })) {
    showWarningOverlay(passwordsNotMatchTemplate());
    return false;
  }
  if (!isPasswordValid(password)) {
    showWarningOverlay(passwordWarningTemplate());
    return false;
  }
  return isPrivacyPolicyAccepted();
}


/**
 * Executes sign-up action, shows toast, and redirects.
 * @param {{ name: string, email: string, password: string, confirmPassword: string }} data
 */
async function handleSuccessfulSignUp(data) {
  await handleSignUp(data);
  await showSignUpToast();
  window.location.href = "../index.html";
}


/**
 * Handles user registration by saving user and contact data,
 * generating user ID, and clearing form fields.
 * @param {{ name: string, email: string, password: string, confirmPassword: string }} param0
 */
async function handleSignUp({ name, email, password, confirmPassword }) {
  const initial = getInitials(name);
  const bg = getBackgroundForName(name);
  const icon = { initial, bg };
  contactId = await getIdFromDataBase("contactId/");
  await putData(`ourUsers/${sanitizeEmail(email)}`, { name, email, password, icon, id: contactId });
  await putData(`contacts/${sanitizeEmail(email)}`, { name, email, icon, phone: "", id: contactId });
  contactId += 1;
  await putIdToDataBase("contactId/", contactId);
  emptyRegisterData();
}


/**
 * Updates the privacy checkbox icon based on acceptance and hover state.
 * @param {boolean} isHovered - Whether the checkbox is being hovered.
 */
function updateCheckboxIcon(isHovered = false) {
  const icon = document.getElementById("acceptPrivacy");
  const accepted = icon.classList.contains("accepted");
  if (accepted) {
    icon.src = isHovered ? "../img/checkbox_checked_hovered.png" : "../img/checkbox_checked_unhovered.png";
  } else {
    icon.src = isHovered ? "../img/checkbox_unchecked_hovered.png" : "../img/checkbox_unchecked_unhovered.png";
  }
}


/**
 * Toggles the privacy checkbox based on user interactions.
 * @param {MouseEvent} ev - The event from mouse interaction.
 */
function togglePrivacyBtn(ev) {
  const icon = document.getElementById("acceptPrivacy");
  switch (ev.type) {
    case "mouseover":
      updateCheckboxIcon(true);
      break;
    case "mouseout":
      updateCheckboxIcon(false);
      break;
    case "click":
      icon.classList.toggle("accepted");
      updateCheckboxIcon(true);
      break;
    default:
      updateCheckboxIcon(false);
      break;
  }
}


/**
 * Clears all registration input fields.
 */
function emptyRegisterData() {
  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword1").value = "";
  document.getElementById("registerPassword2").value = "";
}


/**
 * Handles hover and click behavior for the signup arrow icon.
 * @param {MouseEvent|string} ev - Mouse event or event type string.
 */
function toggleSignupArrow(ev) {
  const arrow = document.getElementById("signupArrow");
  switch (ev.type || ev) {
    case "mouseover":
      arrow.src = "../img/signup_arrow_hover.png";
      break;
    case "mouseout":
      arrow.src = "../img/signup_arrow.png";
      break;
    case "click":
      window.location.href = "../index.html";
      break;
    default:
      break;
  }
  localStorage.setItem("createContact", false);
}


/**
 * Shows a temporary toast/banner after successful sign-up.
 * Waits before hiding it again.
 */
async function showSignUpToast() {
  const toast = document.getElementById("registerBanner");
  toast.classList.add("visible");
  await new Promise((resolve) => {
    setTimeout(() => {
      toast.classList.remove("visible");
      resolve();
    }, 1700);
  });
}