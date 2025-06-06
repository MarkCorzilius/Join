function toggleInitialDropdown() {
  const dropdown = document.getElementById("userDropdown");
  const isMobile = window.innerWidth <= 1000;
  if (isMobile) {
    toggleMobileDropdown(dropdown);
  } else {
    dropdown.classList.toggle("d-none");
  }
  document.addEventListener("click", closeDropdownOnClickOutside);
}


function toggleMobileDropdown(dropdown) {
  if (dropdown.classList.contains("d-none")) {
    dropdown.classList.remove("d-none");
    requestAnimationFrame(() => dropdown.classList.add("slide-in"));
  } else {
    dropdown.classList.remove("slide-in");
    setTimeout(() => dropdown.classList.add("d-none"), 300);
  }
}


function closeDropdownOnClickOutside(e) {
  const dropdown = document.getElementById("userDropdown");
  const trigger = document.getElementById("userInitial");
  const isMobile = window.innerWidth <= 1000;
  if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
    isMobile ? closeMobileDropdown(dropdown) : dropdown.classList.add("d-none");
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
}


function closeMobileDropdown(dropdown) {
  dropdown.classList.remove("slide-in");
  setTimeout(() => dropdown.classList.add("d-none"), 300);
}


function logout() {
  window.location.href = "../index.html";
  localStorage.removeItem("user");
}


function ifGuestShowDropdownHelp() {
  const user = JSON.parse(localStorage.getItem("user"));
  const btn = document.querySelector(".dropdown-help");
  if (user.name === "Guest" || user.name === "Viewer") {
    btn.classList.remove("d-none");
  }
}


async function adjustInitialAfterLogin() {
  const container = document.getElementById("userInitial");
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.name === "Guest" || user.name === "Viewer") {
    container.innerText = "G";
    return;
  } else {
    const initial = await searchForContactInitial(user.id);
    container.innerText = initial;
  }
  container.onclick = toggleInitialDropdown;
}


async function searchForContactInitial(id) {
  const rawContacts = await getData("ourUsers/");
  const contacts = Object.values(rawContacts);

  const match = contacts.find((contact) => contact.id === id);
  return match?.icon?.initial;
}


function ifHelpPageNoHelpIcon() {
  const icon = document.querySelector(".help-icon");
  if (window.location.pathname.includes("help")) {
    icon.classList.add("d-none");
  }
}