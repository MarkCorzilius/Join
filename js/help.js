/**
 * Loads HTML includes and initializes help page features.
 * Waits for the included HTML content to be fully loaded before initialization.
 * Logs any errors that occur during the process.
 */
async function helpOnLoad() {
  w3.includeHTML();
  try {
    await waitForInclude();
    initializeHelpPageFeatures();
  } catch (error) {
    console.log("Error in helpOnLoad():", error);
  }
}


/**
 * Returns a Promise that resolves when the sidebar and header elements are loaded in the DOM.
 * Checks every 50 milliseconds if both elements (#sidebar and #header) exist.
 * Once both are found, clears the interval and resolves the Promise.
 * 
 * @returns {Promise<void>}
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
 * Initializes features specific to the help page:
 * - Shows dropdown help if user is guest
 * - Adjusts user initial display after login
 * - Hides help icon on the help page
 * - Adjusts UI for mobile view and adds resize listener
 * - Displays legal notice and privacy policy
 */
function initializeHelpPageFeatures() {
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  ifHelpPageNoHelpIcon();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Hides the help icon by adding the 'd-none' class to the element with id 'helpIcon'.
 */
function hideHelpIcon() {
  document.getElementById("helpIcon").classList.add("d-none");
}


/**
 * Shows the help icon by removing the 'd-none' class from the element with id 'helpIcon'.
 */
function showHelpIcon() {
  document.getElementById("helpIcon").classList.remove("d-none");
}