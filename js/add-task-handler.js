/**
 * Collects and packages all relevant task data into an object.
 * 
 * @returns {Object} An object containing task details including id, title, description, date, priority, contacts, category, and subtasks.
 */
function taskDataStorage() {
  const { titleValue, descriptionValue, dateValue } = extractTaskValues();
  const dataSafe = {
    id: taskId,
    title: titleValue,
    description: descriptionValue,
    date: dateValue,
    priority: saveActivePriority(),
    contacts: chosenContacts,
    category: saveCategory(),
    subtasks: saveSubtasks(),
  };
  return dataSafe;
}

/**
 * Disables the create task button, validates and posts the task asynchronously,
 * and re-enables the button regardless of success or failure.
 * 
 * @returns {Promise<void>}
 */
async function getTaskData() {
  document.querySelector(".create-task-button").disabled = true;
  try {
    await validateAndPostTask();
  } catch (error) {
    console.log("error in getTaskData", error);
  } finally {
    document.querySelector(".create-task-button").disabled = false;
  }
}

/**
 * Validates task data, retrieves task ID, and posts the task if all conditions are met.
 * Shows warning if task data is invalid and a success banner upon successful posting.
 * 
 * @returns {Promise<void>}
 */
async function validateAndPostTask() {
  if (!extractTaskValues()) {
    showWarningOverlay(taskDateInPastTemplate())
    return;
  }
  taskId = await getData("taskId");
  const dataSafe = taskDataStorage();
  if (!restrictAddingTask()) return;
  await handlePostingTask(dataSafe);
  showTaskSuccessBanner();
}


/**
 * Posts task data to the appropriate board column, updates the task ID,
 * clears the task form, and refreshes the task UI if needed.
 * 
 * @param {Object} dataSafe – The task data object to post.
 * @returns {Promise<void>}
 */
async function handlePostingTask(dataSafe) {
  const columnNum = localStorage.getItem("taskColumn");
  const columnName = checkChosenColummn(columnNum);
  await postData(`board/${columnName}/`, dataSafe);
  taskId += 1;
  await putIdToDataBase("taskId", taskId);
  emptyTaskDocument();
  if (window.location.href.includes("task")) return;
  renderAllTasks();
  closeTaskOverlay();
}


/**
 * Finds the active priority button and returns its priority value.
 * 
 * @returns {string|null} The active priority ("medium", "urgent", "low") or null if none selected.
 */
function saveActivePriority() {
  const priorities = document.querySelectorAll(".priority-button");
  const active = Array.from(priorities).find((btn) => btn.classList.contains("active"));
  const priority = active ? ["medium", "urgent", "low"].find((p) => active.classList.contains(p)) : null;
  return priority;
}


/**
 * Returns the selected task category from the UI, or null if none selected.
 * 
 * @returns {string|null} The selected category name, or null if no valid category is chosen.
 */
function saveCategory() {
  const containerRef = document.getElementById("categoryChoiceInsert");
  if (containerRef.innerText !== "Select task category") {
    const category = containerRef.innerText;
    return category;
  } else {
    const category = null;
    return category;
  }
}


/**
 * Collects and returns subtasks from the UI.
 * 
 * @returns {Object|null} An object of subtasks keyed by subtask ID, each with title and default state, or null if no subtasks found.
 */
function saveSubtasks() {
  const subtaskContainer = document.getElementById("subtaskContainer");
  const subtaskTitles = document.querySelectorAll(".subtask-titles");
  if (!subtaskContainer) return null;
  if (!subtaskTitles) return;
  const subtasks = {};
  for (let i = 0; i < subtaskTitles.length; i++) {
    const titleText = subtaskTitles[i].innerText.trim();
    if (titleText !== "") {
      subtasks[`subtask-${i + 1}`] = { title: titleText, state: false };
    }
  }
  return Object.keys(subtasks).length > 0 ? subtasks : null;
}


/**
 * Sets the given button as the active priority and updates styles.
 * 
 * @param {HTMLButtonElement} button - The priority button to activate.
 * @param {string} color - The background color to apply when active.
 * @param {string|number} id - The identifier for the priority button (used in color change handler).
 */
function setActivePriority(button, color, id) {
  document.querySelectorAll(".priority-button").forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "";
    btn.style.color = "";
  });
  button.classList.add("active");
  button.style.backgroundColor = color;
  button.style.color = "white";
  changePriorityBtnColor(id);
}


/**
 * Updates the priority icon colors based on the given id.
 * Removes the highlight class from all icons and adds it to the matching one.
 * 
 * @param {string|number} id - The identifier of the priority icon to highlight.
 */
function changePriorityBtnColor(id) {
  const svgRef = document.querySelectorAll(".priority-icon");
  for (let i = 0; i < svgRef.length; i++) {
    const icon = svgRef[i];
    icon.classList.remove("clicked-priority-color");
    if (icon.classList.contains(`priority-icon-${id}`)) {
      icon.classList.add("clicked-priority-color");
    }
  }
}


/**
 * Resets priority buttons to default state with "medium" priority active.
 * Sets styles for inactive buttons and highlights the medium priority button.
 */
function resetPriorityBtn() {
  const inactiveBtns = [document.getElementsByClassName("priority-button")[0], document.getElementsByClassName("priority-button")[2]];
  const medium = document.getElementsByClassName("priority-button")[1];
  inactiveBtns.forEach((btn) => {
    btn.style.backgroundColor = "white";
    btn.style.color = "black";
  });
  medium.classList.add("active");
  medium.style.backgroundColor = "rgb(255, 168, 1)";
  medium.style.color = "white";
  changePriorityBtnColor(1);
}


/**
 * Toggles visibility of the category options dropdown.
 * Updates the arrow and container styling based on the open/closed state.
 */
function toggleCategoryOptions() {
  const arrow = document.getElementById("categoryArrow");
  const section = document.querySelector(".category-btn-and-options");
  const optionsRef = document.querySelector(".category-options");
  optionsRef.style.display = optionsRef.style.display === "flex" ? "none" : "flex";
  isCategoryOptionsOpen(arrow, section, optionsRef);
}


/**
 * Updates UI elements based on whether the category options dropdown is open or closed.
 * 
 * @param {HTMLImageElement} arrow - The arrow image element indicating dropdown state.
 * @param {HTMLElement} section - The container wrapping the category button and options.
 * @param {HTMLElement} optionsRef - The category options container whose display is toggled.
 */
function isCategoryOptionsOpen(arrow, section, optionsRef) {
  if (optionsRef.style.display === "flex") {
    section.style.marginBottom = "100px";
    arrow.src = "../img/dropdown-arrow-up.png";
    document.getElementById("categoryChoiceInsert").innerText = "Select task category";
    if (window.innerWidth > 1000) {
      document.querySelector(".content").style.overflow = "hidden";
    }
  } else {
    section.style.marginBottom = "auto";
    arrow.src = "../img/dropdown-arrow-down.png";
    document.querySelector(".content").style.overflow = "auto";
  }
}


/**
 * Sets the selected category text in the UI and closes the category dropdown.
 * 
 * @param {HTMLElement} option – The clicked category option element.
 */
function chooseCategory(option) {
  const containerRef = document.getElementById("categoryChoiceInsert");
  const choice = option.innerText;
  containerRef.innerText = "";
  containerRef.innerText = choice;
  toggleCategoryOptions();
}

/**
 * Shows the subtask action buttons and focuses the subtask input field.
 * Hides the main subtask button, shows the focused buttons, and sets the cursor to default.
 */
function showActionBtns() {
  const input = document.getElementById("subtaskInput");
  const focusBtns = document.getElementById("focusBtns");
  const mainBtn = document.getElementById("subtaskMainBtn");
  mainBtn.style.display = "none";
  focusBtns.style.display = "flex";
  input.style.cursor = "default";
  input.focus();
}


/**
 * Shows the main subtask button and hides the focused action buttons.
 */
function showMainBtn() {
  const focusBtns = document.getElementById("focusBtns");
  const mainBtn = document.getElementById("subtaskMainBtn");
  mainBtn.style.display = "flex";
  focusBtns.style.display = "none";
}


/**
 * Adds a new subtask from the input field to the subtask container.
 * If the input is empty, it refocuses the input without adding.
 * Resets the input field and scrolls to the newly created subtask.
 */
function addSubtask() {
  const input = document.getElementById("subtaskInput");
  const valueRef = input.value.trim();
  const outputDiv = document.getElementById("subtaskContainer");
  if (valueRef.length === 0) {
    input.focus();
    return;
  }
  const subtaskEditClass = decideCurrentTaskOverlay();
  outputDiv.innerHTML += subtaskTemplate(subtaskId, valueRef, subtaskEditClass);
  input.value = "";
  scrollToCreatedSubtask();
  subtaskId += 1;
  input.focus();
}


/**
 * Listens for clicks on the document to detect clicks outside the subtask input area.
 * If the focus buttons are visible and the click is outside the input wrapper,
 * clears the input field and moves focus to the main subtask button.
 */
document.addEventListener("click", (e) => {
  const focusBtns = document.getElementById("focusBtns");
  const mainBtn = document.getElementById("subtaskMainBtn");
  const wrapper = document.querySelector(".subtask-input-wrapper");
  if (!focusBtns || !mainBtn || !wrapper) return;
  if (focusBtns.style.display === "flex" && !wrapper.contains(e.target)) {
    emptySubtaskInput();
    mainBtn.focus();
  }
});


/**
 * Scrolls the subtask container to the bottom to make the newly added subtask visible.
 */
function scrollToCreatedSubtask() {
  const container = document.getElementById("subtaskContainer");
  container.scrollTop = container.scrollHeight;
}

/**
 * Resets all input fields and UI elements related to task creation to their default states.
 * Clears task title, description, date, and subtask input fields.
 * Also resets priority, category, subtasks, and contact selections.
 */
function emptyTaskDocument() {
  const title = document.getElementById("taskTitle");
  const description = document.getElementById("description");
  const date = document.getElementById("taskDate");
  const subtaskInput = document.getElementById("subtaskInput");
  title.value = "";
  description.value = "";
  date.value = "";
  subtaskInput.value = "";
  resetPriorityBtn();
  resetCategory();
  resetSubtasks();
  resetContacts();
}


/**
 * Resets the task category selection UI to its default state.
 * Sets the category display text to "Select task category".
 */
function resetCategory() {
  document.getElementById("categoryChoiceInsert").innerText = "Select task category";
}


/**
 * Clears all subtasks from the subtask container in the UI.
 */
function resetSubtasks() {
  const subtasks = document.getElementById("subtaskContainer");
  subtasks.innerHTML = "";
}


/**
 * Checks the subtask input for Enter key press and handles adding or blurring input accordingly.
 * 
 * If the input value is non-empty and Enter is pressed, adds the subtask.
 * If the input is empty and Enter is pressed, triggers blur behavior.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggered by the user.
 */
function checkShiftSubtask(event) {
  const input = document.getElementById("subtaskInput");
  const value = input.value.trim();
  if (value.length !== 0) {
    if (event.key === "Enter") {
      addSubtask();
      return;
    }
  } else {
    blurOnEnter(event);
    return;
  }
}


/**
 * Blurs (removes focus from) the event target if the Enter key is pressed.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggered by the user.
 */
function blurOnEnter(event) {
  if (event.key === "Enter") {
    event.target.blur();
  }
}


/**
 * Deletes a subtask element from the DOM by its ID.
 * 
 * @param {number|string} subtaskId - The unique identifier of the subtask to delete.
 */
function deleteTask(subtaskId) {
  const task = document.getElementById("subtaskTemplate" + subtaskId);
  if (task) {
    task.remove();
  }
}


/**
 * Clears the subtask input field and shows the main subtask button.
 */
function emptySubtaskInput() {
  document.getElementById("subtaskInput").value = "";
  showMainBtn();
}


/**
 * Switches a subtask from normal view mode to edit mode.
 * 
 * @param {number|string} subtaskId - The unique identifier of the subtask to edit.
 */
function editTask(subtaskId) {
  const subtask = document.getElementById("subtaskTemplate" + subtaskId);
  const taskNormalState = document.getElementById("taskNormalState" + subtaskId);
  const taskEditState = document.getElementById("taskEditState" + subtaskId);
  const titleHTML = document.getElementById("subtaskTitle" + subtaskId);
  const titleValue = titleHTML.innerText;
  const subtaskEditInput = document.getElementById("subtaskEditInput" + subtaskId);
  if (subtask) {
    taskNormalState.style.display = "none";
    taskEditState.style.display = "flex";
    subtaskEditInput.value = titleValue.trim();
    subtaskEditInput.focus();
  }
}


/**
 * Deletes the subtask element with the given ID from the DOM.
 * 
 * @param {number|string} subtaskId - The ID of the subtask to delete.
 */
function deleteSubtaskEditState(subtaskId) {
  const task = document.getElementById("subtaskTemplate" + subtaskId);
  if (task) {
    task.remove();
  }
}


/**
 * Updates the subtask title with the edited input value and exits edit mode.
 * 
 * @param {number|string} subtaskId - The ID of the subtask to update.
 */
function updateTask(subtaskId) {
  const activeTitle = document.getElementById("subtaskTitle" + subtaskId);
  const editTitle = document.getElementById("subtaskEditInput" + subtaskId);
  let editTitleValue = editTitle.value;
  if (activeTitle && editTitle) {
    activeTitle.innerText = editTitleValue.trim();
    exitSubtaskEditState(subtaskId);
  }
}


/**
 * Exits the edit mode of a subtask by toggling the display states of the normal and edit views.
 * 
 * @param {number|string} subtaskId - The ID of the subtask to exit edit mode.
 */
function exitSubtaskEditState(subtaskId) {
  const subtask = document.getElementById("subtaskTemplate" + subtaskId);
  const taskNormalState = document.getElementById("taskNormalState" + subtaskId);
  const taskEditState = document.getElementById("taskEditState" + subtaskId);
  if (subtask) {
    taskNormalState.style.display = "flex";
    taskEditState.style.display = "none";
  }
}


/**
 * Handles the Enter key event when editing a subtask.
 * Updates the subtask if input is not empty; otherwise, deletes the subtask edit state.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing a key.
 * @param {number|string} subtaskId - The ID of the subtask being edited.
 */
function postSubtaskOnEnter(event, subtaskId) {
  const taskInput = document.getElementById("subtaskEditInput" + subtaskId);
  if (event.key === "Enter" && taskInput.value.length !== 0) {
    updateTask(subtaskId);
  } else {
    deleteSubtaskEditState();
  }
}


/**
 * Displays the task success banner by adding the 'visible' class,
 * then removes the class after 1.5 seconds to hide the banner.
 * 
 * @returns {Promise<void>} A Promise that resolves after the banner is hidden.
 */
function showTaskSuccessBanner() {
    const banner = document.getElementById('createdTaskBanner');
    banner.classList.add('visible');
    new Promise((resolve) => {
        setTimeout(() => {
            banner.classList.remove('visible');
            resolve();
        }, 1500);
    })
}