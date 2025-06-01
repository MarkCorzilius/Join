function signIn() {
  let loginTemplates = document.getElementById("loginTemplates");
  loginTemplates.classList.add("d-none");

  let registerTemplates = document.getElementById("registerTemplates");
  registerTemplates.classList.remove("d-none");
}

function getRegisterData() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword1").value;
  const confirmPassword = document.getElementById("registerPassword2").value;

  return { name, email, password, confirmPassword };
}

function areAllFieldsFilled({ name, email, password, confirmPassword }) {
  if (name === "" || email === "" || password === "" || confirmPassword === "") {
    return false;
  } else {
    return true;
  }
}

function hasSpecialChar(password) {
  return (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1;
}

function hasEnoughLetters(password) {
  return (password.match(/[a-zA-Z]/g) || []).length >= 5;
}

function hasEnoughNumbers(password) {
  return (password.match(/[0-9]/g) || []).length >= 3;
}

function isPasswordMatchConditions({ name, email, password, confirmPassword }) {
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }

  if (!hasSpecialChar(password)) {
    alert("Password must contain at least 1 special character.");
    return false;
  }
  if (!hasEnoughLetters(password)) {
    alert("Password must contain at least 5 letters.");
    return false;
  }
  if (!hasEnoughNumbers(password)) {
    alert("Password must contain at least 3 numbers.");
    return false;
  }

  return true;
}

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

async function isExistingContact({ name, email, password, confirmPassword }) {
  const contacts = await getData("contacts/");
  return Object.values(contacts).some((contact) => contact.email === email);
}

async function signUp(ev) {
  ev.preventDefault();
  const { name, email, password, confirmPassword } = getRegisterData();
  if (await isExistingContact({ name, email, password, confirmPassword })) {
    alert("contact with this email is already registered");
    return;
  }
  if (!areAllFieldsFilled({ name, email, password, confirmPassword })) return;
  if (!isRealEmail(email)) {
    showNotRealEmailAlert();
    return;
  }

  if (!isPasswordMatchConditions({ name, email, password, confirmPassword })) return;
  if (!isPrivacyPolicyAccepted()) return;
  await handleSignUp({ name, email, password, confirmPassword });
  await showSignUpToast();
  window.location.href = "../index.html";
}

async function handleSignUp({ name, email, password, confirmPassword }) {
  const initial = getInitials(name);
  const bg = getBackgroundForName(name);
  const icon = { initial, bg };
  contactId = Number(localStorage.getItem('contactId'));
  await putData(`ourUsers/${sanitizeEmail(email)}`, { name, email, password, icon, id: contactId });
  await putData(`contacts/${sanitizeEmail(email)}`, { name, email, icon, phone: "", id: contactId });
  contactId += 1;
  localStorage.setItem('contactId', contactId);
  emptyRegisterData();
}

function updateCheckboxIcon(isHovered = false) {
  const icon = document.getElementById("acceptPrivacy");
  const accepted = icon.classList.contains("accepted");

  if (accepted) {
    icon.src = isHovered ? "../img/checkbox_checked_hovered.png" : "../img/checkbox_checked_unhovered.png";
  } else {
    icon.src = isHovered ? "../img/checkbox_unchecked_hovered.png" : "../img/checkbox_unchecked_unhovered.png";
  }
}

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

function emptyRegisterData() {
  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword1").value = "";
  document.getElementById("registerPassword2").value = "";
}

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

async function showSignUpToast() {
  const toast = document.getElementById("registerBanner");
  toast.classList.add('visible');

  await new Promise((resolve) => {
    setTimeout(() => {
      toast.classList.remove('visible');
      resolve();
    }, 1700);  
  })
}
