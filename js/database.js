const BASE_URL = "https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/";

let taskId = 0;
let contactId = 0;

const currentUser = JSON.parse(localStorage.getItem("user"));
let userEmail = null;

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function putFirstIdForTasksAndContacts(path) {
  const key = await getData(path);
  if (!key) {
    await putData(path, 0);
  }
  return;
}

async function putIdToDataBase(path, id) {
  await putData(path, id);
}

async function getIdFromDataBase(path) {
  try {
    const key = await getData(path);
    if (!key) return 0;
    contactId = key;
    return contactId;
  } catch (error) {
    return 0;
  }
}

async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  return response.json();
}

async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

function sanitizeEmail(email) {
  return email.replace(/[@.]/g, "_");
}

async function isDuplicateEmail(path = "") {
  const response = await fetch(BASE_URL + path + ".json");
  const data = await response.json();
  return data !== null;
}

async function findUserEmail() {
  const contacts = await getData("contacts/");
  if (!contacts) {
    userEmail = "";
    return;
  }
  for (const contact of Object.values(contacts)) {
    if (contact.id === currentUser.id) {
      userEmail = contact.email;
    }
  }
  userEmail = "";
}
