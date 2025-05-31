let subtaskId = null;

async function taskPageOnLoad() {
  w3.includeHTML();
  try {
    await waitForSidebarAndHeader();
    setupTaskPageEnvironment();
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

function setupTaskPageEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  taskId = Number(localStorage.getItem("taskId")) || 0;
}

function loadTaskPageData() {
  resetPriorityBtn();
  fetchContacts("contactOptions");
  findUserEmail();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}
