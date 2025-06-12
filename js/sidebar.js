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