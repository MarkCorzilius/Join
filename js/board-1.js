let disabled = false;
let currentColumn = 0;

async function boardOnLoad() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await initializePageStructure();
    prepareBoardEnvironment();
    await loadBoardTasks();
  } catch (error) {
    console.log("error in boardOnLoad:", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}

async function initializePageStructure() {
  w3.includeHTML();
  const waitForInclude = () =>
    new Promise((resolve) => {
      const checkExist = setInterval(() => {
        const sidebarLoaded = document.querySelector("#sidebar");
        const headerLoaded = document.querySelector("#header");
        if (sidebarLoaded && headerLoaded) {
          clearInterval(checkExist);
          resolve();
        }
      }, 50);
    });
  await waitForInclude();
}

function prepareBoardEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  taskId = Number(localStorage.getItem("taskId")) || 0;
}

async function loadBoardTasks() {
  await renderAllTasks();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  checkIfMobileLayout();
}

async function renderAllTasks() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await renderTasks("tasksContainer-0", "board/toDo/", "To Do");
    await renderTasks("tasksContainer-1", "board/InProgress/", "In Progress");
    await renderTasks("tasksContainer-2", "board/awaitFeedback/", "Await Feedback");
    await renderTasks("tasksContainer-3", "board/done/", "Done");
    await disableMoveBtns(".move-task-up", "board/toDo/");
    await disableMoveBtns(".move-task-down", "board/done/");
  } catch (error) {
    console.log("error in renderAllTasks()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}

async function renderTasks(id, path, emptyMessage) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  const rawTasks = await getData(path);
  const tasks = rawTasks ? Object.values(rawTasks) : [];
  if (tasks.length === 0) {
    container.innerHTML = emptyColumnTemplate(emptyMessage);
    return;
  }
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  await visualizeTasks(tasks, firebaseContactsArray, container);
}

async function visualizeTasks(tasks, firebaseContactsArray, container) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.contacts) {
      for (const key in task.contacts) {
        const contact = task.contacts[key];
        if (!contact) continue;
        const exists = firebaseContactsArray.find((fc) => fc.id === contact.id);
        if (!exists) {
          delete task.contacts[key];
        }
      }
    }
    const initialsHTML = await renderInitials(task);
    container.innerHTML += taskTemplate(task, initialsHTML);
    updateProgressBar(task);
  }
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

function focusedSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid rgb(42 170 226)";
}

function bluredSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid black";
}

function hoveredAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/hovered_add_task.png";
}

function normalAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/add_task_in_board.png";
}

function closeTaskOverlay() {
  const overlay = document.getElementById("createTaskInBoardOverlay");
  overlay.style.display = "none";
  localStorage.removeItem("taskColumn");
}

function openTaskOverlay(column) {
  currOverlay = "boardAddTaskOverlay";
  localStorage.setItem("taskColumn", column);
  if (window.innerWidth < 700) {
    window.location.href = "../templates/add_task.html";
  } else {
    const overlay = document.getElementById("createTaskInBoardOverlay");
    overlay.style.display = "flex";
    renderTaskDialog();
    resetPriorityBtn();
    currentColumn = column;
  }
  fetchContacts("contactOptions");
}

function renderTaskDialog() {
  const infoOverlay = document.getElementById("taskInfoOverlay");
  const overlay = document.getElementById("createTaskInBoardOverlay");
  infoOverlay.innerHTML = "";
  overlay.innerHTML = "";
  overlay.innerHTML += tasksDialogTemplate();
}

function renderCategory(task) {
  switch (task.category) {
    case "User Story":
      return `<img src="../img/user-story.png">`;
    case "Technical Task":
      return `<img src="../img/technical-task.png">`;
    default:
      return "";
  }
}

function renderPriorityIcon(task) {
  switch (task.priority) {
    case "urgent":
      return `../img/urgent_priority.png`;
    case "low":
      return `../img/low_priority.png`;
    default:
      return `../img/medium_priority.png`;
  }
}

function renderSubtasksAmount(task) {
  const subtasks = task.subtasks;
  const amount = subtasks ? Object.keys(subtasks).length : 0;
  return amount;
}

async function renderInitials(task) {
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  const taskContacts = Object.values(task.contacts || {});
  const contactsHTML = await checkContactsInitials(taskContacts, firebaseContactsArray);
  return contactsHTML;
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

function renderContacts(contacts) {
  let templateHTML = "";
  if (!contacts) return templateHTML;
  contacts.forEach((contact) => {
    templateHTML += `<div class="contact-initial" style="background-image: url('${contact.bg}'); background-size: cover; background-position: center;">
        ${contact.initial}
    </div>`;
  });
  return templateHTML;
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
    alert("chosen date is not in the future!");
    return;
  }
  const dataSafe = taskDataStorage();
  if (!restrictAddingTask()) {
    return;
  } else {
    await handleCreatingTask(column, dataSafe);
    chosenContacts = [];
  }
}

async function handleCreatingTask(column, dataSafe) {
  await postData("board/" + column, dataSafe);
  taskId += 1;
  localStorage.setItem("taskId", taskId.toString());
  emptyTaskDocument();
  closeTaskOverlay();
  await renderAllTasks();
}

function checkTargetColumn() {
  switch (currentColumn) {
    case 0:
      return "toDo/";
    case 1:
      return "InProgress/";
    case 2:
      return "awaitFeedback/";
    default:
      "toDo/";
      break;
  }
}

async function closeTaskInfoOverlay() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    const overlay = document.getElementById("taskInfoOverlay");
    overlay.classList.remove("active");
    overlay.innerHTML = '';
    chosenContacts = [];
    await renderAllTasks();
  } catch (error) {
    console.log("error in closeTaskInfoOverlay()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}

async function openTaskInfoOverlay(task) {
  currOverlay = "editOverlay";
  const overlay = document.getElementById("taskInfoOverlay");
  overlay.classList.add("active");
  await renderDetailedTask(task);
  const subtasksList = document.getElementById("subtasksList");
  const container = document.querySelector(".task-overlay-subtasks");
  if (subtasksList.children.length === 0) {
    container.style.display = "none";
  }
}

function toggleDeleteBtn(event) {
  const img = event.target;
  if (event.type === "mouseover") {
    img.src = "../img/delete_task_hovered.png";
  } else if (event.type === "mouseout") {
    img.src = "../img/delete_task.png";
  }
}

function toggleEditBtn(event) {
  const overlay = document.getElementById("taskInfoOverlay");
  const boardAddTask = document.getElementById("overlayDialogBoard");
  const img = event.target;
  if (event.type === "mouseover") {
    img.src = "../img/edit_task_hovered.png";
  } else if (event.type === "mouseout") {
    img.src = "../img/edit_task.png";
  } else if ("click") {
    handleEditBtnClick(overlay, boardAddTask);
  }
}

function handleEditBtnClick(overlay, boardAddTask) {
  currOverlay = "editOverlay";
  overlay.innerHTML = "";
  boardAddTask.innerHTML = "";
  overlay.innerHTML = editTaskTemplate();
}

async function renderDetailedTask(task) {
  const user = await findCurrentUser();
  const overlay = document.getElementById("taskInfoOverlay");
  overlay.innerHTML = taskDetailTemplate(task, user);
  currTask = task;
}