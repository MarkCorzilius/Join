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