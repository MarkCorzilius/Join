let subtaskId = null;

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


async function setupTaskPageEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  await putFirstIdForTasksAndContacts("taskId/");
}


function loadTaskPageData() {
  resetPriorityBtn();
  fetchContacts("contactOptions");
  checkContactsExistance();
  findUserEmail();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}


async function checkContactsExistance() {
  const contacts = await getData("contacts/");
  if (!contacts) {
    localStorage.setItem("contactsExist", "false");
    return false;
  }
  localStorage.setItem("contactsExist", "true");
  return true;
}