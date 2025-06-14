/**
 * Resets the selected contact options in the UI and clears the chosen contacts array.
 */
function resetContacts() {
    const options = document.querySelectorAll(".option");
    const checked = document.querySelector(".checked");
    const unchecked = document.querySelector(".unchecked");
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      helpResetContacts(option, checked, unchecked);
    }
    chosenContacts = [];
    visualizeChosenContacts();
    closeContactAssignment();
  }


  /**
 * Resets all contact check icons in the UI by hiding the checked icons
 * and showing the unchecked ones.
 *
 * @returns {void}
 */
function resetContactCheckedBtn() {
    const checked = document.querySelectorAll(".checked");
    const unchecked = document.querySelectorAll(".unchecked");
    for (let i = 0; i < checked.length; i++) {
      const check = checked[i];
      check.style.display = "none";
    }
    for (let i = 0; i < unchecked.length; i++) {
      const uncheck = unchecked[i];
      uncheck.style.display = "inline";
    }
  }


/**
 * Resets the visual state of a selected contact option.
 * 
 * @param {HTMLDivElement} option – A div element that wraps the contact selection UI.
 * @param {SVGElement} checked – The SVG icon representing the "checked" state.
 * @param {SVGElement} unchecked – The SVG icon representing the "unchecked" state.
 */
function helpResetContacts(option, checked, unchecked) {
    if (option.classList.contains("selected-contact")) {
      option.classList.remove("selected-contact");
      resetContactCheckedBtn();
      checked.style.display = "none";
      unchecked.style.display = "inline";
    }
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