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
    const addTaskOverlay = document.getElementById("createTaskInBoardOverlay");
    const overlay = document.getElementById("taskInfoOverlay");
    addTaskOverlay.innerHTML = "";
    overlay.innerHTML = "";
    overlay.innerHTML = editTaskTemplate(task);
    await fetchContacts('contactOptions');
    renderTaskDetails(task);
  } catch (error) {
    console.log("error in openTaskEditStateInOverlay()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
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
  const user = await showCurrUser();
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact === null) continue;
    const element = checkChosenNames(contact);
    styleChosenContact(element, contact.initial, contact.bg, contact.name);
  }
}

async function showCurrUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const ourUsers = await getData('ourUsers/')
    const contactLine = document.querySelectorAll(".contact-line");
    if (loggedInUser.name !== 'Guest' || ourUsers) {
        for (const user of Object.values(ourUsers)) {
            console.log(user);
            if (user.email === loggedInUser.email) {
                const element = contactLine[0];
                styleChosenContact(element, user.icon.initial, user.icon.bg, user.name);
            }
        }
    } else {
        return;
    }
}

function checkChosenNames(contact) {
  const names = document.querySelectorAll(".contact-name");
  const contactLine = document.querySelectorAll(".contact-line");
  for (let i = 1; i < names.length; i++) {
    const name = names[i];
    if (name.textContent.replace('(You)', '').trim() === contact.name) {
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

    default:
      break;
  }
}

async function changeCurrTask() {
  if (!extractTaskValues()) {
    alert("chosen date is not in the future!");
    return;
  }

  const newTaskData = updatedTaskDataStorage();

  if (!restrictAddingTask()) {
    return;
  }

  const rawBoard = await getData("board/");
  let taskUpdated = false;

  for (const [columnKey, tasks] of Object.entries(rawBoard)) {
    for (const [tasksKey, task] of Object.entries(tasks)) {
      if (task.id === currTask.id) {
        await putData(`board/${columnKey}/${tasksKey}`, newTaskData);
        taskUpdated = true;
        break;
      }
    }
    if (taskUpdated) break;
  }
  if (taskUpdated) {
    closeTaskInfoOverlay();
  }
}

function updatedTaskDataStorage() {
  const { titleValue, descriptionValue, dateValue } = extractTaskValues();
  const dataSafe = {
    id: taskId,
    title: titleValue,
    description: descriptionValue,
    date: dateValue,
    priority: saveActivePriority(),
    contacts: chosenContacts,
    category: currTask.category,
    subtasks: saveSubtasks(),
};
  return dataSafe;
}
