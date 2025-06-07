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


async function renderDetailedTask(task) {
  const user = await findCurrentUser();
  const overlay = document.getElementById("taskInfoOverlay");
  overlay.innerHTML = taskDetailTemplate(task, user);
  currTask = task;
}


async function findCurrentUser() {
  const currUser = JSON.parse(localStorage.getItem("user"));
  const users = await getData("ourUsers/");
  if (currUser.name === "Guest") {
    return "Guest";
  }
  for (const user of Object.values(users)) {
    if (currUser.email === user.email) {
      return user;
    }
  }
}

window.onresize = function handlePageRedirect() {
  const overlay = document.getElementById("createTaskInBoardOverlay");
  const isOVerlayOpen = overlay && overlay.style.display !== "none";
  if (isOVerlayOpen && window.innerWidth < 700) {
    window.location.href = "../templates/add_task.html";
  }
};

async function createTaskInBoardFireBase() {
  const column = checkTargetColumn();
  if (!extractTaskValues()) {
    showWarningOverlay(taskMissingFieldsTemplate());
    return;
  }
  taskId = await getData("taskId");
  const dataSafe = taskDataStorage();
  if (!restrictAddingTask()) {
    return;
  } else {
    await handleCreatingTask(column, dataSafe);
    showTaskSuccessBanner();
    chosenContacts = [];
  }
}


async function checkContactsInitials(taskContacts, firebaseContactsArray) {
  const userContacts = [];
  const otherContacts = [];
  const theUser = JSON.parse(localStorage.getItem("user"));
  for (const contact of taskContacts) {
    if (!contact || !contact.id) continue;
    const match = firebaseContactsArray.find((fc) => fc.id === contact.id);
    if (!match) continue;
    if (contact.id === theUser.id) {
      userContacts.push(contact);
    } else {
      otherContacts.push(contact);
    }
  }
  const userTemplate = renderContacts(userContacts);
  const contactsTemplate = renderContacts(otherContacts);
  return userTemplate + contactsTemplate;
}


async function handleCreatingTask(column, dataSafe) {
  taskId = await getIdFromDataBase("taskId");
  await postData("board/" + column, dataSafe);
  taskId += 1;
  await putIdToDataBase("taskId", taskId);
  emptyTaskDocument();
  closeTaskOverlay();
  await renderAllTasks();
}


function loopTaskContacts(task, user) {
  const { defaultHTML, userHTML } = separateUserFromContacts(task, user);
  const defTempl = returnContactTemplates(userHTML, user);
  const userTempl = returnContactTemplates(defaultHTML, user);
  return userTempl + defTempl;
}


function returnContactTemplates(contacts, user) {
  let templateHTML = "";
  if (!contacts) return;
  const ifUser = ifUserAddYou(contacts, user);
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact === null) continue;
    templateHTML += `
          <div class="task-overlay-contact">
              <div style="background-image: url('${contact.bg}')" class="initial">${contact.initial}</div>
              <p>${contact.name + ifUser}</p>
          </div>`;
  }
  return templateHTML;
}


function loopTaskSubtasks(task) {
  if (!task.subtasks || typeof task.subtasks !== "object") return "";
  if (Object.entries(task.subtasks).length === 0) return "";
  return handleLoopingSubtasks(task);
}


function handleLoopingSubtasks(task) {
  let templateHTML = "";
  for (const [subtaskKey, subtask] of Object.entries(task.subtasks)) {
    const { src, className } = renderCurrSubtaskState(subtask);
    templateHTML += subtasksTemplate(subtaskKey, className, src, subtask);
  }
  return templateHTML;
}


function renderCurrSubtaskState(subtask) {
  if (subtask.state === true) {
    return { src: `../img/checkbox_checked_unhovered.png`, className: "chosen" };
  } else {
    return { src: `../img/checkbox_unchecked_unhovered.png`, className: "" };
  }
}


function updateSubtaskIcon(isHovered = false, icon, subtaskKey) {
  const chosen = icon.classList.contains("chosen");
  if (chosen) {
    icon.src = isHovered ? "../img/checkbox_checked_hovered.png" : "../img/checkbox_checked_unhovered.png";
  } else {
    icon.src = isHovered ? "../img/checkbox_unchecked_hovered.png" : "../img/checkbox_unchecked_unhovered.png";
  }
  findChosenSubtasks(subtaskKey, icon);
}


async function findChosenSubtasks(subtaskKey, icon) {
  if (!icon) return;
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === currTask.id) {
        let isChosen = icon.classList.contains("chosen");
        const data = await putData(`board/${columnKey}/${taskKey}/subtasks/${subtaskKey}/state`, isChosen);
      }
    }
  }
}


function toggleSubtaskIcon(event, icon, subtaskKey) {
  switch (event.type) {
    case "click":
      icon.classList.toggle("chosen");
      updateSubtaskIcon(true, icon, subtaskKey);
      break;
    case "mouseover":
      updateSubtaskIcon(true, icon, subtaskKey);
      break;
    case "mouseout":
      updateSubtaskIcon(false, icon, subtaskKey);
      break;
    default:
      updateSubtaskIcon(false, icon, subtaskKey);
      break;
  }
}


function renderSubtasksDone(task) {
  let trueTasks = 0;
  const subtasks = Object.values(task.subtasks || {});
  for (const subtask of subtasks) {
    if (subtask.state === true) {
      trueTasks += 1;
    }
  }
  return trueTasks;
}


function updateProgressBar(task) {
  const done = renderSubtasksDone(task);
  const total = renderSubtasksAmount(task);
  let percentage = 0;
  if (total > 0) {
    percentage = (done / total) * 100;
  }
  const progressBar = document.getElementById(`progressBar${task.id}`);
  progressBar.style.width = `${percentage}%`;
}