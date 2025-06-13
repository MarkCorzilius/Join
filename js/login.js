window.addEventListener("DOMContentLoaded", () => {
  animateSplash();
});


/**
 * Triggers splash screen animation based on screen size.
 */
function animateSplash() {
  const logo = document.getElementById("mainLogo");
  const mobileLogo = document.getElementById("mobileLogo");
  const splash = document.querySelector(".splash-logo-container");

  if (!splash || !logo || !mobileLogo) return;

  const isMobile = window.innerWidth <= 1000;
  if (isMobile) {
    animateMobileSplash(logo, mobileLogo, splash);
  } else {
    animateDesktopSplash(logo, splash);
  }
}


/**
 * Handles splash animation for mobile devices.
 * @param {HTMLElement} logo - Main logo element.
 * @param {HTMLElement} mobileLogo - Mobile logo element.
 * @param {HTMLElement} splash - Splash container.
 */
function animateMobileSplash(logo, mobileLogo, splash) {
  showLogos(logo, mobileLogo);
  startMobileAnimations(logo, mobileLogo);

  setTimeout(() => {
    fadeMobileToMainLogo(logo, mobileLogo);
  }, 600);

  setTimeout(() => {
    hideSplashMobile(mobileLogo, splash);
  }, 1300);
}


/**
 * Handles splash animation for desktop screens.
 * @param {HTMLElement} logo - Main logo element.
 * @param {HTMLElement} splash - Splash container.
 */
function animateDesktopSplash(logo, splash) {
  logo.classList.add("animate-logo");
  setTimeout(() => {
    hideSplash(splash);
  }, 1300);
}


/**
 * Displays both mobile and main logos.
 * @param {HTMLElement} logo - Main logo element.
 * @param {HTMLElement} mobileLogo - Mobile logo element.
 */
function showLogos(logo, mobileLogo) {
  mobileLogo.style.display = "flex";
  logo.style.display = "flex";
}


/**
 * Starts animation classes for mobile view.
 * @param {HTMLElement} logo - Main logo element.
 * @param {HTMLElement} mobileLogo - Mobile logo element.
 */
function startMobileAnimations(logo, mobileLogo) {
  logo.classList.add("mobile-animate");
  mobileLogo.classList.add("animate-logo");
}


/**
 * Fades out mobile logo and fades in main logo.
 * @param {HTMLElement} logo - Main logo element.
 * @param {HTMLElement} mobileLogo - Mobile logo element.
 */
function fadeMobileToMainLogo(logo, mobileLogo) {
  mobileLogo.classList.add("fade-out");
  logo.classList.add("fade-in");
}


/**
 * Hides splash screen and mobile logo after animation.
 * @param {HTMLElement} mobileLogo - Mobile logo element.
 * @param {HTMLElement} splash - Splash container.
 */
function hideSplashMobile(mobileLogo, splash) {
  splash.style.backgroundColor = "transparent";
  splash.style.pointerEvents = "none";
  mobileLogo.classList.add("mobile-logo-hidden");
}


/**
 * Hides splash screen after animation (desktop).
 * @param {HTMLElement} splash - Splash container.
 */
function hideSplash(splash) {
  splash.style.backgroundColor = "transparent";
  splash.style.pointerEvents = "none";
}


/**
 * Logs in a guest user by storing dummy user data in localStorage
 * and redirects to the summary page after a short delay.
 */
function guestLogin() {
  const guest = "Guest";
  localStorage.setItem("user", JSON.stringify({ name: guest, email: "guest@example.com", id: "x" }));

  setTimeout(() => {
    window.location.href = "./templates/summary.html";
  }, 300);
}


/**
 * Retrieves and trims login input values from the form.
 * @returns {{ inputEmail: string, inputPassword: string }}
 */
function storeLogInData() {
  const inputEmail = document.getElementById("loginEmail").value.trim();
  const inputPassword = document.getElementById("loginPassword").value.trim();
  return { inputEmail, inputPassword };
}


/**
 * Handles the login process: validates input, checks credentials,
 * shows transition, and stores user data in localStorage.
 * @param {Event} ev - The form submit event.
 */
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


/**
 * Searches stored user accounts for matching email and password.
 * @param {{ inputEmail: string, inputPassword: string }} credentials
 * @returns {Promise<Object|undefined>} The matching user object, if found.
 */
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


/**
 * Displays an alert for empty or invalid login input.
 */
function showFailureAlert() {
  const container = document.getElementById("wrongDataAlert");
  container.style.display = "block";
}


/**
 * Delays briefly before redirecting to the summary page.
 */
function showLoginTransition() {
  setTimeout(() => {
    window.location.href = "./templates/summary.html";
  }, 500);
}


/**
 * Gets the current hour as a string.
 * @returns {Promise<string>} Current hour in 24h format.
 */
async function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours());
  return hours;
}


/**
 * Sets a dummy "Viewer" user in localStorage.
 */
function setViewerStateLocalStorage() {
  const viewer = "Viewer";
  localStorage.setItem("user", JSON.stringify({ name: viewer, email: "viewer@example.com" }));
}