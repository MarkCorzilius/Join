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
    disableAddContactIfGuest();
    adjustHelpForMobile();
    window.addEventListener("resize", adjustHelpForMobile);
  } catch (error) {
    console.log("Error in initializeContactsPage()", error);
  }
}

async function renderContacts() {
  document.querySelector(".spinner-overlay").style.display = "block";
  try {
    await displayContactsByAlphabet();
  } catch (error) {
    console.log("rendering contacts failed");
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
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

function generateContactHTML(c, vars) {
  return `<div class="contact-item" onclick="openContactItem('${c.name}', '${c.email}', '${c.phone}'); contactItemClicked(this)">
  <div class="contact-initials" style="background-image:url('${vars.bg}'); background-size:cover; background-position:center;">
          ${vars.initials}
      </div>
      <div class="contact-details">
          <p class="contact-name">${c.name}</p>
          <p class="contact-email">${c.email}</p>
      </div>
  </div>`;
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


function generateContactDetails(bg, initials, name, email, phone) {
  return `
    <div class="detail-avatar-name">
      <div class="contact-detail-avatar" id="detailAvatar" style="background-image: url('${bg}'); background-size: cover; background-position: center;">
        ${initials}
      </div>
      <div class="contact-edit">
        <h2 id="detailName">${name}</h2>
        <div class="edit-or-delete">
          <button class="edit-btn" type="button" onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}')">
            <span class="edit-icon-wrapper icon-left">
              <img class="edit-icon default" src="/img/edit.png" alt="">
              <img class="edit-icon hover" src="/img/edit_hovered.png" alt="">
            </span>
            <p>Edit</p>
          </button>

          <button class="delete-btn" type="button" onclick="deleteContact('${email}')">
            <span class="delete-icon-wrapper icon-left">
              <img class="delete-icon default" src="/img/delete.png" alt="">
              <img class="delete-icon hover" src="/img/delete_hovered.png" alt="">
            </span>
            <p>Delete</p>
          </button>
        </div>
      </div>
    </div>
    <div class="email-phone">
      <p>Contact Information</p>
      <b>Email</b>
      <p class="email" id="detailEmail">${email}</p>
      <b>Phone</b>
      <p class="phone" id="detailPhone">${phone}</p>
    </div>

    <div class="mobile-more-container">
      <button class="mobile-more-btn" onclick="toggleMobileActions('${bg}', '${initials}', '${name}', '${email}', '${phone}')">
        <img src="/img/mobile_more_btn.png" alt="Mehr Optionen">
      </button>
      <div id="mobileActionsMenu" class="mobile-actions d-none">
      </div>
    </div>
  `;
}


function generateToggleMobileHTML(bg, initials, name, email, phone) {
  return `
    <button onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}')">
      <img class="edit" src="/img/edit_task.png" alt="Edit">
    </button>
    <button onclick="deleteContact('${email}')">
      <img class="delete" src="/img/delete_task.png" alt="Delete">
    </button>
  `;
}