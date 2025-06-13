/**
 * Deletes a task from the board data by matching its ID,
 * then closes the task info overlay.
 *
 * @param {Object} currentTask - The task object to delete, expected to have an `id` property.
 * @returns {Promise<void>} Resolves when the task is deleted and overlay is closed.
 */
async function deleteTaskInOverlay(currentTask) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
      if (task.id === currentTask.id) {
        await deleteData(`board/${columnKey}/${taskKey}`);
        closeTaskInfoOverlay();
        return;
      }
    }
  }
}


/**
 * Shows a loading spinner while attempting to open the task edit overlay.
 *
 * @param {Object} task - The task object to open for editing.
 * @returns {Promise<void>} Resolves after the edit overlay is opened or an error occurs.
 */

async function openTaskEditStateInOverlay(task) {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await handleOpeningEditOverlay(task);
  } catch (error) {
    console.log("error in openTaskEditStateInOverlay()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Prepares and opens the task edit overlay with the given task details.
 * Clears existing overlay content, injects the edit template,
 * fetches contact options, and renders task details.
 *
 * @param {Object} task - The task object to edit.
 * @returns {Promise<void>} Resolves after overlay setup is complete.
 */
async function handleOpeningEditOverlay(task) {
  const addTaskOverlay = document.getElementById("createTaskInBoardOverlay");
  const overlay = document.getElementById("taskInfoOverlay");
  addTaskOverlay.innerHTML = "";
  overlay.innerHTML = "";
  overlay.innerHTML = editTaskTemplate(task);
  await fetchContacts("contactOptions");
  renderTaskDetails(task);
}


/**
 * Populates the task edit form fields and related UI elements
 * with the data from the given task object.
 *
 * @param {Object} task - The task object containing details to render.
 */
function renderTaskDetails(task) {
  const title = document.getElementById("taskTitle");
  const description = document.getElementById("description");
  const date = document.getElementById("taskDate");
  title.value = task.title;
  description.value = task.description;
  date.value = task.date;
  showChosenPriority(task);
  showChosenContacts(task);
  showChosenSubtasks(task.subtasks);
}


/**
 * Highlights the priority button based on the task's priority level.
 *
 * @param {Object} task - The task object containing a `priority` property.
 */

function showChosenPriority(task) {
  const prio = document.querySelector(`.${task.priority}`);
  let data = null;
  if (prio.classList.contains("urgent")) {
    data = { button: prio, color: "rgb(255, 61, 0)", id: "0" };
  } else if (prio.classList.contains("medium")) {
    data = { button: prio, color: "rgb(255, 168, 1)", id: "1" };
  } else if (prio.classList.contains("low")) {
    data = { button: prio, color: "rgb(123, 225, 41)", id: "2" };
  }
  setActivePriority(data.button, data.color, data.id);
}


/**
 * Styles the chosen contacts for the given task by iterating over
 * the contacts array and applying styles to each valid contact element.
 *
 * @param {Object} task - The task object containing a `contacts` array.
 * @returns {Promise<string|undefined>} Returns an empty string if no contacts; otherwise undefined.
 */
async function showChosenContacts(task) {
  const contacts = task.contacts;
  if (!contacts) return "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact === null) continue;
    const element = checkChosenNames(contact);
    if (element) {
      styleChosenContact(element, contact.initial, contact.bg, contact.name, contact.id);
    }
  }
}


/**
 * Finds and returns the contact line element corresponding to the given contact's name.
 * Ignores the "(You)" suffix when matching names.
 *
 * @param {Object} contact - The contact object with a `name` property.
 * @returns {Element|null} The matching contact line element or null if not found.
 */
function checkChosenNames(contact) {
  const names = document.querySelectorAll(".contact-name");
  const contactLine = document.querySelectorAll(".contact-line");
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.textContent.replace("(You)", "").trim() === contact.name) {
      return contactLine[i];
    }
  }
  return null;
}


/**
 * Renders the subtasks inside the subtask container element,
 * clearing existing content and appending subtasks with appropriate styling.
 *
 * @param {Object|Array} mySubtasks - An object or array of subtasks to render.
 */
function showChosenSubtasks(mySubtasks) {
  if (!mySubtasks || typeof mySubtasks !== "object") return;
  const subtaskEditClass = decideCurrentTaskOverlay();
  const container = document.getElementById("subtaskContainer");
  container.innerHTML = "";
  subtaskCount = 0;
  const subtasks = Object.values(mySubtasks);
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    if (subtask) {
      container.innerHTML += subtaskTemplate(subtaskCount, subtask.title, subtaskEditClass);
      subtaskCount += 1;
    }
  }
}


/**
 * Handles click and hover events for the OK button, 
 * triggering task changes or updating button color.
 *
 * @param {Event} event - The event object containing the event type.
 */
function handleOkBtnEvents(event) {
  const rect = document.querySelector(".ok-btn-color");
  switch (event.type) {
    case "click":
      changeCurrTask();
      break;
    case "mouseover":
      rect.setAttribute("fill", "rgb(41, 171, 226)");
      break;
    case "mouseout":
      rect.setAttribute("fill", "#2A3647");
      break;
  }
}


/**
 * Validates task input values, updates the task data, and
 * closes the task info overlay upon successful update.
 * Shows a warning overlay if validation fails or restricts adding under certain conditions.
 *
 * @returns {Promise<void>} Resolves after attempting to update the task.
 */
async function changeCurrTask() {
  if (!extractTaskValues()) {
    showWarningOverlay(taskDateInPastTemplate())
    return;
  }
  const newTaskData = updatedTaskDataStorage();
  if (!restrictAddingTask()) return;
  const taskUpdated = await handlePostingChangedTask(newTaskData);
  if (taskUpdated) {
    closeTaskInfoOverlay();
  }
}


/**
 * Collects updated task data from form inputs and other sources,
 * preparing an object ready for storage or submission.
 *
 * @returns {Object} The updated task data including id, title, description, date, priority, contacts, category, and subtasks.
 */
function updatedTaskDataStorage() {
  const { titleValue, descriptionValue, dateValue } = extractTaskValues();
  const dataSafe = {
    id: currTask.id,
    title: titleValue,
    description: descriptionValue,
    date: dateValue,
    priority: saveActivePriority(),
    contacts: chosenContacts,
    category: getUpdatedCategory(),
    subtasks: saveSubtasks(),
  };
  return dataSafe;
}


/**
 * Retrieves the updated category of the current task.
 *
 * @returns {string|undefined} The current task's category, or undefined if not set.
 */
function getUpdatedCategory() {
  const newCategory = currTask.category;
  if (newCategory === undefined) {
    return;
  } else {
    return newCategory;
  }
}


/**
 * Clears and hides the task creation overlay,
 * and removes the related task column data from localStorage.
 */
function closeTaskOverlay() {
  const overlay = document.getElementById("createTaskInBoardOverlay");
  overlay.innerHTML = "";
  overlay.style.display = "none";
  localStorage.removeItem("taskColumn");
}


/**
 * Opens the task creation overlay for a specific board column.
 * On small screens, redirects to a separate task creation page.
 * On larger screens, displays the overlay inline and prepares the task form.
 *
 * @param {string|number} column - The column identifier where the task will be added.
 */
function openTaskOverlay(column) {
  currOverlay = "boardAddTaskOverlay";
  localStorage.setItem("taskColumn", column);
  if (window.innerWidth < 700) {
    window.location.href = "../templates/add_task.html";
  } else {
    const overlay = document.getElementById("createTaskInBoardOverlay");
    overlay.style.display = "flex";
    renderTaskDialog();
    resetPriorityBtn();
    currentColumn = column;
  }
  fetchContacts("contactOptions");
}


/**
 * Redirects to the mobile add task page if the overlay exists
 * and the viewport width is 700px or less.
 */
function ifMobileAddTaskLayout() {
  const overlay = document.getElementById('overlayDialogBoard');
  if (overlay && innerWidth <= 700) {
    window.location.href = "../templates/add_task.html"
  }
}


/**
 * Closes the task information overlay by clearing its content,
 * resetting chosen contacts, and re-rendering all tasks.
 * Displays a spinner during the operation and handles any errors.
 *
 * @returns {Promise<void>} Resolves once the overlay is closed and tasks are rendered.
 */
async function closeTaskInfoOverlay() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    const overlay = document.getElementById("taskInfoOverlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";
    chosenContacts = [];
    await renderAllTasks();
  } catch (error) {
    console.log("error in closeTaskInfoOverlay()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Opens and displays the detailed task information overlay.
 * Renders task details and hides the subtasks container if no subtasks exist.
 *
 * @param {Object} task - The task object to display.
 * @returns {Promise<void>} Resolves after rendering is complete.
 */
async function openTaskInfoOverlay(task) {
  currOverlay = "editOverlay";
  const overlay = document.getElementById("taskInfoOverlay");
  overlay.classList.add("active");
  await renderDetailedTask(task);
  const subtasksList = document.getElementById("subtasksList");
  const container = document.querySelector(".task-overlay-subtasks");
  if (subtasksList.children.length === 0) {
    container.style.display = "none";
  }
}


/**
 * Changes the delete button image source on mouseover and mouseout events.
 *
 * @param {Event} event - The mouse event triggered on the delete button image.
 */
function toggleDeleteBtn(event) {
  const img = event.target;
  if (event.type === "mouseover") {
    img.src = "../img/delete_task_hovered.png";
  } else if (event.type === "mouseout") {
    img.src = "../img/delete_task.png";
  }
}


/**
 * Handles hover and click events on the edit button image,
 * changing the image source on hover and triggering edit handling on click.
 *
 * @param {Event} event - The mouse or click event on the edit button image.
 */
function toggleEditBtn(event) {
  const overlay = document.getElementById("taskInfoOverlay");
  const boardAddTask = document.getElementById("overlayDialogBoard");
  const img = event.target;
  if (event.type === "mouseover") {
    img.src = "../img/edit_task_hovered.png";
  } else if (event.type === "mouseout") {
    img.src = "../img/edit_task.png";
  } else if ("click") {
    handleEditBtnClick(overlay, boardAddTask);
  }
}


/**
 * Prepares and displays the edit task overlay by clearing
 * existing content and injecting the edit task template.
 *
 * @param {HTMLElement} overlay - The overlay element to display the edit form.
 * @param {HTMLElement} boardAddTask - The board add task element to clear.
 */
function handleEditBtnClick(overlay, boardAddTask) {
  currOverlay = "editOverlay";
  overlay.innerHTML = "";
  boardAddTask.innerHTML = "";
  overlay.innerHTML = editTaskTemplate();
}


/**
 * Clears the subtask input and shows the main button
 * when a click occurs outside the subtask input field.
 *
 * @param {Event} event - The click event to check target against the input.
 */
function closeSubtaskInsert(event) {
  const input = document.getElementById('subtaskInput'); 
  if (event.target.id !== 'subtaskInput') {
    if (!input) return;
    input.value = "";
    showMainBtn();
  }
}