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
        optionsRef.style.display = 'none';
        isCategoryOptionsOpen(arrow, section, optionsRef);     
    }
}
