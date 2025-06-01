async function doesContactExists({ emailValue }) {
  const response = await fetch(BASE_URL + "contacts/" + ".json");
  const data = await response.json();
  const sanitizedEmailValue = sanitizeEmail(emailValue);
  for (const key in data) {
    if (data[key].email === sanitizedEmailValue) {
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
  if (name.length < 4) return;
  if (!isRealEmail(email)) {
    showNotRealEmailAlert();
    return false;
  }
  if (!isRealNumber(phone)) {
    showNotRealNumberAlert();
    return false;
  }
  return true;
}

function showNotRealEmailAlert() {
  alert(
    "Invalid email address! Please make sure your email:\n" +
      '- Contains exactly one "@" symbol\n' +
      '- Has at least one "." after the "@"\n' +
      '- The "." is not immediately after "@"\n' +
      '- The "." is not the last character\n' +
      '- The "@" is not the first character'
  );
}

function showNotRealNumberAlert() {
  alert(
    "Invalid phone number! Please make sure your phone number:\n" +
      "- Is not empty\n" +
      "- Contains only digits\n" +
      '- May start with a "+" followed by digits\n' +
      "- Does NOT contain spaces or other characters"
  );
}

function isRealNumber(number) {
  const trimmed = number.trim();

  if (!/^\+?[ \d]+$/.test(trimmed)) return false;

  const digitCount = trimmed.replace(/\D/g, "").length;

  return digitCount >= 7;
}
