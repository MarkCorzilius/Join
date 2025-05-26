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

async function handleOpeningEditOverlay(task) {
  const addTaskOverlay = document.getElementById("createTaskInBoardOverlay");
  const overlay = document.getElementById("taskInfoOverlay");
  addTaskOverlay.innerHTML = "";
  overlay.innerHTML = "";
  overlay.innerHTML = editTaskTemplate(task);
  await fetchContacts("contactOptions");
  renderTaskDetails(task);
}

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
// change –>  check with id
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

async function changeCurrTask() {
  if (!extractTaskValues()) {
    alert("chosen date is not in the future!");
    return;
  }
  const newTaskData = updatedTaskDataStorage();
  if (!restrictAddingTask()) return;
  const taskUpdated = await handlePostingChangedTask(newTaskData);
  if (taskUpdated) {
    closeTaskInfoOverlay();
  }
}

async function handlePostingChangedTask(newTaskData) {
  const rawBoard = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(rawBoard)) {
    for (const [tasksKey, task] of Object.entries(tasks)) {
      if (task.id === currTask.id) {
        await putData(`board/${columnKey}/${tasksKey}`, newTaskData);
        return true;
      }
    }
  }
  return false;
}

function updatedTaskDataStorage() {
  const { titleValue, descriptionValue, dateValue } = extractTaskValues();
  const dataSafe = {
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

function getUpdatedCategory() {
  const newCategory = currTask.category;
  if (newCategory === undefined) {
    return;
  } else {
    return newCategory;
  }
}
