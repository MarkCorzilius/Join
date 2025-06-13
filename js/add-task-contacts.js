let chosenContacts = [];
let defaultContacts = [];
let currentIndex = 0;
const CHUNK_SIZE = 10;

let startIndex = 0;
const offsetIndex = 3;


async function renderNextChunk(contactsContainer) {
  const container = document.getElementById('contactOptions');
  const nextChunk = getNextContactChunk();

  removeMoreContactsButton();
  if (nextChunk.length === 0) return;

  await renderContactChunk(nextChunk, contactsContainer, container);
  currentIndex += CHUNK_SIZE;
  insertMoreContactsButtonIfNeeded(contactsContainer);
}


function getNextContactChunk() {
  return defaultContacts.slice(currentIndex, currentIndex + CHUNK_SIZE);
}


async function renderContactChunk(chunk, contactsContainer, container) {
  for (const user of chunk) {
    await renderDefaultUsers(user, contactsContainer);
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth"
    });
  }
}


function removeMoreContactsButton() {
  const btn = document.getElementById("moreContactsContainer");
  if (btn) btn.remove();
}


function insertMoreContactsButtonIfNeeded(contactsContainer) {
  if (currentIndex < defaultContacts.length) {
    contactsContainer.insertAdjacentHTML("beforeend", moreContactsBtnTemplate());
  }
}


function hasMoreContacts() { }


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


async function sortAndRenderFetchedContacts(contacts, contactsContainer) {
  const { loggedIn, defaults } = sortContacts(contacts);
  defaultContacts = defaults;
  currentIndex = 0;
  await renderLoggedInUser(loggedIn, contactsContainer);
  await renderNextChunk(contactsContainer);
}


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


async function renderLoggedInUser(user, contactsContainer) {
  const currentUser = user[0];
  if (currentUser === undefined || currentUser === null) return;
  const sanitizedEmail = sanitizeEmail(currentUser.email);
  const currentIcon = await getData("contacts/" + sanitizedEmail + "/icon");
  contactsContainer.innerHTML += contactsTemplate(addYouToCurrentUser(currentUser.name), currentIcon.bg, currentIcon.initial, currentUser.id);
}


function addYouToCurrentUser(name) {
  return `${name + " (You)"}`;
}


async function renderDefaultUsers(user, contactsContainer) {
  if (!user) return;
  const sanitizedEmail = sanitizeEmail(user.email);
  const currentIcon = await getData("contacts/" + sanitizedEmail + "/icon");
  contactsContainer.innerHTML += contactsTemplate(user.name, currentIcon.bg, currentIcon.initial, user.id);
}


function showUser(name) {
  const email = findUserEmail();
  if (currentUser.name === "Guest") {
    return name;
  } else {
    const markedName = name + " (You)";
    return markedName;
  }
}


function showNameWithoutYou(name) {
  const newName = name.replace(" (You)", "");
  return newName;
}


function sanitizeEmail(email) {
  return email.replace(/[@.]/g, "_");
}


function resetContactCheckedBtn() {
  const selections = document.querySelectorAll(".select-box");
  const checked = document.querySelectorAll(".checked");
  const unchecked = document.querySelectorAll(".unchecked");
  for (let i = 0; i < checked.length; i++) {
    const check = checked[i];
    check.style.display = "none";
  }
  for (let i = 0; i < unchecked.length; i++) {
    const uncheck = unchecked[i];
    uncheck.style.display = "inline";
  }
}


function resetContacts() {
  const options = document.querySelectorAll(".option");
  const checked = document.querySelector(".checked");
  const unchecked = document.querySelector(".unchecked");
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    helpResetContacts(option, checked, unchecked);
  }
  chosenContacts = [];
  visualizeChosenContacts();
  closeContactAssignment();
}


function helpResetContacts(option, checked, unchecked) {
  if (option.classList.contains("selected-contact")) {
    option.classList.remove("selected-contact");
    resetContactCheckedBtn();
    checked.style.display = "none";
    unchecked.style.display = "inline";
  }
}


function styleChosenContact(element, initial, bg, name, contactId) {
  element.classList.toggle("selected-contact");
  const checked = element.querySelector(".checked");
  const unchecked = element.querySelector(".unchecked");
  if (element.classList.contains("selected-contact")) {
    runIfSelected(checked, unchecked, initial, bg, name, contactId);
  } else {
    runIfNotSelected(checked, unchecked, initial, bg, name, contactId);
  }
}


function runIfSelected(checked, unchecked, initial, bg, name, contactId) {
  checked.style.display = "inline";
  unchecked.style.display = "none";
  addContactToArray(initial, bg, name, contactId);
  visualizeChosenContacts();
}


function runIfNotSelected(checked, unchecked, initial, bg, name, contactId) {
  checked.style.display = "none";
  unchecked.style.display = "inline";
  deleteContactFromArray(initial, bg, name);
  visualizeChosenContacts();
}


function visualizeChosenContacts() {
  const container = document.getElementById("chosenContactsBox");
  container.innerHTML = "";
  const end = Math.min(startIndex + offsetIndex, chosenContacts.length);
  for (let i = 0; i < end; i++) {
    const contact = chosenContacts[i];
    container.innerHTML += generateBgAndInitialForChosenContactsBox(contact.bg, contact.initial);
  }
  showBubble();
}


function showBubble() {
  const container = document.getElementById('chosenContactsBox');
  const remainingContacts = chosenContacts.length - (startIndex + offsetIndex);
  const remainingCount = Math.max(remainingContacts, 0);
  const existingBubble = document.getElementById('moreContactsBubble');
  if (existingBubble) {
    existingBubble.remove();
  }
  if (remainingCount > 0) {
    container.insertAdjacentHTML('beforeend', generateMoreContactsBubble(remainingCount, 'add-task-bubble'));
  }
}


function showMoreChosenContacts() {
  const container = document.getElementById('chosenContactsBox');
  startIndex += offsetIndex;
  visualizeChosenContacts();
  container.scrollTo({left: container.scrollWidth, behavior: 'smooth'})
}


function addContactToArray(initial, bg, name, contactId) {
  chosenContacts.push({
    name: showNameWithoutYou(name),
    initial: initial,
    bg: bg,
    id: contactId,
  });
}


function deleteContactFromArray(initial, bg, name) {
  const index = chosenContacts.findIndex((contact) => contact.initial === initial && contact.bg === bg && contact.name === name.replace("(You)", "").trim());
  if (index != -1) {
    chosenContacts.splice(index, 1);
  }
}


function searchForContacts() {
  const input = document.getElementById("searchContacts").value.toLowerCase();
  const contacts = document.querySelectorAll(".option");
  const foundCounter = showAndHideTasksWhileSearch(input, contacts)
  displayNoResultMessage(foundCounter);
}

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


function openContactAssignmentInput() {
  startIndex = 0
  const closedRef = document.getElementById("closedState");
  const searchState = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const wrapperRef = document.querySelector(".dropdown-wrapper");
  const container = document.getElementById("chosenContactsBox");
  handleContactAssignment(closedRef, searchState, optionsRef, wrapperRef, container);
}


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