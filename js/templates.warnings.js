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

function getEmailValidationTemplate() {
  return `
  <div class="error-warning">
    <div class="countdown">5</div>
    <p class="email-warning-title">Email must meet the following requirements:</p>
    <ul class="email-warning-list">
      <li>Must contain exactly one "@" symbol</li>
      <li>"@" must not be the first character</li>
      <li>"@" must not appear more than once</li>
      <li>Must contain at least one "." character</li>
      <li>"." must not be the last character</li>
    </ul>
  </div>
  `.trim();
}

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
