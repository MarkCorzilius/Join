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

async function initializeContactsPage() {
  try {
    markCurrentPage();
    ifGuestShowDropdownHelp();
    adjustInitialAfterLogin();
    await renderContacts();
    findUserEmail();
    adjustHelpForMobile();
    window.addEventListener("resize", adjustHelpForMobile);
  } catch (error) {
    console.log("Error in initializeContactsPage()", error);
  }
}

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

async function displayContactsByAlphabet() {
  contactsArray = [];
  //saveBasicContacts();
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

function contactItemClicked(itemElement) {
  document.querySelectorAll(".contact-item").forEach((item) => item.classList.remove("clicked-color"));
  itemElement.classList.add("clicked-color");
  document.querySelectorAll(".contact-name").forEach((name) => name.classList.remove("color-white"));
  const nameElement = itemElement.querySelector(".contact-name");
  if (nameElement) {
    nameElement.classList.add("color-white");
  }
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
