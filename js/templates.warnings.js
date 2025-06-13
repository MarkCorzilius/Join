/**
 * Returns a warning template for invalid password requirements.
 * @returns {string} HTML string for password warning.
 */
function passwordWarningTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Password requirements:</p>
    <ul class="email-warning-list">
      <li>Password must contain at least 1 special character.</li>
      <li>Password must contain at least 5 letters.</li>
      <li>Password must contain at least 3 numbers.</li>
    </ul>
  </div>
  `.trim();
}

/**
 * Returns a warning template for mismatched passwords.
 * @returns {string} HTML string for password mismatch warning.
 */
function passwordsNotMatchTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Password requirements:</p>
    <ul class="email-warning-list">
      <li>Passwords do not match</li>
      <li>Ensure both entries are identical</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template when the entered email already exists.
 * @returns {string} HTML string for email exists warning.
 */
function emailExistsTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Email already exists:</p>
    <ul class="email-warning-list">
      <li>Please use a different email address</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template for an invalid phone number format.
 * @returns {string} HTML string for phone number validation error.
 */
function invalidPhoneNumberTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Invalid phone number:</p>
    <ul class="email-warning-list">
      <li>The number must contain at least 7 digits</li>
      <li>Only digits, spaces, hyphens, parentheses, dots, and an optional "+" are allowed</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template for invalid email format.
 * @returns {string} HTML string for email format error.
 */
function getEmailValidationTemplate() {
  return `
    <div class="error-warning">
      <div class="countdown">5</div>
      <p class="email-warning-title">Please enter a valid email address.</p>
    </div>
  `.trim();
}


/**
 * Returns a warning template for login errors (wrong email/password).
 * @returns {string} HTML string for login error message.
 */
function wrongEmailOrPasswordTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Login error:</p>
    <ul class="email-warning-list">
      <li>Wrong email or password</li>
      <li>Please check your credentials and try again</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template for missing task fields.
 * @returns {string} HTML string for task validation error.
 */
function taskMissingFieldsTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Missing required fields:</p>
    <ul class="email-warning-list">
      <li>Title is required</li>
      <li>Due date must be set</li>
      <li>At least one contact must be assigned</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template when a task due date is in the past.
 * @returns {string} HTML string for past due date error.
 */
function taskDateInPastTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Invalid date selected:</p>
    <ul class="email-warning-list">
      <li>The selected due date is in the past</li>
      <li>Please choose a date in the future</li>
    </ul>
  </div>
  `.trim();
}


/**
 * Returns a warning template for an invalid or incomplete name.
 * @returns {string} HTML string for name validation error.
 */
function invalidNameTemplate() {
  return `
    <div class="error-warning">
      <div class="countdown">5</div>
      <p class="email-warning-title">Invalid name provided:</p>
      <ul class="email-warning-list">
        <li>The name seems too short to be valid</li>
        <li>Please enter your full, real name</li>
      </ul>
    </div>
    `.trim();
}


/**
 * Returns a warning template when not all fields are completed.
 * @returns {string} HTML string for incomplete form fields.
 */
function incompleteFieldsTemplate() {
  return `
    <div class="error-warning">
      <div class="countdown">5</div>
      <p class="email-warning-title">Some fields are missing:</p>
      <ul class="email-warning-list">
        <li>All fields must be filled out before submitting</li>
        <li>Please complete the form to proceed</li>
      </ul>
    </div>
    `.trim();
}
