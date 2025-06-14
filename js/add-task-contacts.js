let chosenContacts = [];
let defaultContacts = [];
let currentIndex = 0;
const CHUNK_SIZE = 10;

let startIndex = 0;
const offsetIndex = 3;


/**
 * This func() render a chunk of contacts
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content.
 * @returns if there is no more contacts to show, it returns the func();
 */
async function renderNextChunk(contactsContainer) {
  const nextChunk = getNextContactChunk();

  removeMoreContactsButton();
  if (nextChunk.length === 0) return;

  await renderContactChunk(nextChunk, contactsContainer);
  currentIndex += CHUNK_SIZE;
  insertMoreContactsButtonIfNeeded(contactsContainer);
}


/**
 * Gets and returns the next chunk of contacts from the default list.
 * 
 * @returns {Array} A portion of the contacts array starting from the current index.
 */
function getNextContactChunk() {
  return defaultContacts.slice(currentIndex, currentIndex + CHUNK_SIZE);
}


/**
 * 
 * @param {Array<Object>} chunk - An array of contact objects, each containing contact information.
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content.
 */
async function renderContactChunk(chunk, contactsContainer) {
  for (const user of chunk) {
    await renderDefaultUsers(user, contactsContainer);
    contactsContainer.scrollTo({
      top: contactsContainer.scrollHeight,
      behavior: "smooth"
    });
  }
}


/**
 * This func() removes button to render more contacts in contacts dropdown.
 */
function removeMoreContactsButton() {
  const btn = document.getElementById("moreContactsContainer");
  if (btn) btn.remove();
}


/**
 * Inserts a "load more contacts" button into the container if there are more contacts to show.
 *  
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content. 
 */
function insertMoreContactsButtonIfNeeded(contactsContainer) {
  if (currentIndex < defaultContacts.length) {
    contactsContainer.insertAdjacentHTML("beforeend", moreContactsBtnTemplate());
  }
}


/**
 * Fetches contacts from the database and renders them into the specified container.
 * If no contacts exist, a "no contacts" message is rendered instead.
 * 
 * @param {string} currentContainer – An id where the contacts should be rendered inside.
 * @returns {void}
 */
async function fetchContacts(currentContainer) {
  let contactsContainer = document.getElementById(currentContainer);
  contactsContainer.innerHTML = "";
  let response = await fetch(BASE_URL + "contacts/" + ".json");
  let contacts = await response.json();
  if (!contacts && currentContainer !== "contactsContainer") {
    contactsContainer.innerHTML = getNoContactsTemplate();
    return;
  }
  await sortAndRenderFetchedContacts(contacts, contactsContainer);
}


/**
 * Sorts all contacts into user and default groups, then passes them to the appropriate renderers.
 * 
 * @param {Array<Object>} contacts – An array of contact objects with their information.
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content.
 */
async function sortAndRenderFetchedContacts(contacts, contactsContainer) {
  const { loggedIn, defaults } = sortContacts(contacts);
  defaultContacts = defaults;
  currentIndex = 0;
  await renderLoggedInUser(loggedIn, contactsContainer);
  await renderNextChunk(contactsContainer);
}


/**
 * Sorts contacts into two separate arrays: one for the logged-in user and one for all other contacts.
 *
 * @param {Array<Object>} contacts – An array of contact objects with their information.
 * @returns {{ loggedIn: Object[], defaults: Object[] }} An object containing arrays of the logged-in user and the default contacts.
 */
function sortContacts(contacts) {
  let loggedIn = [];
  let defaults = [];
  const theUser = JSON.parse(localStorage.getItem("user"));
  for (const contact of Object.values(contacts)) {
    if (contact.email !== theUser.email) {
      defaults.push(contact);
    } else {
      loggedIn.push(contact);
    }
  }
  return { loggedIn, defaults };
}


/**
 * Renders the contact template for the logged-in user.
 * 
 * @param {Array<Object>} user – An array containing the logged-in user's contact object.
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content.
 * @returns {void}
 */
async function renderLoggedInUser(user, contactsContainer) {
  const currentUser = user[0];
  if (currentUser === undefined || currentUser === null) return;
  const sanitizedEmail = sanitizeEmail(currentUser.email);
  const currentIcon = await getData("contacts/" + sanitizedEmail + "/icon");
  contactsContainer.innerHTML += contactsTemplate(addYouToCurrentUser(currentUser.name), currentIcon.bg, currentIcon.initial, currentUser.id);
}


/**
 * Adds a "(You)" label to the logged-in user's name.
 * 
 * @param {string} name – the name of the logged-in user.
 * @returns {string} The user's name followed by " (You)".
 */
function addYouToCurrentUser(name) {
  return `${name + " (You)"}`;
}


/**
 * Renders the contact template for a default contact.
 * 
 * @param {Object} user – A contact object representing a default user.
 * @param {HTMLDivElement} contactsContainer – A div element including its ID, class, and all nested content.
 * @returns {void}
 */
async function renderDefaultUsers(user, contactsContainer) {
  if (!user) return;
  const sanitizedEmail = sanitizeEmail(user.email);
  const currentIcon = await getData("contacts/" + sanitizedEmail + "/icon");
  contactsContainer.innerHTML += contactsTemplate(user.name, currentIcon.bg, currentIcon.initial, user.id);
}


/**
 * Removes the " (You)" label from the user's name, if present.
 * 
 * @param {string} name – The user's name, potentially including " (You)".
 * @returns {string} The name without " (You)".
 */
function showNameWithoutYou(name) {
  const newName = name.replace(" (You)", "");
  return newName;
}


/**
 * Adds a contact to the chosen contacts array after sanitizing the name.
 * 
 * @param {string} initial – The initial of the contact's name.
 * @param {string} bg – The background color or image identifier for the contact icon.
 * @param {string} name – The name of the contact (may include " (You)" suffix).
 * @param {string} contactId – The unique ID of the contact.
 * @returns {void}
 */
function addContactToArray(initial, bg, name, contactId) {
  chosenContacts.push({
    name: showNameWithoutYou(name),
    initial: initial,
    bg: bg,
    id: contactId,
  });
}


/**
 * Removes a contact from the chosen contacts array by matching initial, background, and name.
 * Strips "(You)" from the name before comparing.
 * 
 * @param {string} initial – The initial of the contact's name.
 * @param {string} bg – The background color or image identifier of the contact icon.
 * @param {string} name – The name of the contact, possibly including " (You)".
 * @returns {void}
 */
function deleteContactFromArray(initial, bg, name) {
  const index = chosenContacts.findIndex((contact) => contact.initial === initial && contact.bg === bg && contact.name === name.replace("(You)", "").trim());
  if (index != -1) {
    chosenContacts.splice(index, 1);
  }
}


/**
 * Searches through contact options based on user input.
 * Shows/hides contacts and displays a "no result" message if nothing matches.
 * 
 * @returns {void}
 */
function searchForContacts() {
  const input = document.getElementById("searchContacts").value.toLowerCase();
  const contacts = document.querySelectorAll(".option");
  const foundCounter = showAndHideTasksWhileSearch(input, contacts)
  displayNoResultMessage(foundCounter);
}


/**
 * Shows contacts whose names include the input string, hides others.
 * 
 * @param {string} input – The lowercase search string to filter contacts.
 * @param {NodeListOf<HTMLDivElement>} contacts – List of contact elements to filter.
 * @returns {number} The count of contacts that matched and were shown.
 */
function showAndHideTasksWhileSearch(input, contacts) {
  let count = 0;
  for (let i = 0; i < contacts.length; i++) {
    const name = contacts[i].querySelector(".contact-name").innerText.toLowerCase();
    if (name.includes(input)) {
      contacts[i].style.display = "flex";
      count += 1;
    } else {
      contacts[i].style.display = "none";
    }
  }
  return count;
}


/**
 * Displays or removes a "no contacts found" message based on the number of found contacts.
 * 
 * @param {number} foundCounter – The number of contacts found during search.
 * @returns {void}
 */
function displayNoResultMessage(foundCounter) {
  const container = document.getElementById("contactOptions");
  const message = document.getElementById("noContactsFoundMessage");
  if (foundCounter === 0) {
    if (!message) {
      container.insertAdjacentHTML("beforeend", noContactsFoundTemplate());
    }
  } else {
    if (message) {
      message.remove();
    }
  }
}


/**
 * Initializes and opens the contact assignment input UI.
 * Resets pagination and handles UI state transitions.
 * 
 * @returns {void}
 */
function openContactAssignmentInput() {
  startIndex = 0
  const closedRef = document.getElementById("closedState");
  const searchState = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const wrapperRef = document.querySelector(".dropdown-wrapper");
  const container = document.getElementById("chosenContactsBox");
  handleContactAssignment(closedRef, searchState, optionsRef, wrapperRef, container);
}


/**
 * Handles UI changes when opening contact assignment.
 * 
 * @param {HTMLElement} closedRef – The element representing the closed state.
 * @param {HTMLElement} searchState – The element representing the search state.
 * @param {HTMLElement} optionsRef – The container holding contact options.
 * @param {HTMLElement} wrapperRef – The dropdown wrapper element.
 * @param {HTMLElement} container – The container for chosen contacts.
 * @returns {void}
 */
function handleContactAssignment(closedRef, searchState, optionsRef, wrapperRef, container) {
  closedRef.style.display = "none";
  searchState.style.display = "flex";
  optionsRef.style.display = "flex";
  const contactsExist = localStorage.getItem("contactsExist");
  if (contactsExist === "false") {
    wrapperRef.style.marginBottom = "50px";
  } else {
    wrapperRef.style.marginBottom = "210px";
  }
  container.style.display = "none";
  if (window.innerWidth <= 1000) {
    document.querySelector(".content").style.overflow = "hidden";
  }
}


/**
 * Closes the contact assignment UI and resets related UI states.
 * Clears and re-renders the chosen contacts container.
 * 
 * @returns {void}
 */
function closeContactAssignment() {
  const closedRef = document.getElementById("closedState");
  const searchRef = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const wrapperRef = document.querySelector(".dropdown-wrapper");
  const container = document.getElementById("chosenContactsBox");
  closedRef.style.display = "flex";
  searchRef.style.display = "none";
  optionsRef.style.display = "none";
  wrapperRef.style.marginBottom = "0";
  container.style.display = "flex";
  document.querySelector(".content").style.overflow = "auto";
  document.getElementById('chosenContactsBox').innerHTML = "";
  visualizeChosenContacts();
}