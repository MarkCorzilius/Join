/**
 * Cleans the contacts of each task by filtering out contacts that no longer exist.
 * 
 * @param {Array<Object>} tasks - Array of task objects, each potentially containing a 'contacts' property.
 * @param {Array<Object>} firebaseContactsArray - Array of current contact objects from the database.
 * 
 * This function iterates through each task and, if the task has contacts, 
 * calls filterOutMissingContacts() to remove any contacts not present in firebaseContactsArray.
 */
function cleanTaskContacts(tasks, firebaseContactsArray) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.contacts) {
      filterOutMissingContacts(task.contacts, firebaseContactsArray)
    }
  }
}


/**
 * Filters out contacts that do not exist in the current contacts array.
 * 
 * @param {Object} contacts - An object where keys are contact IDs and values are contact details.
 * @param {Array<Object>} firebaseContactsArray - Array of current contact objects, each with an 'id' property.
 * 
 * This function iterates over each contact in the `contacts` object and deletes 
 * any contact that is not found in the `firebaseContactsArray`.
 */
function filterOutMissingContacts(contacts, firebaseContactsArray) {
  for (const key in contacts) {
    const contact = contacts[key];
    if (!contact) continue;
    const exists = firebaseContactsArray.find((fc) => fc.id === contact.id);
    if (!exists) {
      delete contacts[key];
    }
  }
}


/**
 * Displays or hides the progress bar for a specific task based on the progress amount.
 * 
 * @param {number} amount - The amount of progress (e.g., number of completed subtasks).
 * @param {string|number} taskId - The unique identifier of the task.
 * 
 * If the amount is zero, the progress bar is hidden. Otherwise, it is shown.
 */
function displayProgressBar(amount, taskId) {
  const progressBar = document.getElementById(`progressSection${taskId}`);
  if (amount === 0) {
    progressBar.style.display = 'none';
  } else {
    progressBar.style.display = "flex";
  }
}


/**
 * Changes the "Add Task" icon to the hovered version for a specific element.
 *
 * @param {number} element - Index of the icon element to change.
 */
function hoveredAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/hovered_add_task.png";
}


/**
 * Sets the source of the specified "new-board-task" icon to the normal add task image.
 *
 * @param {number} element - The index of the element in the collection of *elements with the
 *class name "new-board-task". This determines which icon to update.
 */
function normalAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/add_task_in_board.png";
}


/**
 * Returns the folder path corresponding to the current column index.
 *
 * @returns {string} The path name based on the value of `currentColumn`.
 *                   - "toDo/" for column 0
 *                   - "InProgress/" for column 1
 *                   - "awaitFeedback/" for column 2
 *                   - Defaults to "toDo/" if none match
 */
function checkTargetColumn() {
  switch (currentColumn) {
    case 0:
      return "toDo/";
    case 1:
      return "InProgress/";
    case 2:
      return "awaitFeedback/";
    default:
      "toDo/";
      break;
  }
}


/**
 * Encodes a task object into a JSON string with escaped double quotes.
 * 
 * This is useful for safely embedding the JSON string in HTML attributes,
 * where unescaped double quotes could break the markup.
 *
 * @param {Object} task - The task object to encode.
 * @returns {string} The JSON string representation of the task with
 *                   double quotes replaced by `&quot;`.
 */
function encodeTask(task) {
  return JSON.stringify(task).replace(/"/g, "&quot;");
}


/**
 * Formats a date string from "YYYY-MM-DD" format to "DD/MM/YYYY".
 *
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {string} The formatted date string in "DD/MM/YYYY" format.
 */
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}


/**
 * Capitalizes the first letter of a given word.
 *
 * @param {string} word - The word to capitalize.
 * @returns {string} The word with the first character in uppercase.
 *                   Returns an empty string if the input is not a string.
 */
function capitalize(word) {
  if (typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}


/**
 * Checks if the user exists in the contacts list and returns a label if found.
 *
 * @param {Array<Object>} contacts - An array of contact objects, each with at least a `name` property.
 * @param {Object} user - The user object to check for, with a `name` property.
 * @returns {string} Returns " (You)" if the user is found in the contacts; otherwise, returns an empty string.
 */
function ifUserAddYou(contacts, user) {
  if (contacts.length === 0) return "";
  for (let contact of contacts) {
    if (contact.name === user.name) {
      return " (You)";
    }
  }
  return "";
}


/**
 * Separates the current user from the list of contacts in a task.
 *
 * @param {Object} task - The task object containing a `contacts` array.
 * @param {Object} user - The current user object, expected to have an `id` property.
 * @returns {{ defaultHTML: Array<Object>, userHTML: Array<Object> }} 
 *          An object with two arrays:
 *          - `defaultHTML`: contacts excluding the current user
 *          - `userHTML`: contacts matching the current user
 *
 * Returns empty arrays if `task.contacts` is not defined.
 */
function separateUserFromContacts(task, user) {
  let defaultHTML = [];
  let userHTML = [];
  if (!task.contacts) return "";
  for (let i = 0; i < task.contacts.length; i++) {
    const contact = task.contacts[i];
    if (!contact || contact.id == null) continue;
    if (contact.id !== user.id) {
      defaultHTML.push(contact);
    } else {
      userHTML.push(contact);
    }
  }
  return { defaultHTML, userHTML };
}


/**
 * Toggles the mobile add task button image on hover.
 *
 * @param {Event} event - The mouse event triggering the toggle.
 */
function toggleMobileTaskAddBtn(event) {
  const img = event.target;
  const hoverSrc = `../img/mobile_add_task_hovered.png`;
  const basicSrc = `../img/mobile_add_task_btn.png`;
  img.src = event.type === "mouseover" ? hoverSrc : basicSrc;
}
