let nearestDate = null;
const today = new Date();


/**
 * Initializes the summary page on load.
 * Shows spinner, includes HTML, then initializes UI.
 */
async function summaryOnLoad() {
  showSpinner(true);
  w3.includeHTML();
  try {
    await waitForInclude();
    initializeSummaryUI();
  } catch (error) {
    console.log("Failed loading summary:", error);
  } finally {
    showSpinner(false);
  }
}


/**
 * Toggles visibility of spinner overlay.
 * @param {boolean} visible - Show spinner if true, hide if false.
 */
function showSpinner(visible) {
  document.querySelector(".spinner-overlay").style.display = visible ? "flex" : "none";
}


/**
 * Returns a promise that resolves when sidebar and header are loaded.
 * Polls DOM every 50ms.
 * @returns {Promise<void>}
 */
function waitForInclude() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      if (document.querySelector("#sidebar") && document.querySelector("#header")) {
        clearInterval(checkExist);
        resolve();
      }
    }, 50);
  });
}


/**
 * Runs all UI initialization functions for the summary page.
 */
function initializeSummaryUI() {
  showGreetingOverlayAfterLogIn();
  updateGreeting("logedInGreeting", "logedInUser");
  updateGreeting("greetingUser", "theUser");
  markCurrentPage();
  adjustSideBar();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  findToDoAmount();
  findDoneAmount();
  findUrgentTasksAmount();
  findTasksInProgressAmount();
  findAwaitingTasksAmount();
  findNextUrgentDeadline();
  findOverallTasksAmount();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Returns current hour as string.
 * @returns {Promise<string>} Current hour (0-23).
 */
async function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours());
  return hours;
}


/**
 * Updates greeting text based on current hour.
 * @param {string} userGreeting - ID of greeting container.
 * @param {string} userName - ID of user name container.
 */
async function updateGreeting(userGreeting, userName) {
  const hour = await getCurrentTime();
  showCurrentGreeting(hour, userGreeting, userName);
}


/**
 * Sets greeting message based on hour and user status.
 * @param {string|number} hour - Current hour (0-23).
 * @param {string} userGreeting - ID of greeting container.
 * @param {string} userName - ID of user name container.
 */
function showCurrentGreeting(hour, userGreeting, userName) {
  const container = document.getElementById(userGreeting);
  let greeting;
  if (hour >= 5 && hour <= 11) {
    greeting = "Good morning,";
  } else if (hour >= 12 && hour <= 16) {
    greeting = "Good afternoon,";
  } else if (hour >= 17 && hour <= 20) {
    greeting = "Good evening,";
  } else {
    greeting = "Good Night,";
  }
  if (container) {
    container.innerText = greeting;
  }
  checkIfGuest(userGreeting, userName);
}


/**
 * Adjusts greeting text if user is Guest or logged in.
 * @param {string} userGreeting - ID of greeting container.
 * @param {string} userName - ID of user name container.
 */
function checkIfGuest(userGreeting, userName) {
  if (!userGreeting || !userName) return;
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  if (user.name === "Guest") {
    document.getElementById(userName).innerText = "";
    const greeting = document.getElementById(userGreeting);
    const newGreeting = greeting.innerText.replace(",", "");
    greeting.innerText = newGreeting;
  } else {
    ifLoggedInUser(user, userName);
  }
}


/**
 * Sets logged-in user's name in the greeting element.
 * @param {{name: string}} user - User object.
 * @param {string} userName - ID of user name container.
 */
function ifLoggedInUser(user, userName) {
  const greeting = document.getElementById(userName);
  greeting.innerText = user.name;
}



/**
 * Updates greeting every minute.
 */
setInterval(() => {
  updateGreeting();
}, 60 * 1000);


/**
 * Counts and displays number of To-Do tasks.
 */
async function findToDoAmount() {
  const container = document.getElementById("toDoAmount");
  const tasks = await getData("board/toDo/");
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}

/**
 * Counts and displays number of Done tasks.
 */
async function findDoneAmount() {
  const container = document.getElementById("doneAmount");
  const tasks = await getData("board/done");
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}


/**
 * Counts and displays number of Urgent tasks across board.
 */
async function findUrgentTasksAmount() {
  const container = document.getElementById("urgentAmount");
  const board = await getData("board/");
  if (board === null) {
    container.innerText = 0;
    return;
  }
  const priorityCounter = countUrgentTasks(board);
  container.innerText = priorityCounter;
}


/**
 * Counts how many tasks have urgent priority.
 * @param {object} board - Board object with tasks grouped by columns.
 * @returns {number} Number of urgent tasks.
 */
function countUrgentTasks(board) {
  let count = 0;
  for (const tasks of Object.values(board)) {
    for (const task of Object.values(tasks)) {
      if (task.priority === "urgent") {
        count += 1;
      }
    }
  }
  return count;
}


/**
 * Counts and displays number of In-Progress tasks.
 */
async function findTasksInProgressAmount() {
  const container = document.getElementById("inProgressAmount");
  const tasks = await getData("board/InProgress/");
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}


/**
 * Counts and displays number of Awaiting Feedback tasks.
 */
async function findAwaitingTasksAmount() {
  const container = document.getElementById("awaitAmount");
  const tasks = await getData("board/awaitFeedback/");
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}


/**
 * Finds and displays the next urgent task deadline.
 */
async function findNextUrgentDeadline() {
  const container = document.getElementById("taskDeadline");
  const board = await getData("board/");
  if (board === null) {
    container.innerText = "No Urgent deadlines";
    document.getElementById("deadlineTxt").innerText = "";
    return;
  }
  iterateForNextUrgentTaskDate(board);
  container.innerText = formatDate(nearestDate);
}


/**
 * Iterates board to find the nearest urgent task deadline.
 * Updates global nearestDate.
 * @param {object} board - Board object with tasks.
 */
function iterateForNextUrgentTaskDate(board) {
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
      if (task.priority === "urgent") {
        const taskDate = new Date(task.date);
        if (task.date < today) continue;
        if (!nearestDate || taskDate < nearestDate) {
          nearestDate = taskDate;
        }
      }
    }
  }
}

/**
 * Formats a date to a readable string or returns default message.
 * @param {Date|null} date - Date to format.
 * @returns {string} Formatted date or fallback text.
 */
function formatDate(date) {
  if (date === null) {
    document.getElementById("deadlineTxt").innerText = "";
    document.getElementById("taskDeadline").innerText = "No Urgent deadlines";
    return "No Urgent Deadlines";
  } else {
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  }
}


/**
 * Counts and displays total number of tasks across the board.
 */
async function findOverallTasksAmount() {
  const container = document.getElementById("tasksInBoard");
  let tasksCounter = 0;
  const board = await getData("board/");
  if (!board) {
    container.innerText = tasksCounter;
    return;
  }
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const taskKey of Object.entries(tasks)) {
      tasksCounter += 1;
    }
  }
  container.innerText = tasksCounter;
}


/**
 * Shows a greeting overlay if user just logged in (from index page).
 */
async function showGreetingOverlayAfterLogIn() {
  if (document.referrer.includes("index")) {
    const overlay = document.getElementById("greetingOverlay");
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("fade-out");
    }, 1500);
  }
}