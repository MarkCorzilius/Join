window.addEventListener("DOMContentLoaded", () => {
  animateSplash();
});

function animateSplash() {
  let logo = document.getElementById("mainLogo");
  let mobileLogo = document.getElementById("mobileLogo");
  let splash = document.querySelector(".splash-logo-container");

  if (!splash || !logo || !mobileLogo) return;

  let isMobile = window.innerWidth <= 1000;

  if (isMobile) {
    mobileLogo.style.display = "flex";
    logo.style.display = "flex";
    logo.classList.add("mobile-animate");

    mobileLogo.classList.add("animate-logo");

    setTimeout(() => {
      mobileLogo.classList.add("fade-out");
      logo.classList.add("fade-in");
    }, 600);

    setTimeout(() => {
      splash.style.backgroundColor = "transparent";
      splash.style.pointerEvents = "none";
      mobileLogo.classList.add("mobile-logo-hidden");
    }, 1300);
  } else {
    logo.classList.add("animate-logo");
    setTimeout(() => {
      splash.style.backgroundColor = "transparent";
      splash.style.pointerEvents = "none";
    }, 1300);
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
    document.getElementById('loginPassword').value = '';
    return;
  }
  showLoginTransition();
  localStorage.setItem("user", JSON.stringify({ name: contact.name, email: contact.email, id: contact.id }));
}

async function searchingForAccount({ inputEmail, inputPassword }) {
  const contacts = await getData("ourUsers/");
  if (!contacts) {
    showWarningOverlay(wrongEmailOrPasswordTemplate())
    return;
  }
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
