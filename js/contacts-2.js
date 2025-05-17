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
    let detailView = document.getElementById("contactDetailView");
    if (!detailView.classList.contains("d-none")) {
      const vars = getContactVars({ name: newName });
      detailView.innerHTML = generateContactDetails(vars.bg, vars.initials, newName, newEmail, newPhone);
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
    const user = JSON.parse(localStorage.getItem('user')); // Correct this line
    if (!user) return;
    const userName = user.name;
    if (userName === 'Guest') {
      button.classList.add('adding-disabled');
    }
  }
  
  //function showAddingContactNotPossible() {
  //  const user = JSON.parse(localStorage.getItem('user')); 
  //  if (!user) return;
  //  if (user.name === 'Guest') {
  //    alert('Guests cannot add contacts. Please, log in first');
  //  }
  //}
  
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