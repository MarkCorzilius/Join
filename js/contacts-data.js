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
  for (let i = 0; i < basicContacts.length; i++) {
    const contact = basicContacts[i];
    const safeKey = sanitizeEmail(contact.email);
    const path = "contacts/" + safeKey;
    const exists = await isDuplicateEmail(path);
    if (!exists) {
      contact.id = await getContactIdFromDataBase();
      await putData(path, contact);
      contactId += 1;
    } else {
      continue;
    }
  }
  await putIdToDataBase("contactId", contactId);
}


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


async function adjustChangedContactInTasks(httpMethodFunc) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
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


async function getNewContactData() {
  const nameInput = document.getElementById("contactName");
  const nameValue = nameInput.value;
  const emailInput = document.getElementById("contactEmail");
  const emailValue = emailInput.value;
  const phoneInput = document.getElementById("contactPhone");
  const phoneValue = phoneInput.value;
  return { nameValue, emailValue, phoneValue };
}


function newContactPushToArray(name, email, phone) {
  const newContact = { name, email, phone };
  contactsArray.push(newContact);
}


function updateContactArray(newName, newEmail, newPhone) {
  contactsArray = contactsArray.filter((contact) => contact.email.toLowerCase() !== currentContact.email.toLowerCase());
  contactsArray.push({ email: newEmail, name: newName, phone: newPhone });
}