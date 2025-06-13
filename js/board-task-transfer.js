/**
 * Handles the transfer of a task to a different column with loading indicator.
 * @param {Object} task - The task to transfer.
 * @param {string} column - The target column identifier.
 * @returns {Promise<void>}
 */
async function handleTaskTransfer(task, column) {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await iterateForTaskTransfer(task, column);
  } catch (error) {
    console.log("error in handleTaskTransfer()");
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}

/**
 * Moves a task from its current column to a new column in the board data.
 * @param {Object} task - The task to transfer.
 * @param {string} column - The target column key.
 * @returns {Promise<void>}
 */
async function iterateForTaskTransfer(task, column) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === task.id) {
        await postData(`board/${column}`, task);
        await deleteData(`board/${columnKey}/${taskKey}`);
      }
    }
  }
}

/**
 * Moves a task between columns on mobile devices based on direction.
 * @param {string} direction - Movement direction ("forward" or "back").
 * @param {Object} task - The task to move.
 * @param {Event} event - The event triggering the move.
 * @param {HTMLElement} element - The related DOM element.
 * @returns {Promise<void>}
 */
async function moveMobileTasks(direction, task, event, element) {
  event.stopPropagation();
  const currColumnName = await checkCurrColumnName(task.id);
  const nextColumn = await checkNextColumnName(task.id, currColumnName);
  const prevColumn = await checkPrevColumnName(task.id, currColumnName);
  switch (direction) {
    case "forward":
      handleForwardCase(nextColumn, element, task);
      break;
    case "back":
      handleBackCase(prevColumn, element, task);
      break;
  }
}


/**
 * Handles moving a task forward to the next column, disabling the element if moving to "done".
 * @param {string} nextColumn - The target column key.
 * @param {HTMLElement} element - The DOM element to modify.
 * @param {Object} task - The task to transfer.
 * @returns {Promise<void>}
 */
async function handleForwardCase(nextColumn, element, task) {
  if (nextColumn === "done") {
    element.classList.add("disabled");
    await handleTaskTransfer(task, nextColumn);
  } else {
    await handleTaskTransfer(task, nextColumn);
  }
  await renderAllTasks();
}


/**
 * Handles moving a task backward to the previous column, disabling the element if moving to "toDo".
 * @param {string} prevColumn - The target column key.
 * @param {HTMLElement} element - The DOM element to modify.
 * @param {Object} task - The task to transfer.
 * @returns {Promise<void>}
 */
async function handleBackCase(prevColumn, element, task) {
  if (prevColumn === "toDo") {
    element.classList.add("disabled");
    await handleTaskTransfer(task, prevColumn);
  } else {
    await handleTaskTransfer(task, prevColumn);
  }
  await renderAllTasks();
}


/**
 * Finds the current column name of a task by its ID.
 * @param {number|string} id - The task ID to search for.
 * @returns {Promise<string|undefined>} - The column name or undefined if not found.
 */
async function checkCurrColumnName(id) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === id) {
        return `${columnKey}`;
      }
    }
  }
}


/**
 * Disables move buttons for tasks retrieved from the specified path.
 * @param {string} course - Selector for the button to disable.
 * @param {string} path - Firebase path to fetch tasks from.
 * @returns {Promise<void>}
 */
async function disableMoveBtns(course, path) {
  const toDos = await getData(path);
  if (!toDos) return;
  for (const task of Object.values(toDos)) {
    const taskBody = document.getElementById(`taskBody${task.id}`);
    if (taskBody) {
      const btn = taskBody.querySelector(course);
      if (btn) {
        btn.classList.add("disabled");
      }
    }
  }
}


/**
 * Determines the next column name in the workflow after the current column.
 * @param {string|number} id - Task ID (unused in function).
 * @param {string} currColumnName - The current column name.
 * @returns {Promise<string|undefined>} - The next column name or undefined if at end.
 */
async function checkNextColumnName(id, currColumnName) {
  const order = ["toDo", "InProgress", "awaitFeedback", "done"];
  const currColumnIndex = order.indexOf(currColumnName);
  const nextColumnName = order[currColumnIndex + 1];
  return nextColumnName;
}


/**
 * Determines the previous column name in the workflow before the current column.
 * @param {string|number} id - Task ID (unused in function).
 * @param {string} currColumnName - The current column name.
 * @returns {Promise<string|undefined>} - The previous column name or undefined if at start.
 */
async function checkPrevColumnName(id, currColumnName) {
  const order = ["toDo", "InProgress", "awaitFeedback", "done"];
  const currColumnIndex = order.indexOf(currColumnName);
  const prevColumnName = order[currColumnIndex - 1];
  return prevColumnName;
}