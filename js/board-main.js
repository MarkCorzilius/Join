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
  await checkContactsExistance();
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


async function visualizeTasks(tasks, firebaseContactsArray, container) {
  cleanTaskContacts(tasks, firebaseContactsArray);
  await renderTasksToContainer(tasks, container);
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
    if (!contact || !contact.id) continue;
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
  let foundCount = 0;
  const tasks = document.querySelectorAll(".task-body");
  const input = document.getElementById("searchTasksInput").value.toLowerCase();
  for (let i = 0; i < tasks.length; i++) {
    const title = tasks[i].querySelector(".task-title").innerText.toLowerCase();
    const description = tasks[i].querySelector(".task-description").innerText.toLowerCase();
    if (title.includes(input) || description.includes(input)) {
      tasks[i].style.display = "flex";
      foundCount++;
    } else {
      tasks[i].style.display = "none";
    }
  }
  showNoTasksMessage(foundCount);
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