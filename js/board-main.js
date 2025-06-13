let disabled = false;
let currentColumn = 0;
let searching = false;
const contactsOffset = 2;
let contactsStart = 0; 


/**
 * Initializes the board UI when the page loads.
 * Shows a spinner overlay during loading.
 * Calls functions to set up page structure, prepare the environment, and load tasks.
 * Hides the spinner overlay after loading or on error.
 */
async function boardOnLoad() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await initializePageStructure();
    await prepareBoardEnvironment();
    await loadBoardTasks();
  } catch (error) {
    console.log("error in boardOnLoad:", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Initializes the page structure by including external HTML components using w3.includeHTML.
 * Waits asynchronously until both the sidebar (#sidebar) and header (#header) elements are loaded into the DOM.
 * Resolves the promise once both elements are found, allowing subsequent code to run safely.
 */
async function initializePageStructure() {
  w3.includeHTML();
  const waitForInclude = () =>
    new Promise((resolve) => {
      const checkExist = setInterval(() => {
        const sidebarLoaded = document.querySelector("#sidebar");
        const headerLoaded = document.querySelector("#header");
        if (sidebarLoaded && headerLoaded) {
          clearInterval(checkExist);
          resolve();
        }
      }, 50);
    });
  await waitForInclude();
}


/**
 * Prepares the board environment by initializing necessary UI states and data.
 * - Marks the current page in the navigation or UI.
 * - Shows dropdown help if the user is a guest.
 * - Adjusts the UI or data based on the initial login state.
 * - Ensures the first ID for tasks and contacts is set in the backend/storage.
 * - Displays the legal notice and privacy policy.
 * 
 * This function is asynchronous because it awaits the completion of setting initial IDs.
 */
async function prepareBoardEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  await putFirstIdForTasksAndContacts("taskId")
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Loads all tasks onto the board and sets up related UI behavior.
 * - Renders all tasks from the data source.
 * - Checks if any contacts exist and adjusts the UI accordingly.
 * - Adjusts help overlays or hints specifically for mobile devices.
 * - Adds a window resize event listener to re-adjust mobile help on viewport changes.
 * - Checks and sets draggable task behavior based on the current viewport width.
 * 
 * This function is asynchronous because it awaits the rendering and contact checks.
 */
async function loadBoardTasks() {
  await renderAllTasks();
  await checkContactsExistance();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  checkIfMobileLayout();
}


/**
 * Renders all task columns on the board and manages UI elements accordingly.
 * 
 * This function performs the following asynchronously:
 * - Shows a loading spinner overlay while rendering.
 * - Renders tasks for each column by calling renderTasks with the container ID, data path, and empty message.
 * - Disables "move task up" buttons in the first column and "move task down" buttons in the last column to prevent invalid moves.
 * - Hides the spinner overlay once rendering completes or if an error occurs.
 * - Catches and logs any errors during the rendering process.
 */
async function renderAllTasks() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await renderTasks("tasksContainer-0", "board/toDo/", "No tasks To Do");
    await renderTasks("tasksContainer-1", "board/InProgress/", "No tasks In Progress");
    await renderTasks("tasksContainer-2", "board/awaitFeedback/", "No tasks Await Feedback");
    await renderTasks("tasksContainer-3", "board/done/", "No tasks Done");
    await disableMoveBtns(".move-task-up", "board/toDo/");
    await disableMoveBtns(".move-task-down", "board/done/");
  } catch (error) {
    console.log("error in renderAllTasks()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Renders tasks inside a specified container element.
 * 
 * @param {string} id - The DOM element ID of the container to render tasks into.
 * @param {string} path - The data path in the database to fetch tasks from.
 * @param {string} emptyMessage - Message to display if no tasks are found.
 * 
 * This function performs the following:
 * - Clears the container's current content.
 * - Fetches raw tasks data from the given path.
 * - Converts raw task objects into an array.
 * - If no tasks exist, displays an empty column message.
 * - Otherwise, fetches contact data.
 * - Calls visualizeTasks to render each task with the associated contacts.
 */
async function renderTasks(id, path, emptyMessage) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  const rawTasks = await getData(path);
  const tasks = rawTasks ? Object.values(rawTasks) : [];
  if (tasks.length === 0) {
    container.innerHTML = emptyColumnTemplate(emptyMessage);
    return;
  }
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  await visualizeTasks(tasks, firebaseContactsArray, container);
}


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
 * Renders a list of tasks into a specified container element.
 * 
 * @param {Array<Object>} tasks - Array of task objects to render.
 * @param {HTMLElement} container - The DOM element where tasks will be appended.
 * 
 * This function iterates through the tasks, renders each task's initials asynchronously,
 * appends the rendered task HTML to the container, and updates UI elements such as
 * contacts bubble and progress bar for each task.
 */
async function renderTasksToContainer(tasks, container) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const initialsHTML = await renderInitials(task);
    container.innerHTML += taskTemplate(task, initialsHTML);
    showContactsBubble(task.contacts, task.id);
    updateProgressBar(task);
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
 * Cleans tasks by removing any contacts that no longer exist, then renders the tasks into the given container.
 * 
 * @param {Array<Object>} tasks - Array of task objects to visualize.
 * @param {Array<Object>} firebaseContactsArray - Array of contact objects fetched from Firebase.
 * @param {HTMLElement} container - The DOM element where tasks should be rendered.
 * 
 * This function first removes invalid contacts from each task, then renders the tasks inside the container.
 */
async function visualizeTasks(tasks, firebaseContactsArray, container) {
  cleanTaskContacts(tasks, firebaseContactsArray);
  await renderTasksToContainer(tasks, container);
}


/**
 * Applies focused styling to the search container to indicate active searching state.
 * Sets a blue border and marks the global `searching` flag as true.
 */
function focusedSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid rgb(42 170 226)";
  searching = true;
}


/**
 * Removes focused styling from the search container, indicating search is inactive.
 * Sets border color back to black, resets the global `searching` flag to false,
 * and updates the UI message based on whether the search is active and the column content.
 */
function bluredSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid black";
  searching = false;
  displayRightMessageIfColumnEmpty(searching);
}


/**
 * Displays the appropriate message depending on whether the search is active.
 * If not searching, it switches visibility between empty column messages and empty search messages.
 *
 * @param {NodeListOf<Element>} emptyColumnMessage - Elements showing empty column messages.
 * @param {NodeListOf<Element>} emptySearchMessage - Elements showing empty search messages.
 * @param {HTMLInputElement} input - The search input element.
 */
function displayRightMessageIfColumnEmpty(searching) {
  const emptyColumnMessage = document.querySelectorAll('.empty-column');
  const emptySearchMessage = document.querySelectorAll('.empty-search');
  const input = document.getElementById('searchTasksInput');
  if (!searching) {
    switchEmptyMessages(emptyColumnMessage, emptySearchMessage, input);
  }
}


/**
 * Switches visibility of empty messages based on search input.
 * Removes empty search messages if the input is empty, and shows empty column messages.
 *
 * @param {NodeListOf<Element>} emptyColumnMessage - Elements showing empty column messages.
 * @param {NodeListOf<Element>} emptySearchMessage - Elements showing empty search messages.
 * @param {HTMLInputElement} input - The search input element.
 */
function switchEmptyMessages(emptyColumnMessage, emptySearchMessage, input) {
  if (emptySearchMessage && input.value === "") {
    emptySearchMessage.forEach(searchMessage => {
      searchMessage.remove();
    });
  if (emptyColumnMessage) {
    emptyColumnMessage.forEach(columnMessage => {
      columnMessage.style.display = 'flex';
    });
  }
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


/**
 * Searches through task elements and updates their visibility
 * based on the search input value. Displays a message if no tasks match.
 */
function searchTasks() {
  const tasks = document.querySelectorAll(".task-body");
  const input = document.getElementById("searchTasksInput").value.toLowerCase();

  const foundCount = hideTaskIfDontContainInput(tasks, input);
  showNoTasksMessage(foundCount);
}


/**
 * Toggles visibility of tasks based on whether they contain the search input,
 * updating and returning the count of tasks found.
 *
 * @param {NodeList} tasks - A list of task elements to check.
 * @param {string} input - The search string to match within tasks.
 * @param {number} foundCount - The current count of found tasks.
 * @returns {number} The updated count of tasks that match the input.
 */
function hideTaskIfDontContainInput(tasks, input, foundCount) {
  for (let i = 0; i < tasks.length; i++) {
    foundCount = toggleTaskVisibility(tasks[i], input, foundCount);
  }
  hideColumnIfNoTasksFoundInColumn();
  return foundCount;
}


/**
 * Shows or hides a task element based on whether its title or description
 * contains the search input, and updates the count of found tasks.
 *
 * @param {Element} task - The task DOM element to check and toggle.
 * @param {string} input - The search string to match within the task.
 * @param {number} foundCount - The current count of matched tasks.
 * @returns {number} The updated count of matched tasks.
 */
function toggleTaskVisibility(task, input, foundCount) {
  const title = task.querySelector(".task-title").innerText.toLowerCase();
  const description = task.querySelector(".task-description").innerText.toLowerCase();
  if (title.includes(input) || description.includes(input)) {
    task.style.display = "flex";
    foundCount++;
  } else {
    task.style.display = "none";
  }
  return foundCount;
}


/**
 * Checks each task column for visible tasks and shows or hides
 * the "no tasks" message accordingly.
 */
function hideColumnIfNoTasksFoundInColumn() {
  const columns = document.querySelectorAll('.tasks-container');
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const tasksFound = checkIfColumnHasVisibleTasks(column);
    showOrHideEmptyMessages(column, tasksFound);
  }
}


/**
 * Checks if a given column contains any visible tasks.
 *
 * @param {Element} column - The DOM element representing a task column.
 * @returns {boolean} True if at least one task with class 'task-body' is visible, otherwise false.
 */
function checkIfColumnHasVisibleTasks(column) {
  return Array.from(column.children).some(task =>
    task.classList.contains('task-body') && task.style.display !== "none"
  );
}


/**
 * Shows or hides empty state messages in a task column based on task visibility.
 *
 * @param {Element} column - The DOM element representing a task column.
 * @param {boolean} tasksFound - Whether the column contains any visible tasks.
 */
function showOrHideEmptyMessages(column, tasksFound) {
  if (!tasksFound) {
    showEmptySearchMessage(column);
  } else {
    hideEmptySearchMessage(column);
    toggleEmptyColumnMessage(column);
  }
}


/**
 * Displays a "no matches" empty search message in the given column
 * if it does not already exist, and hides the empty column message if present.
 *
 * @param {Element} column - The DOM element representing a task column.
 */
function showEmptySearchMessage(column) {
  const emptySearchMessage = column.querySelector('.empty-search');
  const emptyColumnMessage = column.querySelector('.empty-column');

  if (!emptySearchMessage) {
    if (emptyColumnMessage) emptyColumnMessage.style.display = 'none';
    column.insertAdjacentHTML('beforeend', emptySearchColumnTemplate('No matches'));
  }
}


/**
 * Removes the "empty search" message from the specified column if it exists.
 *
 * @param {Element} column - The DOM element representing a task column.
 */
function hideEmptySearchMessage(column) {
  const emptySearchMessage = column.querySelector('.empty-search');
  if (emptySearchMessage) emptySearchMessage.remove();
}


/**
 * Toggles the visibility of the empty column message based on
 * whether the column contains any task elements.
 *
 * @param {Element} column - The DOM element representing a task column.
 */
function toggleEmptyColumnMessage(column) {
  const emptyColumnMessage = column.querySelector('.empty-column');
  const taskElements = column.querySelectorAll('.task-body');
  if (emptyColumnMessage) {
    emptyColumnMessage.style.display = taskElements.length > 0 ? 'none' : 'flex';
  }
}


/**
 * Shows or hides the no-tasks message based on the number of found tasks.
 *
 * @param {number} foundCount - The count of tasks matching the current search or filter.
 */
function showNoTasksMessage(foundCount) {
  const container = document.querySelector(".board-all-tasks-section");
  const message = document.getElementById("emptyBoardMessage");
  if (foundCount === 0) {
    container.style.display = "none";
    message.style.display = "flex";
  } else {
    container.style.display = "flex";
    message.style.display = "none";
  }
}