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
  