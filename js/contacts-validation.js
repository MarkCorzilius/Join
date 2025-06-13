/**
 * Checks if a contact with the given email already exists in Firebase, excluding the current contact.
 * @param {string} emailValue - The email to check for duplication.
 * @returns {Promise<boolean>} - True if a different contact with the email exists, false otherwise.
 */
async function doesContactExists(emailValue) {
  const response = await fetch(BASE_URL + "contacts" + ".json");
  const data = await response.json();
  if (!data) return false;
  for (const key in data) {
    if (data[key].email === emailValue) {
      if (emailValue === currentContact.email) continue;
      return true;
    }
  }
  return false;
}


/**
 * Validates the presence and uniqueness of the "@" character in an email string.
 * @param {string} trimmed - The trimmed email string.
 * @param {number} atIndex - The index of the first "@" character.
 * @returns {boolean} - True if there is exactly one "@" character, false otherwise.
 */
function checkAtConditions(trimmed, atIndex) {
  if (atIndex === -1) return false;
  if (trimmed.indexOf("@", atIndex + 1) !== -1) return false;
  return true;
}


/**
 * Validates contact input fields and shows appropriate warnings if invalid.
 * @param {string} email - The contact's email address.
 * @param {string} phone - The contact's phone number.
 * @param {string} name - The contact's name.
 * @returns {Promise<boolean|undefined>} - True if all inputs are valid, false otherwise or undefined on short name.
 */
async function validateContactInputs(email, phone, name) {
  if (name.length < 4) {
    showWarningOverlay(invalidNameTemplate());
    return;
  }
  if (!isRealEmail(email)) {
    showWarningOverlay(getEmailValidationTemplate())
    return false;
  }
  if (!isRealNumber(phone)) {
    showWarningOverlay(invalidPhoneNumberTemplate())
    return false;
  }
  return true;
}


/**
 * Validates if a string is a plausible phone number.
 * Allows digits, spaces, parentheses, dashes, and an optional leading plus.
 * Requires at least 7 digits.
 * @param {string} number - The phone number string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isRealNumber(number) {
  const trimmed = number.trim();
  if (!/^\+?[0-9\s\-().]+$/.test(trimmed)) return false;
  const digitCount = trimmed.replace(/\D/g, "").length;
  return digitCount >= 7;
}


/**
 * Validates an email string for basic structure and format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isRealEmail(email) {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");

  if (!hasBasicEmailStructure(trimmed, atIndex)) return false;

  const domainPart = trimmed.slice(atIndex + 1);
  if (!checkDotConditions(trimmed, domainPart)) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}


/**
 * Checks if the email has exactly one "@" character and it's not at the start or end.
 * @param {string} trimmed - The trimmed email string.
 * @param {number} atIndex - Index of the "@" character.
 * @returns {boolean} - True if basic structure is valid, false otherwise.
 */
function hasBasicEmailStructure(trimmed, atIndex) {
  return (
    atIndex > 0 &&
    atIndex === trimmed.lastIndexOf("@") &&
    atIndex < trimmed.length - 1
  );
}


/**
 * Validates that the domain part contains a dot, does not end with a dot,
 * and the email does not contain consecutive dots.
 * @param {string} trimmed - The full trimmed email string.
 * @param {string} domainPart - The domain portion of the email.
 * @returns {boolean} - True if dot conditions are met, false otherwise.
 */
function checkDotConditions(trimmed, domainPart) {
  return (
    domainPart.includes(".") &&
    !domainPart.endsWith(".") &&
    !trimmed.includes("..")
  );
}

/**
 * Validates that all contact input fields are filled out.
 * @param {Object} param0
 * @param {string} param0.nameValue - The contact's name.
 * @param {string} param0.emailValue - The contact's email.
 * @param {string} param0.phoneValue - The contact's phone number.
 * @returns {boolean} - True if all inputs are filled, false otherwise.
 */
function validateContactData({ nameValue, emailValue, phoneValue }) {
  if (!inputsFilledOut({ nameValue, emailValue, phoneValue })) {
    showWarningOverlay(incompleteFieldsTemplate());
    return false;
  }
  return true;
}


/**
 * Validates that all edited contact input fields are filled out.
 * @param {Object} param0
 * @param {string} param0.newName - The edited contact's name.
 * @param {string} param0.newEmail - The edited contact's email.
 * @param {string} param0.newPhone - The edited contact's phone number.
 * @returns {boolean} - True if all edited inputs are filled, false otherwise.
 */
function validateEditedContactData({ newName, newEmail, newPhone }) {
  if (!inputsFilledOut({ nameValue: newName, emailValue: newEmail, phoneValue: newPhone })) {
    showWarningOverlay(incompleteFieldsTemplate());
    return false;
  }
  return true;
}