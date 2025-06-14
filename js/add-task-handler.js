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