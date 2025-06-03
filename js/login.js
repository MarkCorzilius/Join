window.addEventListener("DOMContentLoaded", () => {
  applyFadeEffectsToLoginSections();
  disableSplashInteraction();
});

function applyFadeEffectsToLoginSections() {
  const header = document.querySelector(".log-in-header");
  const main = document.querySelector(".log-in-main");
  const footer = document.querySelector(".log-in-footer");

  if (header && main && footer) {
    header.classList.add("fade-header");
    main.classList.add("fade-main");
    footer.classList.add("fade-footer");
  }
}

function disableSplashInteraction() {
  const splash = document.querySelector(".splash-logo-container");

  if (splash) {
    splash.style.pointerEvents = "none";
    splash.style.zIndex = "0";
  }
}

function guestLogin() {
  const guest = "Guest";
  localStorage.setItem("user", JSON.stringify({ name: guest, email: "guest@example.com" }));

  setTimeout(() => {
    window.location.href = "./templates/summary.html";
  }, 300);
}

function storeLogInData() {
  const inputEmail = document.getElementById("loginEmail").value.trim();
  const inputPassword = document.getElementById("loginPassword").value.trim();
  return { inputEmail, inputPassword };
}

async function logIn(ev) {
  ev.preventDefault();
  const { inputEmail, inputPassword } = storeLogInData();
  if (!inputEmail || !inputPassword) {
    showFailureAlert();
    return;
  }
  const contact = await searchingForAccount({ inputEmail, inputPassword });
  if (!contact) {
    return
  }
  showLoginTransition();
  localStorage.setItem("user", JSON.stringify({ name: contact.name, email: contact.email, id: contact.id }));
}

async function searchingForAccount({ inputEmail, inputPassword }) {
  const contacts = await getData("ourUsers/");
  for (const contact of Object.values(contacts)) {
    if (contact.email === inputEmail && contact.password === inputPassword) {
      return contact;
    }
  }
  showWarningOverlay(wrongEmailOrPasswordTemplate())
  return;
}

function showFailureAlert() {
  const container = document.getElementById("wrongDataAlert");
  container.style.display = "block";
}

function showLoginTransition() {
  setTimeout(() => {
    window.location.href = "./templates/summary.html";
  }, 500);
}

async function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours());
  return hours;
}

function setViewerStateLocalStorage() {
  const viewer = "Viewer";
  localStorage.setItem("user", JSON.stringify({ name: viewer, email: "viewer@example.com" }));
}
