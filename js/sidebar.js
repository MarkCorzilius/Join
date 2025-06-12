function adjustSideBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedOnly = document.querySelectorAll(".only-loggedin");
  const guestOnly = document.querySelectorAll(".only-guest");
  loggedOnly.forEach(el => el.classList.toggle("d-none", !user));
  guestOnly.forEach(el => el.classList.toggle("d-none", !!user));
}


document.addEventListener("DOMContentLoaded", () => {
  adjustSideBar();
  injectLoginButtonIfNeeded();
  waitForSidebarFooter();
});


function waitForSidebarFooter() {
  const interval = setInterval(() => {
    const footer = document.getElementById("sidebarFooter");
    if (footer) {
      clearInterval(interval);
      handleSidebarFooterVisibility(footer);
    }
  }, 50);
}


function handleSidebarFooterVisibility(footer) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isMobile = window.innerWidth <= 1000;

  if (!user && isMobile) {
    footer.classList.add("force-visible");
  } else {
    footer.classList.remove("force-visible");
  }
}



function injectLoginButtonIfNeeded() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user && document.getElementById("sidebarFooter")) {
    let btn = document.createElement("button");
    btn.className = "nav-button";
    btn.innerText = "Login";
    btn.onclick = () => window.location.href = "../index.html";
    document.getElementById("sidebarFooter").prepend(btn);
  }
}


window.addEventListener("resize", () => {
  const footer = document.getElementById("sidebarFooter");
  if (footer) {
    handleSidebarFooterVisibility(footer);
  }
});