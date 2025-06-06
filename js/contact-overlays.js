function hideContactDetailView() {
  let detailView = document.getElementById("contactDetailView");
  if (detailView) {
    detailView.classList.add("d-none");
    detailView.innerHTML = "";
  }
}


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