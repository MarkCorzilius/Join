let currOverlay = 1;
const paths = ["summary.", "add_task", "board", "contacts", "help.html", "privacy_policy", "legal_notice"];


/**
 * Shows or hides the landscape mode warning on mobile devices.
 * Toggles visibility if device is mobile and in landscape orientation.
 */
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


/**
 * Loads external HTML snippets and initializes legal notice page.
 * Handles errors in loading.
 * @async
 */
async function showLegalNoticeAndPrivacyPolicy() {
  w3.includeHTML();
  try {
    await waitForInclude();
    initializeLegalNoticePage();
  } catch (error) {
    console.log("error in showLegalNoticeAndPrivacyPolicy():", error);
  }
}


/**
 * Waits until sidebar and header elements are loaded in DOM.
 * @returns {Promise<void>} Resolves when sidebar and header are present.
 */
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


/**
 * Initializes UI elements for legal notice page.
 * Adjusts sidebar, marks page, sets up user help and privacy display.
 */
function initializeLegalNoticePage() {
  adjustSideBar();
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Adds "active" class to the navigation button corresponding to current path.
 */
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


/**
 * Shows or hides help dropdown depending on window width.
 */
function adjustHelpForMobile() {
  const help = document.querySelector(".dropdown-help");
  if (window.innerWidth <= 1000) {
    help.classList.remove("d-none");
  } else if (window.innerWidth > 1000) {
    help.classList.add("d-none");
  }
}


/**
 * Determines CSS class for task overlay size based on current overlay state.
 * @returns {string} The class name for the overlay size.
 */
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


/**
 * Toggles visibility of password input and changes icon accordingly.
 * @param {string} inputId - The id of the password input element.
 * @param {HTMLElement} element - The toggle button/image element.
 * @param {string} path - Path prefix for icon image sources.
 */
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


/**
 * Closes contact and category dropdowns if clicking outside of them.
 * @param {MouseEvent} event - The click event.
 */
function closeDropdownsIfClickedOutside(event) {
  ifContactsBoxOpen(event);
  ifCategoryBoxOpen(event);
  
}


/**
 * Closes the contacts dropdown if open and click happened outside it.
 * @param {MouseEvent} event - The click event.
 */
function ifContactsBoxOpen(event) {
  const box = document.querySelector(".dropdown-wrapper");
  const searchState = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const isSearchOpen = searchState && searchState.style.display === "flex";
  const isOptionsOpen = optionsRef && optionsRef.style.display === "flex";
  if (event.target.id === 'moreContactsButton') return;
  if (!isSearchOpen && !isOptionsOpen) return;
  if (!box.contains(event.target)) {
    closeContactAssignment();
  }
}


/**
 * Closes the category dropdown if open and click happened outside it.
 * @param {MouseEvent} event - The click event.
 */
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


/**
 * Displays a warning overlay with the given message and a countdown timer.
 * @param {string} message - The HTML content to show in the warning dialog.
 */
function showWarningOverlay(message) {
  const overlay = document.querySelector(".warning-overlay");
  const dialog = overlay.querySelector(".warning-dialog");
  dialog.innerHTML = message;
  overlay.classList.replace("hidden", "show");
  setTimeout(() => dialog.classList.add("show"), 10);
  const countdown = document.querySelector(".countdown");
  countdownThenCloseOverlay(countdown);
}


/**
 * Counts down from 5 seconds, updates overlay countdown, then closes it.
 * @param {HTMLElement} countdown - The countdown display element.
 */
function countdownThenCloseOverlay(countdown) {
  let number = 5;
  countdown.innerText = number;

  const interval = setInterval(() => {
    number--;
    countdown.innerText = number;
    if (number === 0) {
      clearInterval(interval);
      hideWarningOverlay();
    }
  }, 1000);
}


/**
 * Hides the warning overlay with a fade-out animation.
 */
function hideWarningOverlay() {
  const overlay = document.querySelector(".warning-overlay");
  const dialog = overlay.querySelector(".warning-dialog");
  dialog.classList.remove("show");
  setTimeout(() => overlay.classList.replace("show", "hidden"), 750);
}


/**
 * Checks if the password meets complexity requirements:
 * At least 1 special char, 5 letters, and 3 numbers.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
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