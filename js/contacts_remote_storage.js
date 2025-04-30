async function saveBasicContacts() {
    for (let i = 0; i < basicContacts.length; i++) {
        const contact = basicContacts[i];
        const safeKey = sanitizeEmail(contact.email);
        const path = 'contacts/' + safeKey;

        const exists = await isDuplicateEmail(path);
        if (!exists) {
            await putData(path, contact);
        } else {
            continue;
        }
    }
}


async function getNewContactData() {
    const nameInput = document.getElementById('contactName');
    const nameValue = nameInput.value;
    const emailInput = document.getElementById('contactEmail');
    const emailValue = emailInput.value;
    const phoneInput = document.getElementById('contactPhone');
    const phoneValue = phoneInput.value;

    return {nameValue, emailValue, phoneValue};
}

async function saveNewContactToDataBase() {
    const {nameValue, emailValue, phoneValue} = await getNewContactData();
    const filled = inputsFilledOut({nameValue, emailValue, phoneValue});
    const safeKey = sanitizeEmail(emailValue);
    const path = 'contacts/' + safeKey;
    if (!filled) return;

    const exists = await doesContactExists({emailValue});
    if (exists) {
        alert("contact already exists");
        return;
    } else {
        contactsArray = [];
        putData(path, {name: nameValue, email: emailValue, phone: phoneValue});
        contactsArray.push({name: nameValue, email: emailValue, phone: phoneValue});
    }

}

function inputsFilledOut({nameValue, emailValue, phoneValue}) {
    if (nameValue == "" || emailValue == "" || phoneValue == "") {
        return false;
    } else {
        return true;
    }
}

async function doesContactExists({emailValue}) {
    const response = await fetch(BASE_URL + 'contacts/' + '.json');
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
        const response = await fetch(BASE_URL + 'contacts/' + '.json');
        const data = await response.json();

        for (const contact of Object.values(data)) {
            contactsArray.push(contact);
        }
    }


    async function deleteContact(email) {
        const deletedContact = contactsArray.find((contact) => contact.email.toLowerCase() === email.toLowerCase());
        contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== email.toLowerCase());
        const deletedContactKey = sanitizeEmail(deletedContact.email);
        await deleteData('contacts/' + deletedContactKey);
        renderContacts();
        backToContacts();
        hideContactDetailView();
      }

      async function deleteContactForEdit() {
        if (!currentContact) return;
        if (!confirm("Möchten Sie diesen Kontakt wirklich löschen?")) return;
    
        const deletedContact = contactsArray.find((contact) => contact.email.toLowerCase() === currentContact.email.toLowerCase());
        const deletedContactEmail = deletedContact.email;
        console.log(deletedContact.email);
        const deletedContactKey = sanitizeEmail(deletedContactEmail);
        console.log(deletedContactKey);
        contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
        await deleteData('contacts/' + deletedContactKey);
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
        await updateEditedContactInFireBase(currentContact.email, {newName, newEmail, newPhone});
        renderContacts();
      
        updateDetailView(newName, newEmail, newPhone);
      
        closeEditContactOverlay();
        currentContact = null;
      }

      async function updateEditedContactInFireBase(email, {newName, newEmail, newPhone}) {
        const contactKey = sanitizeEmail(email);
        await deleteData('contacts/' + contactKey);
        const newContactKey = sanitizeEmail(newEmail);
        await putData('contacts/' + newContactKey, {name: newName, email: newEmail, phone: newPhone});
      }

      async function saveContactIconInFireBase(contact, initial, bg) {
        let response = await fetch(BASE_URL + 'contacts/' + '.json');
        let data = await response.json();
        const sanitizedEmail = sanitizeEmail(contact.email);

        for (const key in data) {
            if (sanitizedEmail === key) {
                    const existingContact = data[key].icon;
                    if (existingContact.initial === initial && existingContact.bg === bg) return;
                    await putData('contacts/' + sanitizedEmail + '/icon', {initial, bg});
                } else {
                    continue;
                }
        }    
      }
    
      //8. render contacts inside add-task-page on add-task-page load