function toggleCategoryOptions() {
  const arrow = document.getElementById("categoryArrow");
  const section = document.querySelector(".category-section");
  const optionsRef = document.querySelector(".category-options");
  optionsRef.style.display = optionsRef.style.display === "flex" ? "none" : "flex";
  isCategoryOptionsOpen(arrow, section, optionsRef);
}

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

function chooseCategory(option) {
  const containerRef = document.getElementById("categoryChoiceInsert");
  const choice = option.innerText;

  containerRef.innerText = "";
  containerRef.innerText = choice;

  toggleCategoryOptions();
}

function showActionBtns() {
  const input = document.getElementById("subtaskInput");
  const focusBtns = document.getElementById("focusBtns");
  const mainBtn = document.getElementById("subtaskMainBtn");

  mainBtn.style.display = "none";
  focusBtns.style.display = "flex";
  input.focus();
}

function showMainBtn() {
  const focusBtns = document.getElementById("focusBtns");
  const mainBtn = document.getElementById("subtaskMainBtn");

  mainBtn.style.display = "flex";
  focusBtns.style.display = "none";
}

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

function subtaskTemplate(subtaskId, valueRef, subtaskClass) {
  return `                    
                                          <div class="template-subtask" id="subtaskTemplate${subtaskId}">
                        <div class="form-subtask-template task-active-state" id="taskNormalState${subtaskId}">
                         <div class="subtask-title">
                           <p>•</p>
                           <span id="subtaskTitle${subtaskId}" class="subtask-titles">${valueRef}</span>
                         </div>
                         <div class="control-subtask">
                           <div class="subtask-edit-icons">
                           <img onclick="editTask(${subtaskId})" src="../img/subtask_pencil.png" alt="edit">
                           <div class="subtask-separator"></div>
                           <img onclick="deleteTask(${subtaskId})" src="../img/subtask_trash.png" alt="delete">
                           </div>
                         </div>
                        </div>
  
                      <div class="task-active-state task-edit-state" id="taskEditState${subtaskId}" style="display: none;">
                        <div class="subtask-template-edit-state ${subtaskClass} subtask-edit-state" class="form-subtask-edit-input-wrapper">
                          <input onkeydown="postSubtaskOnEnter(event, ${subtaskId})" id="subtaskEditInput${subtaskId}" class="form-subtask-edit-input ${subtaskClass}" type="text">
                          <div class="subtask-icons-on-edit">
                            <div onclick="deleteSubtaskEditState(${subtaskId})" id="deleteSubtaskEditState${subtaskId}" class="subtask-icon-wrapper">
                            <img src="../img/subtask_trash.png" alt="delete">
                            </div>
                            <div class="subtask-separator"></div>
                            <div onclick="updateTask(${subtaskId})" class="subtask-icon-wrapper">
                            <img src="../img/subtask_edit_confirm.png" alt="confirm">
                            </div>
                            </div>
                        </div>
                      </div>
                    </div>`;
}

function scrollToCreatedSubtask() {
  const container = document.getElementById("subtaskContainer");
  container.scrollTop = container.scrollHeight;
}

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

function resetCategory() {
  document.getElementById("categoryChoiceInsert").innerText = "Select task category";
}

function resetSubtasks() {
  const subtasks = document.getElementById("subtaskContainer");
  subtasks.innerHTML = "";
}

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

function blurOnEnter(event) {
  if (event.key === "Enter") {
    event.target.blur();
  }
}

function deleteTask(subtaskId) {
  const task = document.getElementById("subtaskTemplate" + subtaskId);
  if (task) {
    task.remove();
  }
}

function emptySubtaskInput() {
  document.getElementById("subtaskInput").value = "";
  showMainBtn();
}

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

function deleteSubtaskEditState(subtaskId) {
  const delBtn = document.getElementById("deleteSubtaskEditState" + subtaskId);
  const task = document.getElementById("subtaskTemplate" + subtaskId);
  if (task) {
    task.remove();
  }
}

function updateTask(subtaskId) {
  const activeTitle = document.getElementById("subtaskTitle" + subtaskId);
  const editTitle = document.getElementById("subtaskEditInput" + subtaskId);
  let editTitleValue = editTitle.value;
  if (activeTitle && editTitle) {
    activeTitle.innerText = editTitleValue.trim();
    exitSubtaskEditState(subtaskId);
  }
}

function exitSubtaskEditState(subtaskId) {
  const subtask = document.getElementById("subtaskTemplate" + subtaskId);
  const taskNormalState = document.getElementById("taskNormalState" + subtaskId);
  const taskEditState = document.getElementById("taskEditState" + subtaskId);
  if (subtask) {
    taskNormalState.style.display = "flex";
    taskEditState.style.display = "none";
  }
}

function postSubtaskOnEnter(event, subtaskId) {
  const taskInput = document.getElementById("subtaskEditInput" + subtaskId);
  if (event.key === "Enter" && taskInput.value.length !== 0) {
    updateTask(subtaskId);
  } else {
    deleteSubtaskEditState();
  }
}
