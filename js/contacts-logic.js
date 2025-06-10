async function saveNewContactToDataBase(event) {
  event.stopPropagation()
  const { nameValue, emailValue, phoneValue } = await getNewContactData();

  if (!inputsFilledOut({ nameValue, emailValue, phoneValue })) {
    showWarningOverlay(incompleteFieldsTemplate());
    return;
  }

  if ((await doesContactExists(emailValue))) {
    showWarningOverlay(emailExistsTemplate());
    return;
  }
  if (!(await validateContactInputs(emailValue, phoneValue, nameValue))) return;

  await saveContact({ nameValue, emailValue, phoneValue });
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
  event.stopPropagation()
  if (!currentContact) return;
  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();
  if (!inputsFilledOut({ nameValue: newName, emailValue: newEmail, phoneValue: newPhone })) {
    showWarningOverlay(incompleteFieldsTemplate());
    return;
  }

  if ((await doesContactExists(newEmail))) {
    showWarningOverlay(emailExistsTemplate());
    return;
  }

  if (!(await validateContactInputs(newEmail, newPhone, newName))) return;

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