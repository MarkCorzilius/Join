/**
 * Updates an existing task on the board with new data.
 * @param {Object} newTaskData - The updated task data.
 * @returns {Promise<boolean>} - True if the task was updated, false otherwise.
 */
async function handlePostingChangedTask(newTaskData) {
  const rawBoard = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(rawBoard)) {
    for (const [tasksKey, task] of Object.entries(tasks)) {
      if (task.id === currTask.id) {
        await putData(`board/${columnKey}/${tasksKey}`, newTaskData);
        return true;
      }
    }
  }
  return false;
}


/**
 * Renders detailed task information in an overlay for the current user.
 * @param {Object} task - The task to display in detail.
 * @returns {Promise<void>}
 */
async function renderDetailedTask(task) {
  const user = await findCurrentUser();
  const overlay = document.getElementById("taskInfoOverlay");
  overlay.innerHTML = taskDetailTemplate(task, user);
  currTask = task;
}

/**
 * Retrieves the current logged-in user details or returns "Guest" if user is a guest.
 * @returns {Promise<Object|string|undefined>} - User object, "Guest", or undefined if not found.
 */
async function findCurrentUser() {
  const currUser = JSON.parse(localStorage.getItem("user"));
  const users = await getData("ourUsers/");
  if (currUser.name === "Guest") {
    return "Guest";
  }
  for (const user of Object.values(users)) {
    if (currUser.email === user.email) {
      return user;
    }
  }
}


/**
 * Redirects to the add task page on window resize if overlay is open and screen width is below 700px.
 */
window.onresize = function handlePageRedirect() {
  const overlay = document.getElementById("createTaskInBoardOverlay");
  const isOVerlayOpen = overlay && overlay.style.display !== "none";
  if (isOVerlayOpen && window.innerWidth < 700) {
    window.location.href = "../templates/add_task.html";
  }
};


/**
 * Prepares and validates task data before creation.
 * @returns {Promise<{taskId: any, dataSafe: Object} | null>} - Returns task data if valid, otherwise null.
 */
async function prepareAndValidateTask() {
  if (!extractTaskValues()) {
    showWarningOverlay(taskMissingFieldsTemplate());
    return null;
  }
  const taskId = await getData("taskId");
  const dataSafe = taskDataStorage();
  if (!restrictAddingTask()) {
    return null;
  }
  return { taskId, dataSafe };
}


/**
 * Creates a task in the board after preparing and validating the data.
 * @returns {Promise<void>}
 */
async function createTaskInBoardFireBase() {
  const column = checkTargetColumn();
  const preparedData = await prepareAndValidateTask();
  if (!preparedData) return;

  const { taskId, dataSafe } = preparedData;
  await handleCreatingTask(column, dataSafe);
  showTaskSuccessBanner();
  chosenContacts = [];
}


/**
 * Generates HTML for user and other contacts' initials in a task.
 * @param {Array} taskContacts - Contacts assigned to the task.
 * @param {Array} firebaseContactsArray - All contacts from Firebase.
 * @returns {Promise<string>} - Combined HTML string of rendered contacts.
 */
async function checkContactsInitials(taskContacts, firebaseContactsArray) {
  const theUser = JSON.parse(localStorage.getItem("user"));
  const { userContacts, otherContacts } = separateUserAndOthers(
    taskContacts,
    firebaseContactsArray,
    theUser.id
  );
  const userTemplate = renderContacts(userContacts);
  const contactsTemplate = renderContacts(otherContacts);
  return userTemplate + contactsTemplate;
}


/**
 * Separates task contacts into the current user and other contacts.
 * @param {Array} taskContacts - Contacts assigned to the task.
 * @param {Array} firebaseContactsArray - All contacts from Firebase.
 * @param {string|number} userId - Current user ID.
 * @returns {{userContacts: Array, otherContacts: Array}} - Object with separated contacts.
 */
function separateUserAndOthers(taskContacts, firebaseContactsArray, userId) {
  const userContacts = [];
  const otherContacts = [];
  for (const contact of taskContacts) {
    if (!isValidContact(contact)) continue;
    const match = findContactInFirebase(contact.id, firebaseContactsArray);
    if (!match) continue;
    contact.id === userId
      ? userContacts.push(contact)
      : otherContacts.push(contact);
  }
  return { userContacts, otherContacts };
}


/**
 * Checks if a contact object is valid with a defined ID.
 * @param {Object} contact - The contact to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidContact(contact) {
  return contact && contact.id !== undefined && contact.id !== null;
}


/**
 * Finds a contact by ID within the Firebase contacts array.
 * @param {string|number} id - The contact ID to find.
 * @param {Array} firebaseContactsArray - Array of contacts from Firebase.
 * @returns {Object|undefined} - The matched contact or undefined if not found.
 */
function findContactInFirebase(id, firebaseContactsArray) {
  return firebaseContactsArray.find(fc => fc.id === id);
}


/**
 * Creates a new task in the specified column and updates the task ID counter.
 * @param {string} column - The column to add the task to.
 * @param {Object} dataSafe - The task data to store.
 * @returns {Promise<void>}
 */
async function handleCreatingTask(column, dataSafe) {
  taskId = await getIdFromDataBase("taskId");
  await postData("board/" + column, dataSafe);
  taskId += 1;
  await putIdToDataBase("taskId", taskId);
  emptyTaskDocument();
  closeTaskOverlay();
  await renderAllTasks();
}


/**
 * Generates combined HTML for user and other contacts of a task.
 * @param {Object} task - The task containing contacts.
 * @param {Object} user - The current user object.
 * @returns {string} - Combined HTML string of contact templates.
 */
function loopTaskContacts(task, user) {
  const { defaultHTML, userHTML } = separateUserFromContacts(task, user);
  const defTempl = returnContactTemplates(userHTML, user);
  const userTempl = returnContactTemplates(defaultHTML, user);
  return userTempl + defTempl;
}


/**
 * Generates HTML for a single contact element.
 * @param {Object} contact - The contact object.
 * @param {string} suffix - Text to append after the contact name.
 * @returns {string} - HTML string for the contact.
 */
function generateContactHTML(contact, suffix = "") {
  if (!contact) return "";
  return `
    <div class="task-overlay-contact">
      <div style="background-image: url('${contact.bg}')" class="initial">${contact.initial}</div>
      <p>${contact.name + suffix}</p>
    </div>`;
}


/**
 * Generates HTML for an array of contacts with user-specific suffixes.
 * @param {Array} contacts - Array of contact objects.
 * @param {Object} user - The current user object.
 * @returns {string} - Combined HTML string for all contacts.
 */
function returnContactTemplates(contacts, user) {
  if (!contacts) return "";
  const suffix = ifUserAddYou(contacts, user);
  return contacts.map(contact => generateContactHTML(contact, suffix)).join("");
}


/**
 * Generates HTML for a task's subtasks if any exist.
 * @param {Object} task - The task containing subtasks.
 * @returns {string} - HTML string of subtasks or empty string if none.
 */
function loopTaskSubtasks(task) {
  if (!task.subtasks || typeof task.subtasks !== "object") return "";
  if (Object.entries(task.subtasks).length === 0) return "";
  return handleLoopingSubtasks(task);
}


/**
 * Loops through a task's subtasks and generates their HTML representation.
 * @param {Object} task - The task containing subtasks.
 * @returns {string} - Combined HTML string of all subtasks.
 */
function handleLoopingSubtasks(task) {
  let templateHTML = "";
  for (const [subtaskKey, subtask] of Object.entries(task.subtasks)) {
    const { src, className } = renderCurrSubtaskState(subtask);
    templateHTML += subtasksTemplate(subtaskKey, className, src, subtask);
  }
  return templateHTML;
}


/**
 * Determines the checkbox image and CSS class based on subtask state.
 * @param {Object} subtask - The subtask object with a `state` property.
 * @returns {{src: string, className: string}} - Image source and CSS class name.
 */
function renderCurrSubtaskState(subtask) {
  if (subtask.state === true) {
    return { src: `../img/checkbox_checked_unhovered.png`, className: "chosen" };
  } else {
    return { src: `../img/checkbox_unchecked_unhovered.png`, className: "" };
  }
}


/**
 * Updates the subtask checkbox icon based on hover state and selection status.
 * @param {boolean} [isHovered=false] - Whether the icon is being hovered.
 * @param {HTMLImageElement} icon - The checkbox icon element.
 * @param {string} subtaskKey - Key of the subtask being updated.
 */
function updateSubtaskIcon(isHovered = false, icon, subtaskKey) {
  const chosen = icon.classList.contains("chosen");
  if (chosen) {
    icon.src = isHovered ? "../img/checkbox_checked_hovered.png" : "../img/checkbox_checked_unhovered.png";
  } else {
    icon.src = isHovered ? "../img/checkbox_unchecked_hovered.png" : "../img/checkbox_unchecked_unhovered.png";
  }
  findChosenSubtasks(subtaskKey, icon);
}


/**
 * Updates the completion state of a subtask in Firebase based on checkbox status.
 * @param {string} subtaskKey - The key of the subtask to update.
 * @param {HTMLElement} icon - The checkbox icon element representing the subtask.
 * @returns {Promise<void>}
 */
async function findChosenSubtasks(subtaskKey, icon) {
  if (!icon) return;
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === currTask.id) {
        let isChosen = icon.classList.contains("chosen");
        const data = await putData(`board/${columnKey}/${taskKey}/subtasks/${subtaskKey}/state`, isChosen);
      }
    }
  }
}


/**
 * Toggles and updates a subtask icon based on user interaction events.
 * @param {Event} event - The DOM event triggering the action.
 * @param {HTMLElement} icon - The subtask checkbox icon element.
 * @param {string} subtaskKey - The key of the subtask being interacted with.
 */
function toggleSubtaskIcon(event, icon, subtaskKey) {
  switch (event.type) {
    case "click":
      icon.classList.toggle("chosen");
      updateSubtaskIcon(true, icon, subtaskKey);
      break;
    case "mouseover":
      updateSubtaskIcon(true, icon, subtaskKey);
      break;
    case "mouseout":
      updateSubtaskIcon(false, icon, subtaskKey);
      break;
    default:
      updateSubtaskIcon(false, icon, subtaskKey);
      break;
  }
}


/**
 * Counts how many subtasks are marked as done within a task.
 * @param {Object} task - The task containing subtasks.
 * @returns {number} - Number of completed subtasks.
 */
function renderSubtasksDone(task) {
  let trueTasks = 0;
  const subtasks = Object.values(task.subtasks || {});
  for (const subtask of subtasks) {
    if (subtask.state === true) {
      trueTasks += 1;
    }
  }
  return trueTasks;
}


/**
 * Updates the visual progress bar of a task based on completed subtasks.
 * @param {Object} task - The task containing subtasks.
 */
function updateProgressBar(task) {
  const done = renderSubtasksDone(task);
  const total = renderSubtasksAmount(task);
  let percentage = 0;
  if (total > 0) {
    percentage = (done / total) * 100;
  }
  const progressBar = document.getElementById(`progressBar${task.id}`);
  progressBar.style.width = `${percentage}%`;
  displayProgressBar(total, task.id);
}

