/**
 * Global variable to track the current subtask ID.
 * @type {number|null}
 */
let subtaskId = null;


/**
 * Initializes the task page on load.
 * Includes HTML, waits for sidebar/header, sets up environment, and loads data.
 */
async function taskPageOnLoad() {
  w3.includeHTML();
  try {
    await waitForSidebarAndHeader();
    await setupTaskPageEnvironment();
    loadTaskPageData();
  } catch (error) {
    console.log("error in taskPageOnLoad()");
  }
}


/**
 * Returns a promise that resolves when sidebar and header elements are loaded.
 * Polls DOM every 50ms.
 * @returns {Promise<void>}
 */
function waitForSidebarAndHeader() {
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
 * Sets up the environment of the task page.
 * Marks current page, adjusts UI for guests and logged-in users,
 * initializes task and contact IDs, and displays legal/privacy notices.
 * @returns {Promise<void>}
 */
async function setupTaskPageEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  await putFirstIdForTasksAndContacts("taskId/");
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Loads and initializes task page related data and UI.
 * Resets priority button, fetches contacts, checks contacts presence,
 * finds user email, adjusts help for mobile, and adds resize listener.
 */
function loadTaskPageData() {
  resetPriorityBtn();
  fetchContacts("contactOptions");
  checkContactsExistance();
  findUserEmail();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}


/**
 * Checks if any contacts exist in the database.
 * Stores result in localStorage.
 * @returns {Promise<boolean>} True if contacts exist, false otherwise.
 */
async function checkContactsExistance() {
  const contacts = await getData("contacts/");
  if (!contacts) {
    localStorage.setItem("contactsExist", "false");
    return false;
  }
  localStorage.setItem("contactsExist", "true");
  return true;
}