let nearestDate = null;
const today = new Date();

async function summaryOnLoad() {
  showSpinner(true);
  w3.includeHTML();

  try {
    await waitForInclude();
    initializeSummaryUI();
  } catch (error) {
    console.log('Failed loading summary:', error);
  } finally {
    showSpinner(false);
  }
}

function showSpinner(visible) {
  document.querySelector('.spinner-overlay').style.display = visible ? 'flex' : 'none';
}

function waitForInclude() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      if (document.querySelector('#sidebar') && document.querySelector('#header')) {
        clearInterval(checkExist);
        resolve();
      }
    }, 50);
  });
}

function initializeSummaryUI() {
  showLogedInName();
  insertLoggedInName();
  showGreetingOverlayAfterLogIn();
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  updateGreeting();

  findToDoAmount();
  findDoneAmount();
  findUrgentTasksAmount();
  findTasksInProgressAmount();
  findAwaitingTasksAmount();
  findNextUrgentDeadline();
  findOverallTasksAmount();

  adjustHelpForMobile();
  window.addEventListener('resize', adjustHelpForMobile);
}

function showLogedInName() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.name !== 'Guest') {
    document.getElementById('theUser').innerText = user.name;
  } else {
    document.getElementById('theUser').innerText = '';
  }
}

function insertLoggedInName() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('logedInUser').innerText = user.name;
}


async function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours());
  return hours;
}


async function updateGreeting() {
  const hour = await getCurrentTime();
  findCurrentGreeting(hour);
}

function checkIfGuest() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.name === 'Guest') {
    const overlayGreeting = document.getElementById('logedInGreeting');
    const newOverlayGreeting = overlayGreeting.innerText.replace(',', '');
    const greeting = document.getElementById('greetingUser');
    const newGreeting = greeting.innerText.replace(',', '');
    greeting.innerText = newGreeting;
    overlayGreeting.innerText = newOverlayGreeting;
  }
}

// check if guest after loading this text

// if guest –> hide name and remove ,

function findCurrentGreeting(hour) {

  const container = document.getElementById('greetingUser');
  if (!container) return;
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
  container.innerText = greeting;
}

setInterval(() => {
  updateGreeting();
}, 60 * 1000);

async function findToDoAmount() {
  const container = document.getElementById('toDoAmount');
  const tasks = await getData('board/toDo/');
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}

async function findDoneAmount() {
  const container = document.getElementById('doneAmount');
  const tasks = await getData('board/done');
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}

async function findUrgentTasksAmount() {
  const container = document.getElementById('urgentAmount');
  const board = await getData('board/');

  if (board === null) {
    container.innerText = 0;
    return;
  }
  const priorityCounter = countUrgentTasks(board);
  container.innerText = priorityCounter;
}

function countUrgentTasks(board) {
  let count = 0;
  for (const tasks of Object.values(board)) {
    for (const task of Object.values(tasks)) {
      if (task.priority === 'urgent') {
        count += 1;
      }
    }
  }
  return count;
}

async function findTasksInProgressAmount() {
  const container = document.getElementById('inProgressAmount');
  const tasks = await getData('board/InProgress/');
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}


async function findAwaitingTasksAmount() {
  const container = document.getElementById('awaitAmount');
  const tasks = await getData('board/awaitFeedback/');
  if (!tasks || Object.values(tasks).length === 0) {
    container.innerText = 0;
    return;
  } else {
    const amount = Object.values(tasks).length;
    container.innerText = amount;
  }
}

async function findNextUrgentDeadline() {
  const container = document.getElementById('taskDeadline');
  const board = await getData('board/');
  if (board === null) {
    container.innerText = 'No active deadline!';
    document.getElementById('deadlineTxt') = ""; 
  }
  iterateForNextUrgentTaskDate(board);
  container.innerText = formatDate(nearestDate);

}

function iterateForNextUrgentTaskDate(board) {
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, task] of Object.entries(tasks)) {
      if (task.priority === 'urgent') {
        const taskDate = new Date(task.date);
        if (task.date < today) continue;
        if (!nearestDate || taskDate < nearestDate) {
          nearestDate = taskDate;
        }
      }
    }
  }
}

function formatDate(date) {
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formattedDate;
}


async function findOverallTasksAmount() {
  const container = document.getElementById('tasksInBoard');
  let tasksCounter = null;
  const board = await getData('board/');
  if (!board) return 0;
  for (const [columnKey, tasks] of Object.entries(board)) {
    tasksCounter += 1;
  }
  container.innerText = tasksCounter;
}

async function showGreetingOverlayAfterLogIn() {
  if (document.referrer.includes('index')) {
    const overlay = document.getElementById('greetingOverlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.add('fade-out');
    }, 1500);
  }
}
