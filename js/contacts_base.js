async function contactsOnLoad() {
  w3.includeHTML();
  await waitForHTMLIncludes();
  initializeContactsPage();
}


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


function initializeContactsPage() {
  try {
    markCurrentPage();
    ifGuestShowDropdownHelp();
    adjustInitialAfterLogin();
    renderContacts();
    findUserEmail();
    adjustHelpForMobile();
    window.addEventListener("resize", adjustHelpForMobile);
  } catch (error) {
    console.log("Error in initializeContactsPage()", error);
  }
}


async function renderContacts() {
  // document.querySelector(".spinner-overlay").style.display = "block";
  try {
    await displayContactsByAlphabet();
  } catch (error) {
    console.log("rendering contacts failed");
  } finally {
    // document.querySelector(".spinner-overlay").style.display = "none";
  }
}


async function displayContactsByAlphabet() {
  contactsArray = [];
  //await saveBasicContacts();
  await saveContactsToArray();
  contactsArray.sort((a, b) => a.displayName.localeCompare(b.displayName));
  const container = document.querySelector(".contacts-list");
  if (!container) return;
  const groups = {};
  contactsArray.forEach((c) => {
    const letter = c.displayName[0].toUpperCase();
    (groups[letter] = groups[letter] || []).push(c);
  });
  renderGroupedContacts(container, groups);
}


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


function getInitials(name) {
  const cleanName = name.replace(/ \(You\)$/, "");
  const parts = cleanName.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


function getContactVars(c) {
  let initials = getInitials(c.name);
  let bg = getBackgroundForName(c.name);
  saveContactIconInFireBase(c, initials, bg);
  return { initials, bg };
}


function getBackgroundForName(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  const index = sum % bgImages.length;
  return bgImages[index];
}


function openContactItem(name, email, phone) {
  const initials = getInitials(name);
  const bg = getBackgroundForName(name);
  let contactDetailView = document.getElementById("contactDetailView");
  currContactData = { bg, initials, name, email, phone };
  contactDetailView.innerHTML = generateContactDetails(bg, initials, name, email, phone);
  slideEfekt();
  goToContactInfoForMobile();
  detailViewOpen = true;
}


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


function setDesktopLayout(contacts, contactDetailContainer, backArrow) {
  contacts.classList.remove("d-none");
  contactDetailContainer.classList.remove("d-none");
  contactDetailContainer.classList.add("d-flex");
  backArrow.classList.add("d-none");
}


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


function slideEfekt() {
  let contactDetailView = document.getElementById("contactDetailView");
  contactDetailView.classList.remove("slide-in");
  contactDetailView.classList.remove("d-none");
  setTimeout(() => {
    contactDetailView.classList.add("slide-in");
  }, 10);
}


function contactItemClicked(itemElement) {
  document.querySelectorAll(".contact-item").forEach((item) => item.classList.remove("clicked-color"));
  itemElement.classList.add("clicked-color");
  document.querySelectorAll(".contact-name").forEach((name) => name.classList.remove("color-white"));
  const nameElement = itemElement.querySelector(".contact-name");
  if (nameElement) {
    nameElement.classList.add("color-white");
  }
}


function toggleMobileActions(bg, initials, name, email, phone) {
  const menu = document.querySelector(".mobile-actions");
  if (!menu || menu.classList.contains("slide-out")) return;
  if (menu.classList.contains("slide-in")) {
    closeMobileActionsMenu(menu);
  } else {
    menu.innerHTML = generateToggleMobileHTML(bg, initials, name, email, phone);
    menu.classList.remove("d-none");
    setTimeout(() => {
      menu.classList.add("slide-in");
      setupMobileActionButtons(menu);
    }, 10);
  }
}


function closeMobileActionsMenu(menu) {
  menu.classList.remove("slide-in");
  menu.classList.add("slide-out");
  setTimeout(() => {
    menu.classList.add("d-none");
    menu.classList.remove("slide-out");
    menu.innerHTML = "";
  }, 300);
}


function setupMobileActionButtons(menu) {
  const buttons = menu.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}


function bindMobileButton(bg, initials, name, email, phone) {
  const button = document.querySelector(".mobile-more-btn");
  button.onclick = () => toggleMobileActions(bg, initials, name, email, phone);
}


document.addEventListener("click", function (e) {
  const btn = document.querySelector(".mobile-more-btn");
  const menu = document.querySelector(".mobile-actions");
  const editOverlay = document.getElementById("editContactOverlay");
  if (!btn || !menu || !menu.classList.contains("slide-in")) return;
  const outsideClick =
    !btn.contains(e.target) &&
    !menu.contains(e.target) &&
    !(editOverlay && editOverlay.contains(e.target));
  if (outsideClick) closeMobileActionsMenu(menu);
});


function openAddContactOverlay() {
  const addContactOverlay = document.getElementById("addContactOverlay");
  addContactOverlay.classList.remove("d-none");
  setTimeout(() => addContactOverlay.classList.add("show"), 10);
  const overlayAddContent = addContactOverlay.querySelector(".add-content");
  setTimeout(() => overlayAddContent.classList.add("slide-in"), 10);
}


function closeAddContactOverlay() {
  clearContactInputs();
  const addContactOverlay = document.getElementById("addContactOverlay");
  const addContent = addContactOverlay.querySelector(".add-content");
  addContent.classList.remove("slide-in");
  addContactOverlay.classList.remove("show");
  setTimeout(() => addContactOverlay.classList.add("d-none"), 300);
}


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


function saveNewContact() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  if (!validateContactInput(name, email, phone)) return;
  if (contactExists(email)) return;
  newContactPushToArray(name, email, phone);
  closeAddContactOverlay();
  overlayForContactSuccesfullyCreated();
  renderContacts();
}


function overlayForContactSuccesfullyCreated() {
  const overlay = document.getElementById("contactSuccesfullyCreated");
  const detailContainer = document.getElementById("contactDetailContainer");
  const containerRect = detailContainer.getBoundingClientRect();
  const computedStyle = getComputedStyle(detailContainer);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  overlay.classList.remove("d-none");
  setTimeout(() => overlay.classList.add("show"), 10);
  setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("d-none"), 500);
  }, 2000);
}


function validateContactInput(name, email, phone) {
  if (!name || !email || !phone) {
    alert("Bitte Name, E-Mail und Telefonnummer angeben!");
    return false;
  }
  return true;
}


function contactExists(email) {
  const exists = contactsArray.some((contact) => contact.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    alert("Kontakt existiert bereits!");
    return true;
  }
  return false;
}


function newContactPushToArray(name, email, phone) {
  const newContact = { name, email, phone };
  contactsArray.push(newContact);
}


function clearContactInputs() {
  ['contactName', 'contactEmail', 'contactPhone'].forEach(id => {
    document.getElementById(id).value = '';
  });
}


function editContact(name, email, phone, initials, bg) {
  currentContact = { name, email, phone };
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


function updateContactArray(newName, newEmail, newPhone) {
  contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
  contactsArray.push({ email: newEmail, name: newName, phone: newPhone });
}


async function updateDetailView(newName, newEmail, newPhone) {
  let detailView = document.getElementById("contactDetailView");
  if (!detailView.classList.contains("d-none")) {
    const vars = getContactVars({ name: newName });
    detailView.innerHTML = generateContactDetails(vars.bg, vars.initials, newName, newEmail, newPhone);
    slideEfekt();
  }
}


function closeEditContactOverlay() {
  const editContactOverlay = document.getElementById("editContactOverlay");
  const overlayEditContent = editContactOverlay.querySelector(".edit-content");
  overlayEditContent.classList.remove("slide-in");
  editContactOverlay.classList.remove("show");
  setTimeout(() => editContactOverlay.classList.add("d-none"), 300);
}