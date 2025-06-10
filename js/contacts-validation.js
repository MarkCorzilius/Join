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

  if (!hasBasicEmailStructure(trimmed, atIndex)) return false;

  const domainPart = trimmed.slice(atIndex + 1);
  if (!checkDotConditions(trimmed, domainPart)) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}


function hasBasicEmailStructure(trimmed, atIndex) {
  return (
    atIndex > 0 &&
    atIndex === trimmed.lastIndexOf("@") &&
    atIndex < trimmed.length - 1
  );
}


function checkDotConditions(trimmed, domainPart) {
  return (
    domainPart.includes(".") &&
    !domainPart.endsWith(".") &&
    !trimmed.includes("..")
  );
}