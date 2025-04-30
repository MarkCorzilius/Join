function setupSidebar() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const authButtons = document.querySelectorAll(".auth-only");
  const loginButton = document.getElementById("loginSidebarBtn");

  authButtons.forEach(btn => {
    if (loggedIn) {
      btn.classList.remove('d-none');
    } else {
      btn.classList.add('d-none');
    }
  });

  if (loginButton) {
    if (loggedIn) {
      loginButton.classList.add('d-none');
    } else {
      loginButton.classList.remove('d-none');
    }
  }


  const activeButtonHref = localStorage.getItem("activeSidebarButton");

  if (activeButtonHref) {
    const activeButton = document.querySelector(`.nav-button[href="${activeButtonHref}"]`);
    if (activeButton) {
      activeButton.classList.add("clicked-color");
    }
  }
}

function waitForSidebarThenSetup() {
  const sidebarContainer = document.getElementById('sidebarContainer');

  const observer = new MutationObserver((mutationsList, observer) => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      setupSidebar();
      observer.disconnect(); // Fertig, keine weitere Beobachtung nötig
    }
  });

  observer.observe(sidebarContainer, { childList: true, subtree: true });
}

window.addEventListener('DOMContentLoaded', () => {
  waitForSidebarThenSetup();
});





window.addEventListener("DOMContentLoaded", () => {
  // Wenn Sidebar direkt im DOM war (nicht über include geladen)
  if (document.querySelector("#sidebar")) {
    setupSidebar();
  }
});



function buttonClicked(element) {
  const buttons = document.querySelectorAll(".nav-button");
  buttons.forEach((btn) => btn.classList.remove("clicked-color"));
  element.classList.add("clicked-color");
  // 🔥 Speichern des angeklickten Buttons
  localStorage.setItem("activeSidebarButton", element.getAttribute("href"));
}
