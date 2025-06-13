/**
 * Handles saving a new contact to the database after validating inputs and checking for duplicates.
 *
 * @param {Event} event - The event triggered by the save action.
 * @returns {Promise<void>}
 */
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


/**
 * Checks if a contact with the given email already exists in the database.
 * Shows a warning overlay if the contact exists.
 *
 * @param {string} emailValue - The email to check for existence.
 * @returns {Promise<boolean>} - Returns true if contact exists, false otherwise.
 */
async function contactAlreadyExists(emailValue) {
  if (await doesContactExists(emailValue)) {
    showWarningOverlay(emailExistsTemplate());
    return true;
  }
  return false;
}


/**
 * Deletes a contact by its ID from the database, including related user data and task references.
 * Then updates the UI accordingly.
 *
 * @param {number} id - The ID of the contact to delete.
 * @returns {Promise<void>}
 */
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


/**
 * Deletes the contact currently being edited via the edit contact overlay.
 * Removes contact from contacts and users databases, updates tasks accordingly,
 * then refreshes the contact list, closes the edit overlay, hides detail view,
 * and clears the currentContact reference.
 *
 * @returns {Promise<void>}
 */
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


/**
 * Handles saving the edited contact data after validating inputs and checking for duplicates.
 * Stops event propagation, validates the edited contact fields,
 * checks if the new email already exists, then proceeds to update contact data.
 *
 * @param {Event} event - The event triggered by the save action.
 * @returns {Promise<void>}
 */
async function saveEditedContact(event) {
  event.stopPropagation();
  if (!currentContact) return;

  const editedData = getEditedContactData();
  if (!validateEditedContactData(editedData)) return;

  if (await contactAlreadyExists(editedData.newEmail)) return;

  if (!(await validateContactInputs(editedData.newEmail, editedData.newPhone, editedData.newName))) return;

  await processContactUpdate(editedData);
}


/**
 * Processes updating a contact's data by updating local array, Firebase,
 * related tasks, UI detail view, and closing the edit overlay.
 *
 * @param {Object} param0 - Edited contact details.
 * @param {string} param0.newName - The updated contact name.
 * @param {string} param0.newEmail - The updated contact email.
 * @param {string} param0.newPhone - The updated contact phone number.
 * @returns {Promise<void>}
 */
async function processContactUpdate({ newName, newEmail, newPhone }) {
  updateContactArray(newName, newEmail, newPhone);
  await updateEditedContactInFireBase(currentContact.email, { newName, newEmail, newPhone }, currentContact.id);
  await adjustChangedContactInTasks(putData);
  await updateDetailView(newName, newEmail, newPhone);
  renderContacts();
  closeEditContactOverlay();
  currentContact = null;
}


/**
 * Extracts initials from a given name string.
 * Removes trailing " (You)" suffix before processing.
 * Returns first letter of single name or first letters of first and last name.
 *
 * @param {string} name - Full name of the contact.
 * @returns {string} Initials in uppercase.
 */
function getInitials(name) {
    const cleanName = name.replace(/ \(You\)$/, "");
    const parts = cleanName.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }


/**
 * Retrieves initials and background color for a contact's name,
 * and saves the contact icon (initials and background) to Firebase.
 *
 * @param {Object} c - Contact object with a 'name' property.
 * @returns {{initial: string, bg: string}} - The initials and background color.
 */
function getContactVars(c) {
    let initial = getInitials(c.name);
    let bg = getBackgroundForName(c.name);
    saveContactIconInFireBase(c, initial, bg);
    return { initial, bg };
  }


  /**
 * Generates a background image/color for a given name by summing character codes
 * and using the result to index into the predefined bgImages array.
 *
 * @param {string} name - The name to generate the background for.
 * @returns {string} - The selected background image/color.
 */
function getBackgroundForName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    const index = sum % bgImages.length;
    return bgImages[index];
  }


/**
 * Clears the input values for the contact form fields: name, email, and phone.
 */
function deleteValue() {
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactPhone").value = "";
  }


/**
 * Groups contacts by the first letter of their display name (case-insensitive).
 *
 * @param {Array} contacts - Array of contact objects with a displayName property.
 * @returns {Object} An object where keys are uppercase letters and values are arrays of contacts starting with that letter.
*/
function groupContactsByFirstLetter(contacts) {
    const groups = {};
    contacts.forEach((c) => {
      const letter = c.displayName[0].toUpperCase();
      (groups[letter] = groups[letter] || []).push(c);
    });
    return groups;
  }