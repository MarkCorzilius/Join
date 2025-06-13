/**
 * Hides and clears the contact detail view.
 */
function hideContactDetailView() {
  let detailView = document.getElementById("contactDetailView");
  if (detailView) {
    detailView.classList.add("d-none");
    detailView.innerHTML = "";
  }
}


/**
 * Opens the contact detail view with provided contact information.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string|number} id - Contact's ID.
 */
function openContactItem(name, email, phone, id) {
  const initial = getInitials(name);
  const bg = getBackgroundForName(name);
  let contactDetailView = document.getElementById("contactDetailView");
  currContactData = { bg, initial, name, email, phone, id };
  contactDetailView.innerHTML = generateContactDetails(bg, initial, name, email, phone, id);
  slideEfekt();
  goToContactInfoForMobile();
  detailViewOpen = true;
}


/**
 * Switches to contact detail view on mobile screens.
 */
function goToContactInfoForMobile() {
  if (document.documentElement.clientWidth < 800) {
    let contacts = document.getElementById("contacts");
    let contactDetailContainer = document.getElementById("contactDetailContainer");
    let backArrow = document.getElementById("backArrow");
    if (contacts && contactDetailContainer && backArrow) {
      contacts.classList.add("d-none");
      contactDetailContainer.classList.add("d-flex");
      contactDetailContainer.classList.remove("d-none");
      backArrow.classList.remove("d-none");
    }
  }
}


/**
 * Returns to the contacts list view on mobile screens.
 */
function backToContacts() {
  if (document.documentElement.clientWidth < 800) {
    const contacts = document.getElementById("contacts");
    const contactDetailContainer = document.getElementById("contactDetailContainer");
    const backArrow = document.getElementById("backArrow");
    if (contacts && contactDetailContainer && backArrow) {
      contacts.classList.remove("d-none");
      contactDetailContainer.classList.remove("d-flex");
      contactDetailContainer.classList.add("d-none");
      backArrow.classList.add("d-none");
      detailViewOpen = false;
    }
  }
}


window.addEventListener("resize", handleResizeView);


/**
 * Adjusts the contact view layout based on the current window width.
 */
function handleResizeView() {
  const browserWidth = document.documentElement.clientWidth;
  const contacts = document.getElementById("contacts");
  const contactDetailContainer = document.getElementById("contactDetailContainer");
  const backArrow = document.getElementById("backArrow");
  if (!contacts || !contactDetailContainer || !backArrow) return;
  if (browserWidth >= 800) {
    setDesktopLayout(contacts, contactDetailContainer, backArrow);
  } else {
    setMobileLayout(contacts, contactDetailContainer, backArrow);
  }
}


/**
 * Sets the layout for desktop view by showing both contacts and details.
 * @param {HTMLElement} contacts - The contacts list element.
 * @param {HTMLElement} contactDetailContainer - The contact detail view element.
 * @param {HTMLElement} backArrow - The back arrow element.
 */
function setDesktopLayout(contacts, contactDetailContainer, backArrow) {
  contacts.classList.remove("d-none");
  contactDetailContainer.classList.remove("d-none");
  contactDetailContainer.classList.add("d-flex");
  backArrow.classList.add("d-none");
}


/**
 * Sets the layout for mobile view based on whether the detail view is open.
 * @param {HTMLElement} contacts - The contacts list element.
 * @param {HTMLElement} contactDetailContainer - The contact detail view element.
 * @param {HTMLElement} backArrow - The back arrow element.
 */
function setMobileLayout(contacts, contactDetailContainer, backArrow) {
  if (detailViewOpen) {
    contacts.classList.add("d-none");
    contactDetailContainer.classList.remove("d-none");
    contactDetailContainer.classList.add("d-flex");
    backArrow.classList.remove("d-none");
  } else {
    contacts.classList.remove("d-none");
    contactDetailContainer.classList.remove("d-flex");
    contactDetailContainer.classList.add("d-none");
    backArrow.classList.add("d-none");
  }
}


/**
 * Triggers a slide-in animation for the contact detail view.
 */
function slideEfekt() {
  let contactDetailView = document.getElementById("contactDetailView");
  contactDetailView.classList.remove("slide-in");
  contactDetailView.classList.remove("d-none");
  setTimeout(() => {
    contactDetailView.classList.add("slide-in");
  }, 10);
}



/**
 * Toggles the visibility of the mobile actions menu for a contact.
 * @param {string} bg - Background image URL.
 * @param {string} initials - Contact initials.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 */
function toggleMobileActions(bg, initials, name, email, phone) {
  const menu = document.querySelector(".mobile-actions");
  if (!menu || menu.classList.contains("slide-out")) return;
  if (menu.classList.contains("slide-in")) {
    closeMobileActionsMenu(menu);
  } else {
    menu.innerHTML = generateToggleMobileHTML(bg, initials, name, email, phone, currContactData.id);
    menu.classList.remove("d-none");
    setTimeout(() => {
      menu.classList.add("slide-in");
      setupMobileActionButtons(menu);
    }, 10);
  }
}


/**
 * Closes the mobile actions menu with a slide-out animation.
 * @param {HTMLElement} menu - The mobile actions menu element.
 */
function closeMobileActionsMenu(menu) {
  menu.classList.remove("slide-in");
  menu.classList.add("slide-out");
  setTimeout(() => {
    menu.classList.add("d-none");
    menu.classList.remove("slide-out");
    menu.innerHTML = "";
  }, 300);
}


/**
 * Adds click event listeners to all buttons inside the mobile actions menu.
 * When a button is clicked, it becomes active and others are deactivated.
 * @param {HTMLElement} menu - The mobile actions menu element.
 */
function setupMobileActionButtons(menu) {
  const buttons = menu.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}


/**
 * Global click event listener that closes the mobile actions menu
 * if the click occurs outside of the menu, its toggle button,
 * and the edit contact overlay.
 *
 * @param {MouseEvent} e - The click event object.
 */
document.addEventListener("click", function (e) {
  const btn = document.querySelector(".mobile-more-btn");
  const menu = document.querySelector(".mobile-actions");
  const editOverlay = document.getElementById("editContactOverlay");
  if (!btn || !menu || !menu.classList.contains("slide-in")) return;
  const outsideClick = !btn.contains(e.target) && !menu.contains(e.target) && !(editOverlay && editOverlay.contains(e.target));
  if (outsideClick) closeMobileActionsMenu(menu);
});



/**
 * Opens the Add Contact overlay with fade and slide-in animations.
 */
function openAddContactOverlay() {
  const addContactOverlay = document.getElementById("addContactOverlay");
  addContactOverlay.classList.remove("d-none");
  setTimeout(() => addContactOverlay.classList.add("show"), 10);
  const overlayAddContent = addContactOverlay.querySelector(".add-content");
  setTimeout(() => overlayAddContent.classList.add("slide-in"), 10);
}


/**
 * Clears the contact form inputs,
 * then closes the Add Contact overlay with slide-out and fade-out animations.
 */
function closeAddContactOverlay() {
  emptyContactForm();
  const addContactOverlay = document.getElementById("addContactOverlay");
  const addContent = addContactOverlay.querySelector(".add-content");
  addContent.classList.remove("slide-in");
  addContactOverlay.classList.remove("show");
  setTimeout(() => addContactOverlay.classList.add("d-none"), 300);
}


/**
 * Adds click event listeners to overlay backgrounds to close them when clicked outside content.
 * Listens for clicks on the overlays with IDs "addContactOverlay" and "editContactOverlay".
 * If the click target is the overlay itself (not inside its content), closes the respective overlay.
 */
document.addEventListener("DOMContentLoaded", () => {
  ["addContactOverlay", "editContactOverlay"].forEach((id) => {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          id === "addContactOverlay" ? closeAddContactOverlay() : closeEditContactOverlay();
        }
      });
    }
  });
});


/**
 * Updates the contact detail view with new contact information if it is currently visible.
 * @param {string} newName - The updated contact name.
 * @param {string} newEmail - The updated contact email.
 * @param {string} newPhone - The updated contact phone number.
 * @returns {Promise<void>} - Resolves after updating the detail view and triggering slide animation.
 */
async function updateDetailView(newName, newEmail, newPhone) {
  let detailView = document.getElementById("contactDetailView");
  if (!detailView.classList.contains("d-none")) {
    const vars = getContactVars({ name: newName });
    detailView.innerHTML = generateContactDetails(vars.bg, vars.initial, newName, newEmail, newPhone);
    slideEfekt();
  }
}

/**
 * Closes the edit contact overlay with a slide-out animation and hides it after a delay.
 */
function closeEditContactOverlay() {
  const editContactOverlay = document.getElementById("editContactOverlay");
  const overlayEditContent = editContactOverlay.querySelector(".edit-content");
  overlayEditContent.classList.remove("slide-in");
  editContactOverlay.classList.remove("show");
  setTimeout(() => editContactOverlay.classList.add("d-none"), 300);
}


/**
 * Shows a success toast for contact creation, then hides it and reloads the page after 1.7 seconds.
 */
async function overlayForContactSuccesfullyCreated() {
  const toast = document.getElementById("contactSuccesfullyCreated");
  toast.classList.add('visible');
  await new Promise((resolve) => {
    setTimeout(() => {
      toast.classList.remove('visible');
      window.location.reload();
      resolve();
    }, 1700);  
  })
}