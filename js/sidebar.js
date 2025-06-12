function adjustSideBar() {
  const buttons = document.querySelectorAll(".nav-button");
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name === "Viewer") {
    buttons.forEach((button) => {
      const allowedIds = ["loginSidebarBtn", "privacyPolicySideBar", "legalNoticeSideBar"];
      if (!allowedIds.includes(button.id)) {
        button.classList.add("d-none");
      } else {
        button.classList.remove("d-none");
      }
    });
  }
}


function displayLegalNoticeAndPrivacyPolicy() {
  const footer = document.getElementById('sidebarFooter');
  const user = JSON.parse(localStorage.getItem('user'))
  if (user.name === 'Viewer' && window.innerWidth <= 1000) {
    if (footer) {
      footer.style.display = 'flex';
    }
  } else if (user.name !== "Viewer" && window.innerWidth <= 1000) {
    if (footer) {
      footer.style.display = 'none';
    }
  } else if (user.name !== "Viewer" && window.innerWidth > 1000) {
    if (footer) {
      footer.style.display = 'flex';
    }
  }
}