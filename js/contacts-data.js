const user = JSON.parse(localStorage.getItem("user"));

let currContactData = [];

let currentContact = null;

let detailViewOpen = false;

let contactsArray = [];

const basicContacts = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1 555-123-4567",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+1 555-987-6543",
  },
  {
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    phone: "+1 555-222-3344",
  },
  {
    name: "Diana Adams",
    email: "diana.adams@example.com",
    phone: "+1 555-444-7788",
  },
  {
    name: "Ethan Wright",
    email: "ethan.wright@example.com",
    phone: "+1 555-666-1122",
  },
  {
    name: "Fiona Green",
    email: "fiona.green@example.com",
    phone: "+1 555-321-7654",
  },
  {
    name: "George Harris",
    email: "george.harris@example.com",
    phone: "+1 555-888-9900",
  },
  {
    name: "Hannah Clark",
    email: "hannah.clark@example.com",
    phone: "+1 555-111-2233",
  },
  {
    name: "Ian Baker",
    email: "ian.baker@example.com",
    phone: "+1 555-444-5566",
  },
  {
    name: "Julia Carter",
    email: "julia.carter@example.com",
    phone: "+1 555-999-0001",
  },
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

async function saveBasicContacts() {
  contactId = await getIdFromDataBase("contactId");
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
  await putIdToDataBase("contactId", contactId);
}


/**
 * Saves a new contact to the database using a sanitized email as the key.
 * Closes the add contact overlay, clears the input values, shows a success overlay,
 * increments and updates the contact ID in the database.
 *
 * @param {Object} param0 - Contact information.
 * @param {string} param0.nameValue - The contact's name.
 * @param {string} param0.emailValue - The contact's email.
 * @param {string} param0.phoneValue - The contact's phone number.
 */
async function saveContact({ nameValue, emailValue, phoneValue }) {
  const safeKey = sanitizeEmail(emailValue);
  contactId = await getIdFromDataBase("contactId");
  await handlePostingToDataBase({ nameValue, emailValue, phoneValue, contactId }, safeKey);
  closeAddContactOverlay();
  deleteValue();
  overlayForContactSuccesfullyCreated();
  contactId += 1;
  await putIdToDataBase("contactId", contactId);
}


/**
 * Posts a new contact to the database at the specified path using the safeKey.
 * Resets the local contactsArray and adds the newly posted contact to it.
 *
 * @param {Object} param0 - Contact details and ID.
 * @param {string} param0.nameValue - The contact's name.
 * @param {string} param0.emailValue - The contact's email.
 * @param {string} param0.phoneValue - The contact's phone number.
 * @param {number} param0.contactId - The unique contact ID.
 * @param {string} safeKey - Sanitized email used as the database key.
 */
async function handlePostingToDataBase({ nameValue, emailValue, phoneValue, contactId }, safeKey) {
  const path = "contacts/" + safeKey;
  contactsArray = [];
  await putData(path, { name: nameValue, email: emailValue, phone: phoneValue, id: contactId });
  contactsArray.push({ name: nameValue, email: emailValue, phone: phoneValue, id: contactId });
}


/**
 * Checks if all input fields (name, email, phone) are filled out (not empty).
 *
 * @param {Object} param0 - Input values.
 * @param {string} param0.nameValue - The name input value.
 * @param {string} param0.emailValue - The email input value.
 * @param {string} param0.phoneValue - The phone input value.
 * @returns {boolean} True if all inputs have values; otherwise false.
 */
function inputsFilledOut({ nameValue, emailValue, phoneValue }) {
  if (nameValue === "" || emailValue === "" || phoneValue === "") {
    return false;
  } else {
    return true;
  }
}


/**
 * Fetches contacts from the database and saves them into the contactsArray,
 * excluding the current user based on email.
 *
 * @async
 * @returns {Promise<void>} Resolves after contacts are loaded into contactsArray.
 */
async function saveContactsToArray() {
  const response = await fetch(BASE_URL + "contacts/" + ".json");
  const data = await response.json();
  if (!data) return;
  for (const contact of Object.values(data)) {
    if (user.email !== contact.email) {
      const contactCopy = { ...contact };
      contactCopy.displayName = contact.name;
      contactsArray.push(contactCopy);
    }
  }
}


/**
 * Updates an edited contact in Firebase by deleting the old entry and adding the updated one.
 * Also updates the current user data if the edited contact matches the current user.
 *
 * @async
 * @param {string} email - The original email key of the contact to update.
 * @param {Object} newContactData - The updated contact details.
 * @param {string} newContactData.newName - The new name for the contact.
 * @param {string} newContactData.newEmail - The new email for the contact.
 * @param {string} newContactData.newPhone - The new phone number for the contact.
 * @param {number|string} id - The contact's unique identifier.
 * @returns {Promise<void>} Resolves when the update is complete.
 */
async function updateEditedContactInFireBase(email, { newName, newEmail, newPhone }, id) {
  const contactKey = sanitizeEmail(email);
  const newContactKey = sanitizeEmail(newEmail);
  await deleteData("contacts/" + contactKey);
  await putData("contacts/" + newContactKey, { name: newName, email: newEmail, phone: newPhone, id: id });
  await updateUserIfContactIsUser(contactKey, newContactKey, { name: newName, email: newEmail, phone: newPhone, id: id });
}


/**
 * Updates the current user's data in Firebase if their contact key matches the old contact key.
 * Deletes the old user data and writes the updated data with the new contact key.
 *
 * @async
 * @param {string} contactKey - The old contact key (email-based).
 * @param {string} newContactKey - The new contact key after editing.
 * @param {Object} newContactData - The updated contact details.
 * @param {string} newContactData.name - New name of the user.
 * @param {string} newContactData.email - New email of the user.
 * @param {string} newContactData.phone - New phone number of the user.
 * @param {number|string} newContactData.id - The user's unique identifier.
 * @returns {Promise<void>} Resolves when user update is complete.
 */
async function updateUserIfContactIsUser(contactKey, newContactKey, { name: newName, email: newEmail, phone: newPhone, id }) {
  const users = await getData("ourUsers/");
  for (const user of Object.keys(users || {})) {
    if (user === contactKey) {
      await deleteData("ourUsers/" + contactKey);
      await putData("ourUsers/" + newContactKey, { name: newName, email: newEmail, phone: newPhone, id });
    }
  }
}


/**
 * Saves or updates the contact icon (initials and background color) in Firebase for a given contact.
 *
 * @async
 * @param {Object} contact - The contact object containing at least an email property.
 * @param {string} initial - The initials to be saved for the contact.
 * @param {string} bg - The background color associated with the contact.
 * @returns {Promise<void>} Resolves when the icon is saved or updated in Firebase.
 */
async function saveContactIconInFireBase(contact, initial, bg) {
  let response = await fetch(BASE_URL + "contacts/" + ".json");
  let data = await response.json();
  if (contact.email) {
    const sanitizedEmail = sanitizeEmail(contact.email);
    await iterateAndsaveIcon(data, sanitizedEmail, initial, bg);
  }
}


/**
 * Iterates over contact data and saves the icon (initial and background) for the specified contact if needed.
 *
 * @async
 * @param {Object} data - The full contacts data object from Firebase.
 * @param {string} sanitizedEmail - The sanitized email key to identify the contact.
 * @param {string} initial - The initials to save for the contact icon.
 * @param {string} bg - The background color to save for the contact icon.
 * @returns {Promise<void>} Resolves after the icon is updated or skipped if unchanged.
 */
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


/**
 * Retrieves updated contact information by ID, including background and initials.
 *
 * @async
 * @param {number} id - The unique identifier of the contact.
 * @returns {Promise<Object|undefined>} An object with updated contact info (name, id, bg, initial) or undefined if not found.
 */
async function getUpdatedContact(id) {
  const rawContacts = await getData("contacts/");
  if (!rawContacts) return;
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


/**
 * Updates changed contact details in all tasks by applying the given HTTP method function.
 *
 * @async
 * @param {function} httpMethodFunc - An async function to update data in the database, e.g., putData or patchData.
 * @returns {Promise<void>}
 */
async function adjustChangedContactInTasks(httpMethodFunc) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
      if (!task.contacts) continue;
      for (const [contactKey, contact] of Object.entries(task.contacts)) {
        if (!contact) continue;
        if (currContactData.id === contact.id) {
          const contactInfo = await getUpdatedContact(contact.id);
          await httpMethodFunc(`board/${columnKey}/${taskKey}/contacts/${contactKey}`, contactInfo);
        }
      }
    }
  }
}


/**
 * Retrieves new contact data from input fields in the DOM.
 *
 * @async
 * @returns {Promise<{nameValue: string, emailValue: string, phoneValue: string}>} - Object containing contact name, email, and phone values.
 */
async function getNewContactData() {
  const nameInput = document.getElementById("contactName");
  const nameValue = nameInput.value;
  const emailInput = document.getElementById("contactEmail");
  const emailValue = emailInput.value;
  const phoneInput = document.getElementById("contactPhone");
  const phoneValue = phoneInput.value;
  return { nameValue, emailValue, phoneValue };
}


/**
 * Adds a new contact object to the contacts array.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 */
function newContactPushToArray(name, email, phone) {
  const newContact = { name, email, phone };
  contactsArray.push(newContact);
}


/**
 * Updates the contacts array by removing the old contact (matching currentContact email)
 * and adding the updated contact details.
 *
 * @param {string} newName - Updated contact name.
 * @param {string} newEmail - Updated contact email.
 * @param {string} newPhone - Updated contact phone number.
 */
function updateContactArray(newName, newEmail, newPhone) {
  contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
  contactsArray.push({ email: newEmail, name: newName, phone: newPhone });
}


/**
 * Retrieves trimmed values from the edit contact form inputs.
 *
 * @returns {Object} An object containing newName, newEmail, and newPhone strings.
 */
function getEditedContactData() {
  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();
  return { newName, newEmail, newPhone };
}


/**
 * Returns the DOM element containing the contacts list.
 *
 * @returns {Element|null} The element with class 'contacts-list' or null if not found.
 */
function getContactsContainer() {
  return document.querySelector(".contacts-list");
}