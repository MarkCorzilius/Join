let disabled = false;
let currentColumn = 0;
let searching = false;

async function boardOnLoad() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await initializePageStructure();
    await prepareBoardEnvironment();
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


async function prepareBoardEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  await putFirstIdForTasksAndContacts("taskId")
  displayLegalNoticeAndPrivacyPolicy();
}


async function loadBoardTasks() {
  await renderAllTasks();
  await checkContactsExistance();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  checkIfMobileLayout();
}


async function renderAllTasks() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await renderTasks("tasksContainer-0", "board/toDo/", "No tasks To Do");
    await renderTasks("tasksContainer-1", "board/InProgress/", "No tasks In Progress");
    await renderTasks("tasksContainer-2", "board/awaitFeedback/", "No tasks Await Feedback");
    await renderTasks("tasksContainer-3", "board/done/", "No tasks Done");
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


function cleanTaskContacts(tasks, firebaseContactsArray) {
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
  }
}


async function renderTasksToContainer(tasks, container) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const initialsHTML = await renderInitials(task);
    container.innerHTML += taskTemplate(task, initialsHTML);
    updateProgressBar(task);
  }
}


function displayProgressBar(amount, taskId) {
  const progressBar = document.getElementById(`progressSection${taskId}`);
  if (amount === 0) {
    progressBar.style.display = 'none';
  } else {
    progressBar.style.display = "flex";
  }
}


async function visualizeTasks(tasks, firebaseContactsArray, container) {
  cleanTaskContacts(tasks, firebaseContactsArray);
  await renderTasksToContainer(tasks, container);
}


function focusedSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid rgb(42 170 226)";
  searching = true;
}


function bluredSearchContainer() {
  const container = document.querySelector(".search-container");
  container.style.border = "1px solid black";
  searching = false;
  displayRightMessageIfColumnEmpty(searching);
}

function displayRightMessageIfColumnEmpty(searching) {
  const emptyColumnMessage = document.querySelectorAll('.empty-column');
  const emptySearchMessage = document.querySelectorAll('.empty-search');
  const input = document.getElementById('searchTasksInput');
  if (!searching) {
    switchEmptyMessages(emptyColumnMessage, emptySearchMessage, input);
  }
}

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


function hoveredAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/hovered_add_task.png";
}


function normalAddTaskIcon(element) {
  const icon = document.getElementsByClassName("new-board-task")[element];
  icon.src = "../img/add_task_in_board.png";
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


function encodeTask(task) {
  return JSON.stringify(task).replace(/"/g, "&quot;");
}


function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}


function capitalize(word) {
  if (typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}


function ifUserAddYou(contacts, user) {
  if (contacts.length === 0) return "";
  for (let contact of contacts) {
    if (contact.name === user.name) {
      return " (You)";
    }
  }
  return "";
}


function separateUserFromContacts(task, user) {
  let defaultHTML = [];
  let userHTML = [];
  if (!task.contacts) return "";
  for (let i = 0; i < task.contacts.length; i++) {
    const contact = task.contacts[i];
    if (!contact || contact.id == null) continue;
    if (contact.id !== user.id) {
      defaultHTML.push(contact);
    } else {
      userHTML.push(contact);
    }
  }
  return { defaultHTML, userHTML };
}


function toggleMobileTaskAddBtn(event) {
  const img = event.target;
  const hoverSrc = `../img/mobile_add_task_hovered.png`;
  const basicSrc = `../img/mobile_add_task_btn.png`;
  img.src = event.type === "mouseover" ? hoverSrc : basicSrc;
}


function searchTasks() {
  const tasks = document.querySelectorAll(".task-body");
  const input = document.getElementById("searchTasksInput").value.toLowerCase();

  const foundCount = hideTaskIfDontContainInput(tasks, input);
  showNoTasksMessage(foundCount);
}


function hideTaskIfDontContainInput(tasks, input, foundCount) {
  for (let i = 0; i < tasks.length; i++) {
    foundCount = toggleTaskVisibility(tasks[i], input, foundCount);
  }
  hideColumnIfNoTasksFoundInColumn();
  return foundCount;
}

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


function hideColumnIfNoTasksFoundInColumn() {
  const columns = document.querySelectorAll('.tasks-container');
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const tasksFound = checkIfColumnHasVisibleTasks(column);
    showOrHideEmptyMessages(column, tasksFound);
  }
}


function checkIfColumnHasVisibleTasks(column) {
  return Array.from(column.children).some(task =>
    task.classList.contains('task-body') && task.style.display !== "none"
  );
}


function showOrHideEmptyMessages(column, tasksFound) {
  const emptySearchMessage = column.querySelector('.empty-search');
  const emptyColumnMessage = column.querySelector('.empty-column');
  const taskElements = column.querySelectorAll('.task-body');

  if (!tasksFound) {
    if (!emptySearchMessage) {
      if (emptyColumnMessage) emptyColumnMessage.style.display = 'none';
      column.insertAdjacentHTML('beforeend', emptySearchColumnTemplate('No matches'));
    }
  } else {
    if (emptySearchMessage) emptySearchMessage.remove();
    if (emptyColumnMessage)
      emptyColumnMessage.style.display = taskElements.length > 0 ? 'none' : 'flex';
  }
}


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