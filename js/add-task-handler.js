

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


function saveActivePriority() {
  const priorities = document.querySelectorAll(".priority-button");
  const active = Array.from(priorities).find((btn) => btn.classList.contains("active"));
  const priority = active ? ["medium", "urgent", "low"].find((p) => active.classList.contains(p)) : null;
  return priority;
}


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


function toggleCategoryOptions() {
  const arrow = document.getElementById("categoryArrow");
  const section = document.querySelector(".category-btn-and-options");
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
  input.style.cursor = "default";
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
  if (isSubtaskInputEmpty(input)) return;

  const valueRef = input.value.trim();
  const outputDiv = document.getElementById("subtaskContainer");
  const subtaskEditClass = decideCurrentTaskOverlay();

  createAndAppendSubtask(outputDiv, subtaskId, valueRef, subtaskEditClass);
  subtaskId += 1;
  finalizeSubtaskInput(input);
}


function finalizeSubtaskInput(input) {
  input.value = "";
  scrollToCreatedSubtask();
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