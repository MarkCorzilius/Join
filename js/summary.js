let nearestDate = null;
const today = new Date();

async function summaryOnLoad() {
  document.querySelector('.spinner-overlay').style.display = 'flex';
  try {
    w3.includeHTML();
    updateGreeting();
    findToDoAmount();
    findDoneAmount();
    findUrgentTasksAmount();
    findTasksInProgressAmount();
    findAwaitingTasksAmount();
    findNextUrgentDeadline();
    findOverallTasksAmount();
    showLogedInName();
    
  } catch (error) {
    console.log('failed loading summary');
  } finally {
    document.querySelector('.spinner-overlay').style.display = 'none';
  }
}

function showLogedInName() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('theUser').innerText = user.name;
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

function findCurrentGreeting(hour) {
  const container = document.getElementById('greetingUser');
  let greeting;
  if (hour >= 5 && hour <= 11) {
    greeting = "Good morning,";
  } else if (hour >= 12 && hour <= 16) {
    greeting = "Good afternoon,";
  } else if (hour >= 17 && hour <= 20) {
    greeting = "Good evening,";
  } else {
    greeting = "Hello,"; // or "Good night" if it's a parting message
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
  priorityCounter = 0;
  const container = document.getElementById('urgentAmount');
  const board = await getData('board/')
  if (board === null) {
    container.innerText = 0;
    return;
  }
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey,task] of Object.entries(tasks)) {
      if (task.priority === 'urgent') {
        priorityCounter += 1;
      }
    }
  }
  container.innerText = priorityCounter;
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
  formattedDate = date.toLocaleDateString('en-US', {
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