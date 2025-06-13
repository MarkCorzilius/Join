/**
 * Loads HTML includes, waits for completion, then initializes the contacts page.
 *
 * @async
 */
async function contactsOnLoad() {
  w3.includeHTML();
  await waitForHTMLIncludes();
  initializeContactsPage();
}


/**
 * Waits until the HTML includes for sidebar and header are loaded into the DOM.
 *
 * @async
 * @returns {Promise<void>} Resolves when sidebar and header elements are found.
 */
async function waitForHTMLIncludes() {
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


/**
 * Initializes the contacts page by setting up UI elements, loading contacts,
 * adjusting layout and help features, and attaching event listeners.
 *
 * @async
 * @returns {Promise<void>} Resolves when initialization is complete.
 */
async function initializeContactsPage() {
  try {
    markCurrentPage();
    ifGuestShowDropdownHelp();
    await putFirstIdForTasksAndContacts("contactId");
    adjustInitialAfterLogin();
    await renderContacts();
    findUserEmail();
    adjustHelpForMobile();
    handleResizeView();
    window.addEventListener("resize", adjustHelpForMobile);
    displayLegalNoticeAndPrivacyPolicy();
  } catch (error) {
    console.log("Error in initializeContactsPage()", error);
  }
}


/**
 * Renders the contacts list by displaying contacts grouped alphabetically.
 * Handles errors gracefully and manages loading spinner visibility (commented out).
 *
 * @async
 * @returns {Promise<void>} Resolves after contacts are rendered.
 */
async function renderContacts() {
  //document.querySelector(".spinner-overlay").style.display = "block";
  try {
    await displayContactsByAlphabet();
  } catch (error) {
    console.log("rendering contacts failed", error);
  } finally {
    //document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Displays a message indicating that no contacts are available.
 * Replaces the contents of the contacts list container with a predefined template.
 */
function showNoContactsMessage() {
  const container = document.querySelector('.contacts-list');
  container.innerHTML = noContactsMessageTemplate();
}


/**
 * Fetches contacts, sorts them alphabetically, groups them by first letter,
 * and renders them in the contacts container.
 * Shows a "no contacts" message if the contact list is empty.
 */
async function displayContactsByAlphabet() {
  contactsArray = [];
  // saveBasicContacts();
  await saveContactsToArray();
  if (contactsArray.length === 0) {
    showNoContactsMessage();
    return;
  }
  contactsArray.sort((a, b) => a.displayName.localeCompare(b.displayName));
  const container = getContactsContainer();
  if (!container) return;
  const groups = groupContactsByFirstLetter(contactsArray);
  renderGroupedContacts(container, groups);
}


/**
 * Renders grouped contacts into the given container.
 * Groups are sorted alphabetically by their keys (letters).
 * Each group displays a heading with the letter and corresponding contact HTML.
 *
 * @param {HTMLElement} container - The DOM element to render contacts into.
 * @param {Object} groups - An object where keys are letters and values are arrays of contacts.
 */
function renderGroupedContacts(container, groups) {
  container.innerHTML = Object.keys(groups)
    .sort()
    .map((letter) => {
      let html = `<h2>${letter}</h2>`;
      groups[letter].forEach((c) => {
        const vars = getContactVars(c);
        html += generateContactHTML(c, vars);
      });
      return html;
    })
    .join("");
}


/**
 * Handles the visual update when a contact item is clicked.
 * Removes highlight classes from all contact items and names,
 * then adds highlight classes to the clicked item and its name.
 *
 * @param {HTMLElement} itemElement - The clicked contact item element.
 */
function contactItemClicked(itemElement) {
  document.querySelectorAll(".contact-item").forEach((item) => item.classList.remove("clicked-color"));
  itemElement.classList.add("clicked-color");
  document.querySelectorAll(".contact-name").forEach((name) => name.classList.remove("color-white"));
  const nameElement = itemElement.querySelector(".contact-name");
  if (nameElement) {
    nameElement.classList.add("color-white");
  }
}


/**
 * Opens the edit contact overlay and populates it with the provided contact details.
 * Sets the currentContact global variable to track the contact being edited.
 *
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} initials - Contact's initials to display in avatar.
 * @param {string} bg - Background image URL for the avatar.
 */
function editContact(name, email, phone, initials, bg) {
  currentContact = { name, email, phone, id: currContactData.id };
  let editContactOverlay = document.getElementById("editContactOverlay");
  editContactOverlay.classList.remove("d-none");
  setTimeout(() => editContactOverlay.classList.add("show"), 10);
  const overlayEditContactOverlay = editContactOverlay.querySelector(".edit-content");
  setTimeout(() => overlayEditContactOverlay.classList.add("slide-in"), 10);
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  let editAvatar = document.getElementById("editAvatar");
  editAvatar.style.backgroundImage = `url(${bg})`;
  editAvatar.innerHTML = `${initials}`;
}


/**
 * Clears the input fields of the contact form (name, email, and phone).
 */
function emptyContactForm() {
  const nameInput = document.getElementById("contactName");
  nameInput.value = "";
  const emailInput = document.getElementById("contactEmail");
  emailInput.value = "";
  const phoneInput = document.getElementById("contactPhone");
  phoneInput.value = "";
}


/**
 * Changes the cancel button icon to its "hovered" (light) version after a short delay.
 */
function makeCancelBtnLight() {
    setTimeout(() => {
      document.getElementById("overlayCancelIcon").src = "../img/full-cancel-btn-hovered.png";
    }, 100);
  }


/**
 * Changes the cancel button icon back to its default (dark) version after a short delay.
 */
function makeCancelBtnDark() {
  setTimeout(() => {
    document.getElementById("overlayCancelIcon").src = "../img/full-cancel-btn.png";
  }, 100);
}


/**
 * Shows the mobile contact details overlay and opens the detail dialog with animation.
 */
function showMobileContactDetails() {
  const overlay = document.getElementById("mobileDetailsOverlay");
  const dialog = document.querySelector(".mobile-detail-dialog");
  renderMobileControl();
  overlay.style.display = "flex";
  requestAnimationFrame(() => dialog.classList.add("open"));
}


/**
 * Hides the mobile contact details overlay by closing the detail dialog with animation,
 * then sets the overlay's display to "none" after the animation completes.
 */
function hideMobileDetails() {
  const overlay = document.getElementById("mobileDetailsOverlay");
  const dialog = document.querySelector(".mobile-detail-dialog");
  dialog.classList.remove("open");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}


/**
 * Renders the mobile contact control buttons (edit and delete) inside the mobile details dialog.
 * Uses current contact data to populate the buttons with appropriate event handlers.
 */
function renderMobileControl() {
  const container = document.getElementById("mobileDetailsDialog");
  const { name, email, phone, initial, bg, id } = currContactData;
  container.innerHTML = `<img onclick="editContact('${name}', '${email}', '${phone}', '${initial}', '${bg}', ${id})" src="../img/edit_contacts.png" alt="">
          <img onclick="deleteContact(${id})" src="../img/delete-contact.png" alt="">`;
}


/**
 * Shows the mobile contact overlay panel and hides the desktop panel if provided.
 * @param {HTMLElement} panel - The mobile panel to display.
 * @param {HTMLElement} [desktopPanel] - The desktop panel to hide (optional).
 */
function ifMobileContactOverlayOpen(panel, desktopPanel) {
  panel.style.display = "flex";
  if (desktopPanel) {
    desktopPanel.style.display = "none";
  }
}


/**
 * Hides the container and panel elements, and shows the desktop panel if provided.
 * @param {HTMLElement} container - The main container to hide.
 * @param {HTMLElement} panel - The current panel to hide.
 * @param {HTMLElement} [desktopPanel] - The desktop panel to show (optional).
 */
function ifDesktopContactOverlayOpen(container, panel, desktopPanel) {
  container.style.display = "none";
  panel.style.display = "none";
  if (desktopPanel) {
    desktopPanel.style.display = "flex";
  }
}