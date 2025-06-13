/**
 * Hides sidebar navigation buttons for Viewer users except for allowed ones.
 */
function adjustSideBar() {
  const user = getStoredUser();
  if (user && user.name === "Viewer") {
    const buttons = document.querySelectorAll(".nav-button");
    filterSidebarButtonsForViewer(buttons);
  }
}


/**
 * Retrieves the stored user from localStorage.
 * @returns {{ name: string } | null} Parsed user object or null.
 */
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}


/**
 * Hides all sidebar buttons except the allowed ones for a Viewer.
 * @param {NodeListOf<Element>} buttons - List of sidebar button elements.
 */
function filterSidebarButtonsForViewer(buttons) {
  const allowedIds = ["loginSidebarBtn", "privacyPolicySideBar", "legalNoticeSideBar"];
  buttons.forEach((button) => {
    if (!allowedIds.includes(button.id)) {
      button.classList.add("d-none");
    } else {
      button.classList.remove("d-none");
    }
  });
}


/**
 * Determines when to display or hide the legal notice and privacy policy footer.
 */
function displayLegalNoticeAndPrivacyPolicy() {
  const footer = document.getElementById('sidebarFooter');
  const user = getLoggedInUser();

  if (!footer || !user) return;

  const shouldShow = shouldDisplayFooter(user.name, window.innerWidth);
  footer.style.display = shouldShow ? 'flex' : 'none';
}


/**
 * Retrieves the current user from localStorage.
 * @returns {{ name: string } | null} The user object or null if unavailable.
 */
function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}


/**
 * Determines if the footer should be displayed based on user role and screen size.
 * @param {string} userName - The name of the current user.
 * @param {number} screenWidth - The current window width.
 * @returns {boolean} True if footer should be shown, false otherwise.
 */
function shouldDisplayFooter(userName, screenWidth) {
  if (screenWidth <= 1000) {
    return userName === "Viewer";
  }
  return true; // Always show on desktop for non-Viewer users
}