function restrictAddingTask() {
  const title = document.getElementById("taskTitle");
  const date = document.getElementById("taskDate");
  if (chosenContacts.length === 0 || !title.value || !date.value) {
    alert("title, date and contacts are required!");
    return false;
  } else {
    return true;
  }
}

function isNotInTheFuture(inputDate) {
  const currentDate = new Date();
  const inputDateObject = new Date(inputDate);
  if (currentDate > inputDateObject) {
    return true;
  } else {
    return false;
  }
}

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
    if (!extractTaskValues()) {
      alert("chosen date is not in the future!");
      return;
    }
    const dataSafe = taskDataStorage();
    if (!restrictAddingTask()) {
      return;
    } else {
      await handlePostingTask(dataSafe);
      window.location.href = "../templates/board.html";
    }
  } catch (error) {
    console.log("error in getTaskData", error);
  } finally {
    document.querySelector(".create-task-button").disabled = false;
  }
}

async function handlePostingTask(dataSafe) {
  const columnNum = localStorage.getItem("taskColumn");
  const columnName = checkChosenColummn(columnNum);
  await postData(`board/${columnName}/`, dataSafe);
  taskId += 1;
  localStorage.setItem("taskId", taskId.toString());
  emptyTaskDocument();
  if (window.location.href.includes("task")) return;
  renderAllTasks();
  closeTaskOverlay();
}

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

async function fetchContacts() {
  let contactsContainer = document.getElementById("contactOptions");
  contactsContainer.innerHTML = "";
  let response = await fetch(BASE_URL + "contacts/" + ".json");
  let contacts = await response.json();
  await renderLoggedInUser(contactsContainer);
  for (const user of Object.values(contacts)) {
    await renderDefaultUsers(user, contactsContainer);
  }
}

async function renderLoggedInUser(contactsContainer) {
  const currUser = JSON.parse(localStorage.getItem('user'));
  const users = await getData('ourUsers/');
  if (!users) return;
  for (const user of Object.values(users)) {
    if (user.email === currUser.email) {
      const sanitizedEmail = sanitizeEmail(user.email);
      const currentIcon = await getData("ourUsers/" + sanitizedEmail + "/icon");
      contactsContainer.innerHTML += contactsTemplate(showUser(user.name), currentIcon.bg, currentIcon.initial);   
    }
  }
}

async function renderDefaultUsers(user, contactsContainer) {
  const sanitizedEmail = sanitizeEmail(user.email);
  const currentIcon = await getData("contacts/" + sanitizedEmail + "/icon");
  contactsContainer.innerHTML += contactsTemplate(user.name, currentIcon.bg, currentIcon.initial);
}

function contactsTemplate(name, bg, initial) {
  return `<div onclick="styleChosenContact(this, '${initial}', '${bg}', '${name}')" class="option contact-line">
                    <div>
                    <div class="initial" style="background-image:url('${bg}')" alt="profile icon">${initial}</div>
                    <span class="contact-name">${(name)}</span>
                    </div>
                    <svg class="select-box unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                      </svg>
                    <svg class="select-box checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 12L12 16L20 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                  </div>`;
}

function showUser(name) {
  const email = findUserEmail();
  if (currentUser.name === "Guest") {
    return name;
  } else {
    const markedName = name + ' (You)';
    return markedName;
  }
}

function sanitizeEmail(email) {
  return email.replace(/[@.]/g, "_");
}
