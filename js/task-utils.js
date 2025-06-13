/**
 * Checks if required fields for adding a task are filled.
 * Ensures at least one contact chosen, title and date are not empty.
 * Shows warning overlay if validation fails.
 * @returns {boolean} True if all required fields are valid, false otherwise.
 */
function restrictAddingTask() {
  const title = document.getElementById("taskTitle");
  const date = document.getElementById("taskDate");
  if (chosenContacts.length === 0 || !title.value || !date.value) {
    showWarningOverlay(taskMissingFieldsTemplate())
    return false;
  } else {
    return true;
  }
}



/**
 * Checks if a given date is not in the future compared to current date.
 * @param {string} inputDate - Date string (e.g., "YYYY-MM-DD").
 * @returns {boolean} True if inputDate is earlier than or equal to current date, false otherwise.
 */
function isNotInTheFuture(inputDate) {
  const currentDate = new Date();
  const inputDateObject = new Date(inputDate);
  if (currentDate > inputDateObject) {
    return true;
  } else {
    return false;
  }
}


/**
 * Extracts task input values: title, description, and date.
 * Returns false if the date is in the past or today.
 * @returns {object|boolean} Object with {titleValue, descriptionValue, dateValue} or false if date invalid.
 */
function extractTaskValues() {
  const title = document.getElementById("taskTitle");
  const titleValue = title.value;
  const description = document.getElementById("description");
  const descriptionValue = description.value;
  const date = document.getElementById("taskDate");
  const dateValue = date.value;
  if (isNotInTheFuture(dateValue)) {
    return false;
  } else {
    return { titleValue, descriptionValue, dateValue };
  }
}


/**
 * Converts a column number string to its corresponding column key.
 * @param {string} columnNum - Numeric string representing a column.
 * @returns {string} Corresponding column key.
 */
function checkChosenColummn(columnNum) {
  switch (columnNum) {
    case "0":
      return "toDo";
    case "1":
      return "InProgress";
    case "2":
      return "awaitFeedback";
    case "3":
      return "done";
    default:
      return "toDo";
  }
}


/**
 * Changes the clear button image to the blue hover state.
 */
function clearBtnToBlue() {
    document.getElementById("clearBtn").src = "../img/clear_btn_hovered.png";
  }

/**
 * Changes the clear button image back to the black default state.
 */
function clearBtnToBlack() {
    document.getElementById("clearBtn").src = "../img/close.png";
  }


  /**
 * Checks if a subtask input element is empty (ignores whitespace).
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {boolean} True if input is empty or whitespace only, false otherwise.
 */
function isSubtaskInputEmpty(input) {
    const empty = input.value.trim() === "";
    return empty;
  }