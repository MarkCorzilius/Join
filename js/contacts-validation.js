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


function checkAtConditions(trimmed, atIndex) {
  if (atIndex === -1) return false;
  if (trimmed.indexOf("@", atIndex + 1) !== -1) return false;
  return true;
}


function checkDotConditions(trimmed, atIndex) {
  const dotIndex = trimmed.indexOf(".");
  if (dotIndex === -1) return false;
  if (atIndex === 0) return false;
  if (dotIndex === trimmed.length - 1) return false;
  return true;
}


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


function isRealNumber(number) {
  const trimmed = number.trim();

  if (!/^\+?[0-9\s\-().]+$/.test(trimmed)) return false;

  const digitCount = trimmed.replace(/\D/g, "").length;

  return digitCount >= 7;
}


function isRealEmail(email) {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  const isAtValid = checkAtConditions(trimmed, atIndex);
  const isDotValid = checkDotConditions(trimmed, atIndex);
  if (!isAtValid || !isDotValid) return false;
  return true;
}