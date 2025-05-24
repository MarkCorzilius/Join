async function helpOnLoad() {
  w3.includeHTML();
  try {
    await waitForInclude();
    initializeHelpPageFeatures();
  } catch (error) {
    console.log("Error in helpOnLoad():", error);
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

function initializeHelpPageFeatures() {
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  ifHelpPageNoHelpIcon();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}

function hideHelpIcon() {
  document.getElementById("helpIcon").classList.add("d-none");
}

function showHelpIcon() {
  document.getElementById("helpIcon").classList.remove("d-none");
}
