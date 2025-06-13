/**
 * Toggles the visibility of the user initials dropdown.
 * Handles separate behavior for mobile and desktop views.
 * Adds a document-level click listener to close the dropdown when clicking outside.
 */ 
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


/**
 * Toggles the mobile version of the user initials dropdown.
 * Applies a slide-in animation when showing and hides it after animation when closing.
 *
 * @param {HTMLElement} dropdown - The dropdown element to toggle.
 */
function toggleMobileDropdown(dropdown) {
  if (dropdown.classList.contains("d-none")) {
    dropdown.classList.remove("d-none");
    requestAnimationFrame(() => dropdown.classList.add("slide-in"));
  } else {
    dropdown.classList.remove("slide-in");
    setTimeout(() => dropdown.classList.add("d-none"), 300);
  }
}


/**
 * Closes the user dropdown menu if a click occurs outside of it and the trigger element.
 * Handles both desktop and mobile dropdowns.
 *
 * @param {MouseEvent} e - The click event.
 */
function closeDropdownOnClickOutside(e) {
  const dropdown = document.getElementById("userDropdown");
  const trigger = document.getElementById("userInitial");
  const isMobile = window.innerWidth <= 1000;
  if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
    isMobile ? closeMobileDropdown(dropdown) : dropdown.classList.add("d-none");
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
}


/**
 * Closes the mobile user dropdown menu with a slide-out animation.
 *
 * @param {HTMLElement} dropdown - The dropdown element to be closed.
 */
function closeMobileDropdown(dropdown) {
  dropdown.classList.remove("slide-in");
  setTimeout(() => dropdown.classList.add("d-none"), 300);
}


/**
 * Logs the user out by removing user data from localStorage
 * and redirecting to the login (index) page.
 */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}


/**
 * Displays the dropdown help button if the current user is a "Guest" or "Viewer".
 * Retrieves user data from localStorage and checks the user's name.
 * If the name matches, it makes the help button visible.
 */
function ifGuestShowDropdownHelp() {
  const user = JSON.parse(localStorage.getItem("user"));
  const btn = document.querySelector(".dropdown-help");
  if (user?.name === "Guest" || user?.name === "Viewer") {
    btn.classList.remove("d-none");
  }
}


/**
 * Adjusts the user initial or visibility of elements after login.
 * Handles special cases for "Guest" and "Viewer" users.
 * For regular users, it retrieves and sets their initial.
 */
async function adjustInitialAfterLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  if (user.name === "Guest") {
    setGuestInitial();
  } else if (user.name === "Viewer") {
    hideViewerElements();
  } else {
    await setUserInitial(user.id);
  }
}


/**
 * Sets the initial "G" for Guest users.
 */
function setGuestInitial() {
  const container = document.getElementById("userInitial");
  container.innerText = "G";
  container.onclick = toggleInitialDropdown;
}


/**
 * Hides the initial and help icon for Viewer users.
 */
function hideViewerElements() {
  document.getElementById("userInitial").style.display = "none";
  document.querySelector(".help-icon").style.display = "none";
}


/**
 * Retrieves and displays the initial for regular users.
 * @param {string|number} userId - The ID of the logged-in user.
 */
async function setUserInitial(userId) {
  const container = document.getElementById("userInitial");
  const initial = await searchForContactInitial(userId);
  container.innerText = initial || "U";
  container.onclick = toggleInitialDropdown;
}


/**
 * Searches for a user's contact initial by their ID.
 *
 * @param {string|number} id - The ID of the user to search for.
 * @returns {Promise<string|undefined>} The initial from the user's icon if found; otherwise undefined.
 */
async function searchForContactInitial(id) {
  const rawContacts = await getData("ourUsers/");
  const contacts = Object.values(rawContacts);
  const match = contacts.find((contact) => contact.id === id);
  return match?.icon?.initial;
}


/**
 * Hides the help icon if the current page is the help page.
 */
function ifHelpPageNoHelpIcon() {
  const icon = document.querySelector(".help-icon");
  if (window.location.pathname.includes("help")) {
    icon.classList.add("d-none");
  }
}