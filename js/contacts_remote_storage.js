const user = JSON.parse(localStorage.getItem("user"));

async function saveBasicContacts() {
  for (let i = 0; i < basicContacts.length; i++) {
    const contact = basicContacts[i];
    const safeKey = sanitizeEmail(contact.email);
    const path = "contacts/" + safeKey;
    const exists = await isDuplicateEmail(path);
    if (!exists) {
      contact.id = contactId;
      await putData(path, contact);
      contactId += 1;
    } else {
      continue;
    }
  }
  localStorage.setItem("contactId", contactId);
}

async function getNewContactData() {
  const nameInput = document.getElementById("contactName");
  const nameValue = nameInput.value;
  const emailInput = document.getElementById("contactEmail");
  const emailValue = emailInput.value;
  const phoneInput = document.getElementById("contactPhone");
  const phoneValue = phoneInput.value;

  return { nameValue, emailValue, phoneValue };
}

async function saveNewContactToDataBase() {
  const { nameValue, emailValue, phoneValue } = await getNewContactData();
  const filled = inputsFilledOut({ nameValue, emailValue, phoneValue });
  const safeKey = sanitizeEmail(emailValue);
  const exists = await doesContactExists({ emailValue });
  if (!filled) return;
  if (exists) {
    alert("contact already exists");
    return;
  }
  contactId = Number(localStorage.getItem("contactId"));
  await handlePostingToDataBase({ nameValue, emailValue, phoneValue, contactId }, safeKey);
  contactId += 1;
  localStorage.setItem("contactId", contactId);
}

async function handlePostingToDataBase({ nameValue, emailValue, phoneValue, contactId }, safeKey) {
  const path = "contacts/" + safeKey;
  contactsArray = [];
  await putData(path, { name: nameValue, email: emailValue, phone: phoneValue, id: contactId });
  contactsArray.push({ name: nameValue, email: emailValue, phone: phoneValue, id: contactId });
}

function inputsFilledOut({ nameValue, emailValue, phoneValue }) {
  if (nameValue == "" || emailValue == "" || phoneValue == "") {
    return false;
  } else {
    return true;
  }
}

async function doesContactExists({ emailValue }) {
  const response = await fetch(BASE_URL + "contacts/" + ".json");
  const data = await response.json();
  const sanitizedEmailValue = sanitizeEmail(emailValue);
  for (const key in data) {
    if (data[key].email === sanitizedEmailValue) {
      return true;
    }
  }
  return false;
}

async function saveContactsToArray() {
  const response = await fetch(BASE_URL + "contacts/" + ".json");
  const data = await response.json();
  for (const contact of Object.values(data)) {
    if (user.email !== contact.email) {
      const contactCopy = { ...contact };
      contactCopy.displayName = contact.name;
      contactsArray.push(contactCopy);
    } else {
      console.log("Skipping user:", user.email);
    }
  }
}

// check if contact.id in firebase

async function deleteContact(id) {
  const contacts = await getData("contacts/");
  for (const [contactKey, contact] of Object.entries(contacts)) {
    if (contact.id === id) {
      await deleteData("contacts/" + contactKey);
      await deleteData("ourUsers/" + contactKey);
    }
  }
  renderContacts();
  backToContacts();
  hideContactDetailView();
}

async function deleteContactForEdit() {
  if (!currentContact) return;
  if (!confirm("Möchten Sie diesen Kontakt wirklich löschen?")) return;
  const contacts = await getData("contacts/");
  for (const [contactKey, contact] of Object.entries(contacts)) {
    if (contact.id === currentContact.id) {
      await deleteData("contacts/" + contactKey);
      await deleteData("ourUsers/" + contactKey);
    }
  }
  renderContacts();
  closeEditContactOverlay();
  hideContactDetailView();
  currentContact = null;
}

function hideContactDetailView() {
  let detailView = document.getElementById("contactDetailView");
  if (detailView) {
    detailView.classList.add("d-none");
    detailView.innerHTML = "";
  }
}

async function saveEditedContact() {
  if (!currentContact) return;
  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();
  if (!validateContactInput(newName, newEmail, newPhone)) return;
  updateContactArray(newName, newEmail, newPhone);
  await updateEditedContactInFireBase(currentContact.email, { newName, newEmail, newPhone }, currentContact.id);
  await adjustChangedContactInTasks();
  await updateDetailView(newName, newEmail, newPhone);
  renderContacts();
  closeEditContactOverlay();
  currentContact = null;
}

async function updateEditedContactInFireBase(email, { newName, newEmail, newPhone }, id) {
  const contactKey = sanitizeEmail(email);
  const newContactKey = sanitizeEmail(newEmail);
  await deleteData("contacts/" + contactKey);
  await putData("contacts/" + newContactKey, { name: newName, email: newEmail, phone: newPhone, id: id });
  await updateUserIfContactIsUser(contactKey, newContactKey, { name: newName, email: newEmail, phone: newPhone, id: id });
}

async function updateUserIfContactIsUser(contactKey, newContactKey, { name: newName, email: newEmail, phone: newPhone, id }) {
  const users = await getData("ourUsers/");
  for (const user of Object.keys(users || {})) {
    if (user === contactKey) {
      await deleteData("ourUsers/" + contactKey);
      await putData("ourUsers/" + newContactKey, { name: newName, email: newEmail, phone: newPhone, id });
    }
  }
}

async function saveContactIconInFireBase(contact, initial, bg) {
  let response = await fetch(BASE_URL + "contacts/" + ".json");
  let data = await response.json();
  if (contact.email) {
    const sanitizedEmail = sanitizeEmail(contact.email);
    await iterateAndsaveIcon(data, sanitizedEmail, initial, bg);
  }
}

async function iterateAndsaveIcon(data, sanitizedEmail, initial, bg) {
  for (const key in data) {
    if (sanitizedEmail === key) {
      const existingIcon = data[key].icon;
      if (existingIcon && existingIcon.initial === initial && existingIcon.bg === bg) return;
      await putData("contacts/" + sanitizedEmail + "/icon", { initial, bg });
    } else {
      continue;
    }
  }
}

async function getUpdatedContact(id) {
  const rawContacts = await getData("contacts/");
  const contacts = Object.values(rawContacts);
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.id === id) {
      const contactInfo = {
        name: contact.name,
        id: contact.id,
        bg: getBackgroundForName(contact.name),
        initial: await getInitials(contact.name),
      };
      return contactInfo;
    }
  }
}

async function adjustChangedContactInTasks() {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
      for (const [contactKey, contact] of Object.entries(task.contacts)) {
        if (currContactData.id === contact.id) {
          const contactInfo = await getUpdatedContact(contact.id);
            await putData(`board/${columnKey}/${taskKey}/contacts/${contactKey}`, contactInfo);
        }
      }
    }
  }
}
