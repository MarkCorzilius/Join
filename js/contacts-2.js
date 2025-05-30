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
    menu.innerHTML = generateToggleMobileHTML(bg, initials, name, email, phone, currContactData.id);
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
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

document.addEventListener("click", function (e) {
  const btn = document.querySelector(".mobile-more-btn");
  const menu = document.querySelector(".mobile-actions");
  const editOverlay = document.getElementById("editContactOverlay");
  if (!btn || !menu || !menu.classList.contains("slide-in")) return;
  const outsideClick = !btn.contains(e.target) && !menu.contains(e.target) && !(editOverlay && editOverlay.contains(e.target));
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
  emptyContactForm();
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

function overlayForContactSuccesfullyCreated() {
  const overlay = document.getElementById("contactSuccesfullyCreated");
  const detailContainer = document.getElementById("contactDetailContainer");
  const containerRect = detailContainer.getBoundingClientRect();
  const computedStyle = getComputedStyle(detailContainer);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  overlay.style.left = containerRect.left + paddingLeft + "px";
  overlay.classList.remove("d-none");
  setTimeout(() => overlay.classList.add("show"), 10);
  setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("d-none"), 500);
  }, 2000);
}

function newContactPushToArray(name, email, phone) {
  const newContact = { name, email, phone };
  contactsArray.push(newContact);
}

function deleteValue() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
}

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

function updateContactArray(newName, newEmail, newPhone) {
  contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
  contactsArray.push({ email: newEmail, name: newName, phone: newPhone });
}

async function updateDetailView(newName, newEmail, newPhone) {
  let detailView = document.getElementById("contactDetailView");
  if (!detailView.classList.contains("d-none")) {
    const vars = getContactVars({ name: newName });
    detailView.innerHTML = generateContactDetails(vars.bg, vars.initial, newName, newEmail, newPhone);
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

function emptyContactForm() {
  const nameInput = document.getElementById("contactName");
  nameInput.value = "";
  const emailInput = document.getElementById("contactEmail");
  emailInput.value = "";
  const phoneInput = document.getElementById("contactPhone");
  phoneInput.value = "";
}

function makeCancelBtnLight() {
  setTimeout(() => {
    document.getElementById("overlayCancelIcon").src = "../img/full-cancel-btn-hovered.png";
  }, 100);
}

function makeCancelBtnDark() {
  setTimeout(() => {
    document.getElementById("overlayCancelIcon").src = "../img/full-cancel-btn.png";
  }, 100);
}

function showMobileContactDetails() {
  const overlay = document.getElementById("mobileDetailsOverlay");
  const dialog = document.querySelector(".mobile-detail-dialog");
  renderMobileControl();
  overlay.style.display = "flex";
  requestAnimationFrame(() => dialog.classList.add("open"));
}

function hideMobileDetails() {
  const overlay = document.getElementById("mobileDetailsOverlay");
  const dialog = document.querySelector(".mobile-detail-dialog");
  dialog.classList.remove("open");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}

function renderMobileControl() {
  const container = document.getElementById("mobileDetailsDialog");
  const { name, email, phone, initial, bg, id } = currContactData;
  container.innerHTML = `<img onclick="editContact('${name}', '${email}', '${phone}', '${initial}', '${bg}', ${id})" src="../img/edit_contacts.png" alt="">
          <img onclick="deleteContact(${id})" src="../img/delete-contact.png" alt="">`;
}

function ifMobileContactOverlayOpen(panel, desktopPanel) {
  panel.style.display = "flex";
  if (desktopPanel) {
    desktopPanel.style.display = "none";
  }
}

function ifDesktopContactOverlayOpen(container, panel, desktopPanel) {
  container.style.display = "none";
  panel.style.display = "none";
  if (desktopPanel) {
    desktopPanel.style.display = "flex";
  }
}

function isRealEmail(email) {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  const isAtValid = checkAtConditions(trimmed, atIndex);
  const isDotValid = checkDotConditions(trimmed, atIndex);
  if (!isAtValid || !isDotValid) return false;
  return true;
}

function checkAtConditions(trimmed, atIndex) {
  if (atIndex === -1) return false;
  if (trimmed.indexOf("@", atIndex + 1) !== -1) return false;
  return true;
}

function checkDotConditions(trimmed, atIndex) {
  const dotIndex = trimmed.indexOf(".");
  if (dotIndex === -1) return false;
  if (atIndex === 0) return false;
  if (dotIndex === trimmed.length - 1) return false
  return true;
}

async function validateContactInputs(email, phone) {
  if (!isRealEmail(email)) {
    showNotRealEmailAlert();
    return false;
  }
  if (!isRealNumber(phone)) {
    showNotRealNumberAlert();
    return false;
  }
  return true;
}

function showNotRealEmailAlert() {
  alert(
    "Invalid email address! Please make sure your email:\n" +
      '- Contains exactly one "@" symbol\n' +
      '- Has at least one "." after the "@"\n' +
      '- The "." is not immediately after "@"\n' +
      '- The "." is not the last character\n' +
      '- The "@" is not the first character'
  );
}

function showNotRealNumberAlert() {
  alert(
    "Invalid phone number! Please make sure your phone number:\n" +
      "- Is not empty\n" +
      "- Contains only digits\n" +
      '- May start with a "+" followed by digits\n' +
      "- Does NOT contain spaces or other characters"
  );
}

function isRealNumber(number) {
  const trimmed = number.trim();
  if (trimmed.length < 7) return false;
  console.log(/^\+\d+$/.test(trimmed))
  return /^\+\d+$/.test(trimmed);

}
