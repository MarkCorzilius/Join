let currOverlay = 1;
const paths = ["summary.", "add_task", "board", "contacts", "help.html", "privacy_policy", "legal_notice"];

document.addEventListener("DOMContentLoaded", () => {
  const check = setInterval(() => {
    const warning = document.getElementById("landscapeWarning");
    if (!warning) return;
    clearInterval(check);
    function toggleLandscapeWarning() {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth < 800;
      warning.classList.toggle("d-none", !(isLandscape && isMobile));
    }
    toggleLandscapeWarning();
    window.addEventListener("resize", toggleLandscapeWarning);
  }, 100);
});

async function showLegalNoticeAndPrivacyPolicy() {
  w3.includeHTML();
  try {
    await waitForInclude();
    initializeLegalNoticePage();
  } catch (error) {
    console.log("error in showLegalNoticeAndPrivacyPolicy():", error);
  }
}

function waitForInclude() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      const sidebarLoaded = document.querySelector("#sidebar");
      const headerLoaded = document.querySelector("#header");
      if (sidebarLoaded && headerLoaded) {
        clearInterval(checkExist);
        resolve();
      }
    }, 50);
  });
}

function initializeLegalNoticePage() {
  adjustSideBar();
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}

function setViewSubtask() {
  const user = JSON.stringify({ name: "Guest", email: "guest@example.com" });
  localStorage.setItem(user);
  showLegalNoticeAndPrivacyPolicy();
}

function markCurrentPage() {
  const buttons = document.querySelectorAll(".nav-button");
  paths.forEach((path, index) => {
    if (window.location.pathname.includes(path)) {
      if (buttons[index]) {
        buttons.forEach((btn) => {
          btn.classList.remove("activeBtn");
        });
        buttons[index].classList.add("activeBtn");
      }
    }
  });
}

function adjustHelpForMobile() {
  const help = document.querySelector(".dropdown-help");
  if (window.innerWidth <= 1000) {
    help.classList.remove("d-none");
  } else if (window.innerWidth > 1000) {
    help.classList.add("d-none");
  }
}

function decideCurrentTaskOverlay() {
  switch (currOverlay) {
    case "boardAddTaskOverlay":
      return "form-size";
    case "editOverlay":
      return "edit-form-size";
    default:
      return "basic-size";
  }
}

function togglePasswordVisibility(inputId, element, path) {
  const passwordInputId = document.getElementById(inputId);
  element.classList.toggle("visible");
  if (element.classList.contains("visible")) {
    passwordInputId.type = "text";
    element.src = `${path}img/password_visible.png`;
  } else {
    passwordInputId.type = "password";
    element.src = `${path}img/password_not_visible.png`;
  }
}

function closeDropdownsIfClickedOutside(event) {
  ifContactsBoxOpen(event);
  ifCategoryBoxOpen(event);
}

function ifContactsBoxOpen(event) {
  const box = document.querySelector(".dropdown-wrapper");
  const searchState = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const isSearchOpen = searchState && searchState.style.display === "flex";
  const isOptionsOpen = optionsRef && optionsRef.style.display === "flex";
  if (!isSearchOpen && !isOptionsOpen) return;
  if (!box.contains(event.target)) {
    closeContactAssignment();
  }
}

function ifCategoryBoxOpen(event) {
  const arrow = document.getElementById("categoryArrow");
  const section = document.querySelector(".category-btn-and-options");
  const optionsRef = document.querySelector(".category-options");
  if (!arrow || !section || !optionsRef) return;
  if (!section.contains(event.target)) {
    optionsRef.style.display = "none";
    isCategoryOptionsOpen(arrow, section, optionsRef);
  }
}

function showWarningOverlay(message) {
  const overlay = document.querySelector(".warning-overlay");
  const dialog = overlay.querySelector(".warning-dialog");
  dialog.innerHTML = "";
  dialog.innerHTML = message;

  overlay.classList.replace("hidden", "show");
  setTimeout(() => dialog.classList.add("show"), 10);
}

function hideWarningOverlay() {
  const overlay = document.querySelector(".warning-overlay");
  const dialog = overlay.querySelector(".warning-dialog");

  dialog.classList.remove("show");
  setTimeout(() => overlay.classList.replace("show", "hidden"), 750);
}

function isPasswordValid(password) {
  const specialCharPattern = /[^a-zA-Z0-9]/g;
  const letterPattern = /[a-zA-Z]/g;
  const numberPattern = /\d/g;

  const specialChars = (password.match(specialCharPattern) || []).length;
  const letters = (password.match(letterPattern) || []).length;
  const numbers = (password.match(numberPattern) || []).length;

  if (specialChars < 1) return false;
  if (letters < 5) return false;
  if (numbers < 3) return false;

  return true;
}

function passwordWarningTemplate() {
  return `
<div class="email-warning">
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
<div class="email-warning">
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
<div class="email-warning">
  <p class="email-warning-title">Email already exists:</p>
  <ul class="email-warning-list">
    <li>Please use a different email address</li>
  </ul>
</div>
`.trim();
}

function getEmailValidationTemplate() {
  return `
<div class="email-warning">
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
<div class="email-warning">
  <p class="email-warning-title">Login error:</p>
  <ul class="email-warning-list">
    <li>Wrong email or password</li>
    <li>Please check your credentials and try again</li>
  </ul>
</div>
`.trim();
}
