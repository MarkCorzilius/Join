let currContactData = [];

async function contactsOnLoad() {
  w3.includeHTML();

    const waitForInclude = () => new Promise((resolve) => {
        const checkExist = setInterval(() => {
          const sidebarLoaded = document.querySelector('#sidebar');
          const headerLoaded = document.querySelector('#header');
          if (sidebarLoaded && headerLoaded) {
            clearInterval(checkExist);
            resolve();
          }
        }, 50);
      });
    try {
    await waitForInclude();
    markCurrentPage();
    ifGuestShowDropdownHelp(); 
    adjustInitialAfterLogin();
    renderContacts();
    findUserEmail();

    adjustHelpForMobile();
    window.addEventListener('resize', adjustHelpForMobile);

  } catch (error) {
    console.log('error in contactsOnLoad()')
  }
}

const basicContacts = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1 555-123-4567"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+1 555-987-6543"
  },
  {
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    phone: "+1 555-222-3344"
  },
  {
    name: "Diana Adams",
    email: "diana.adams@example.com",
    phone: "+1 555-444-7788"
  },
  {
    name: "Ethan Wright",
    email: "ethan.wright@example.com",
    phone: "+1 555-666-1122"
  },
  {
    name: "Fiona Green",
    email: "fiona.green@example.com",
    phone: "+1 555-321-7654"
  },
  {
    name: "George Harris",
    email: "george.harris@example.com",
    phone: "+1 555-888-9900"
  },
  {
    name: "Hannah Clark",
    email: "hannah.clark@example.com",
    phone: "+1 555-111-2233"
  },
  {
    name: "Ian Baker",
    email: "ian.baker@example.com",
    phone: "+1 555-444-5566"
  },
  {
    name: "Julia Carter",
    email: "julia.carter@example.com",
    phone: "+1 555-999-0001"
  }
];

let contactsArray = [
];

const bgImages = [
  "../img/variante1.png",
  "../img/variante2.png",
  "../img/variante3.png",

  "../img/variante4.png",
  "../img/variante5.png",
  "../img/variante6.png",

  "../img/variante7.png",
  "../img/variante8.png",
  "../img/variante9.png",

  "../img/variante10.png",
  "../img/variante11.png",
  "../img/variante12.png",

  "../img/variante13.png",
  "../img/variante14.png",
  "../img/variante15.png",
];


let currentContact = null;
let detailViewOpen = false;


async function renderContacts() {
  document.querySelector('.spinner-overlay').style.display = "block";
  try {
    contactsArray = [];
    await saveBasicContacts();
    await saveContactsToArray();
    contactsArray.sort((a, b) => a.displayName.localeCompare(b.displayName)); // Sort by displayName
    const container = document.querySelector(".contacts-list");
    if (!container) return;
  
    const groups = {};
    contactsArray.forEach((c) => {
      const letter = c.displayName[0].toUpperCase(); // Use displayName for grouping
      (groups[letter] = groups[letter] || []).push(c);
    });
  
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
  } catch (error) {
    console.log('rendering contacts failed');
  } finally {
    document.querySelector('.spinner-overlay').style.display = 'none';
  }
}

function getInitials(name) {
  const cleanName = name.replace(/ \(You\)$/, '');

  const parts = cleanName.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getContactVars(c) {
    let initials = getInitials(c.name);
    let bg = getBackgroundForName(c.name);
    saveContactIconInFireBase(c, initials, bg);
    return {initials, bg};
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
    const button = document.querySelector('.mobile-contact-details');
    const contacts = document.getElementById("contacts");
    const contactDetailContainer = document.getElementById("contactDetailContainer");
    const backArrow = document.getElementById("backArrow");
    if (contacts && contactDetailContainer && backArrow) {
      contacts.classList.add("d-none");
      contactDetailContainer.classList.add("d-flex");
      contactDetailContainer.classList.remove("d-none");
      backArrow.classList.remove("d-none");
      button.style.display = 'flex';

    }
  }
}

function backToContacts() {
  if (document.documentElement.clientWidth < 800) {
    const button = document.querySelector('.mobile-contact-details');
    const contacts = document.getElementById("contacts");
    const contactDetailContainer = document.getElementById("contactDetailContainer");
    const backArrow = document.getElementById("backArrow");

    if (contacts && contactDetailContainer && backArrow) {
      contacts.classList.remove("d-none");
      contactDetailContainer.classList.remove("d-flex");
      contactDetailContainer.classList.add("d-none");
      backArrow.classList.add("d-none");
      button.style.display = 'none';
      detailViewOpen = false;
    }
  }
}


window.addEventListener("resize", function () {
  const browserWidth = document.documentElement.clientWidth;
  let contacts = document.getElementById("contacts");
  let contactDetailContainer = document.getElementById("contactDetailContainer");
  let backArrow = document.getElementById("backArrow");
  if (!contacts || !contactDetailContainer || !backArrow) return;

  if (browserWidth >= 800) {
    // Desktop: Beide Bereiche anzeigen, Rück-Button verstecken
    contacts.classList.remove("d-none");
    contactDetailContainer.classList.remove("d-none");
    contactDetailContainer.classList.add("d-flex");
    backArrow.classList.add("d-none");
  } else {
    // Mobile: Unterschiedliche Zustände abhängig vom detailViewOpen-Zustand
    if (detailViewOpen) {
      // Detailbereich ist offen: Kontakte ausblenden, Detailbereich anzeigen, Rück-Button sichtbar machen
      contacts.classList.add("d-none");
      contactDetailContainer.classList.remove("d-none");
      contactDetailContainer.classList.add("d-flex");
      backArrow.classList.remove("d-none");
    } else {
      // Detailbereich ist geschlossen: Kontakte anzeigen, Detailbereich ausblenden, Rück-Button ausblenden
      contacts.classList.remove("d-none");
      contactDetailContainer.classList.remove("d-flex");
      contactDetailContainer.classList.add("d-none");
      backArrow.classList.add("d-none");
    }
  }
});


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
      <div class="edit-delete">
        <h2 id="detailName">${name}</h2>
        <img src="/img/edit_contacts.png" alt="" onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}') ">
        <img src="/img/delete-contact.png" alt="" onclick="deleteContact('${email}')">
      </div>
    </div>
    <div class="email-phone">
      <p>Contact Information</p>
      <b>Email</b>
      <p class="email" id="detailEmail">${email}</p>
      <b>Phone</b>
      <p class="phone" id="detailPhone">${phone}</p>
    </div>
  `;
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

function openAddContactOverlay() {
  const addContactOverlay = document.getElementById("addContactOverlay");
  addContactOverlay.classList.remove("d-none");
  setTimeout(() => addContactOverlay.classList.add("show"), 10);
  const overlayAddContent = addContactOverlay.querySelector(".overlay-add-content");
  setTimeout(() => overlayAddContent.classList.add("slide-in"), 10);
}

function closeAddContactOverlay() {
  emptyContactForm();
  const addContactOverlay = document.getElementById("addContactOverlay");
  const overlayAddContent = addContactOverlay.querySelector(".overlay-add-content");
  overlayAddContent.classList.remove("slide-in");
  addContactOverlay.classList.remove("show");
  setTimeout(() => addContactOverlay.classList.add("d-none"), 300);
}

document.addEventListener("DOMContentLoaded", function () {
  const addContactOverlay = document.getElementById("addContactOverlay");
  if (addContactOverlay) {
    addContactOverlay.addEventListener("click", function (e) {
      if (e.target === this) {
        closeAddContactOverlay();
      }
    });
  }
});

function saveNewContact() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  if (!validateContactInput(name, email, phone)) return;
  if (contactExists(email)) return;
  newContactPushToArray(name, email, phone);
  renderContacts();
  closeAddContactOverlay();
  deleteValue();
  overlayForContactSuccesfullyCreated();
}


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

function deleteValue() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
}


function editContact(name, email, phone, initials, bg) {
  currentContact = { name, email, phone };
  let editContactOverlay = document.getElementById("editContactOverlay");
  editContactOverlay.classList.remove("d-none");
  setTimeout(() => editContactOverlay.classList.add("show"), 10);
  const overlayEditContactOverlay = editContactOverlay.querySelector(".overlay-edit-content");
  setTimeout(() => overlayEditContactOverlay.classList.add("slide-in"), 10);
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  let editAvatar = document.getElementById("editAvatar");
  editAvatar.style.backgroundImage = `url(${bg})`;
  editAvatar.innerHTML = `
      ${initials}
  `;
}

function updateContactArray(newName, newEmail, newPhone) {

    contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
    contactsArray.push({ email: newEmail, name: newName, phone: newPhone});
}

function updateDetailView(newName, newEmail, newPhone) {
  // Aktualisiere die Detailansicht, wenn sie sichtbar ist
  let detailView = document.getElementById("contactDetailView");
  if (!detailView.classList.contains("d-none")) {
    const vars = getContactVars({ name: newName });
    detailView.innerHTML = generateContactDetails(vars.bg, vars.initials, newName, newEmail, newPhone);
    // Optional: erneuter Slide-Effekt
    slideEfekt();
  }
}

function closeEditContactOverlay(email) {
  const editContactOverlay = document.getElementById("editContactOverlay");
  const overlayEditContent = editContactOverlay.querySelector(".overlay-edit-content");
  overlayEditContent.classList.remove("slide-in");
  editContactOverlay.classList.remove("show");
  setTimeout(() => editContactOverlay.classList.add("d-none"), 300);
}

function emptyContactForm() {
  const nameInput = document.getElementById('contactName');
  nameInput.value = "";
  const emailInput = document.getElementById('contactEmail');
  emailInput.value = "";
  const phoneInput = document.getElementById('contactPhone');
  phoneInput.value = "";
}

function makeCancelBtnLight() {
  setTimeout(() => {
    document.getElementById('overlayCancelIcon').src = '../img/full-cancel-btn-hovered.png';
  }, 100);
}

function makeCancelBtnDark() {
  setTimeout(() => {
    document.getElementById('overlayCancelIcon').src = '../img/full-cancel-btn.png';
  }, 100);
}

function disableAddContactIfGuest() {
  const button = document.getElementById('addContactBtn');
  const user = localStorage.getItem(JSON.parse(user));
  const userName = user.name;
  if (userName === 'Guest') {
    button.classList.add('adding-disabled');
  }
}

function showMobileContactDetails() {
  const overlay = document.getElementById('mobileDetailsOverlay');
  const dialog = document.querySelector('.mobile-detail-dialog');
  renderMobileControl();
  overlay.style.display = 'flex';
  requestAnimationFrame(() => dialog.classList.add('open'));
}

function hideMobileDetails() {
  const overlay = document.getElementById('mobileDetailsOverlay');
  const dialog = document.querySelector('.mobile-detail-dialog');
  dialog.classList.remove('open');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 500);
}

function renderMobileControl() {
  const container = document.getElementById('mobileDetailsDialog');
  const { name, email, phone, initials, bg } = currContactData;
  container.innerHTML = `<img onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}')" src="../img/edit_contacts.png" alt="">
        <img onclick="deleteContact('${email}')" src="../img/delete-contact.png" alt="">`;
}

function hideMobileDetailsOnResize() {
  const arrow = document.getElementById('backArrow');
  const container = document.getElementById('mobileDetailsOverlay');
  const panel = document.querySelector('.mobile-contact-details');

  if (arrow.classList.contains('d-none')) {
      container.style.display = 'none';
      panel.style.display = 'none';
      return;
  } else if (window.innerWidth <= 800 || !arrow.classList.contains('d-none')) {
      container.style.display = 'flex';
      panel.style.display = 'flex';
  } else {
    container.style.display = 'none';
    panel.style.display = 'none';
  }
}