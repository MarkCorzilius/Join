const BASE_URL = "https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/";


let taskId = 0;
let contactId = 0;


const currentUser = JSON.parse(localStorage.getItem("user"));
let userEmail = null;


/**
 * Sends a POST request with JSON data to the specified Firebase path.
 * @param {string} path - Firebase endpoint path.
 * @param {Object} data - Data to be sent in the request body.
 * @returns {Promise<Object>} - Response data from the server.
 */
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


/**
 * Ensures the initial ID value at the specified path is set to 0 if not present.
 * @param {string} path - Firebase path to check and update.
 * @returns {Promise<void>}
 */
async function putFirstIdForTasksAndContacts(path) {
  const key = await getData(path);
  if (!key) {
    await putData(path, 0);
  }
  return;
}


/**
 * Stores the given ID at the specified Firebase path.
 * @param {string} path - Firebase path to update.
 * @param {number} id - ID value to store.
 * @returns {Promise<void>}
 */
async function putIdToDataBase(path, id) {
  await putData(path, id);
}


/**
 * Retrieves an ID from the specified Firebase path, returning 0 if not found or on error.
 * @param {string} path - Firebase path to fetch the ID from.
 * @returns {Promise<number>} - The retrieved ID or 0.
 */
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


/**
 * Fetches data from the specified Firebase path.
 * @param {string} [path=""] - Firebase endpoint path.
 * @returns {Promise<Object>} - Parsed JSON response data.
 */
async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  return response.json();
}


/**
 * Sends a PUT request with JSON data to the specified Firebase path.
 * @param {string} [path=""] - Firebase endpoint path.
 * @param {Object} data - Data to be stored.
 * @returns {Promise<Object>} - Response data from the server.
 */
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


/**
 * Sends a DELETE request to remove data at the specified Firebase path.
 * @param {string} [path=""] - Firebase endpoint path.
 * @returns {Promise<Object>} - Response data from the server.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}


/**
 * Replaces '@' and '.' characters in an email with underscores.
 * @param {string} email - The email string to sanitize.
 * @returns {string} - The sanitized email string.
 */
function sanitizeEmail(email) {
  return email.replace(/[@.]/g, "_");
}


/**
 * Checks if data exists at the specified Firebase path, indicating a duplicate email.
 * @param {string} [path=""] - Firebase endpoint path.
 * @returns {Promise<boolean>} - True if data exists, false otherwise.
 */
async function isDuplicateEmail(path = "") {
  const response = await fetch(BASE_URL + path + ".json");
  const data = await response.json();
  return data !== null;
}


/**
 * Retrieves the current user's email from contacts data.
 * @returns {Promise<void>}
 */
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
