async function saveNewContactToDataBase(event) {
  event.stopPropagation();
  const contactData = await getNewContactData();
  if (!validateContactData(contactData)) return;
  if (await contactAlreadyExists(contactData.emailValue)) return;
  if (!(await validateContactInputs(
    contactData.emailValue,
    contactData.phoneValue,
    contactData.nameValue
  ))) return;
  await saveContact(contactData);
}


async function contactAlreadyExists(emailValue) {
  if (await doesContactExists(emailValue)) {
    showWarningOverlay(emailExistsTemplate());
    return true;
  }
  return false;
}


async function deleteContact(id) {
  const contacts = await getData("contacts/");
  for (const [contactKey, contact] of Object.entries(contacts)) {
    if (contact.id === id) {
      await deleteData("contacts/" + contactKey);
      await deleteData("ourUsers/" + contactKey);
      await adjustChangedContactInTasks(deleteData);
    }
  }
  renderContacts();
  backToContacts();
  hideContactDetailView();
}


async function deleteContactForEdit() {
  if (!currentContact) return;
  const contacts = await getData("contacts/");
  for (const [contactKey, contact] of Object.entries(contacts)) {
    if (contact.id === currentContact.id) {
      await deleteData("contacts/" + contactKey);
      await deleteData("ourUsers/" + contactKey);
      await adjustChangedContactInTasks(deleteData);
    }
  }
  renderContacts();
  closeEditContactOverlay();
  hideContactDetailView();
  currentContact = null;
}


async function saveEditedContact(event) {
  event.stopPropagation();
  if (!currentContact) return;

  const editedData = getEditedContactData();
  if (!validateEditedContactData(editedData)) return;

  if (await contactAlreadyExists(editedData.newEmail)) return;

  if (!(await validateContactInputs(editedData.newEmail, editedData.newPhone, editedData.newName))) return;

  await processContactUpdate(editedData);
}


async function processContactUpdate({ newName, newEmail, newPhone }) {
  updateContactArray(newName, newEmail, newPhone);
  await updateEditedContactInFireBase(currentContact.email, { newName, newEmail, newPhone }, currentContact.id);
  await adjustChangedContactInTasks(putData);
  await updateDetailView(newName, newEmail, newPhone);
  renderContacts();
  closeEditContactOverlay();
  currentContact = null;
}


function getInitials(name) {
    const cleanName = name.replace(/ \(You\)$/, "");
    const parts = cleanName.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }


  function getContactVars(c) {
    let initial = getInitials(c.name);
    let bg = getBackgroundForName(c.name);
    saveContactIconInFireBase(c, initial, bg);
    return { initial, bg };
  }


  function getBackgroundForName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    const index = sum % bgImages.length;
    return bgImages[index];
  }


  function deleteValue() {
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactPhone").value = "";
  }


  function groupContactsByFirstLetter(contacts) {
    const groups = {};
    contacts.forEach((c) => {
      const letter = c.displayName[0].toUpperCase();
      (groups[letter] = groups[letter] || []).push(c);
    });
    return groups;
  }