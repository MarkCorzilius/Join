let currentColumn = 0;
let currTask = null;

async function boardOnLoad() {
    document.querySelector('.spinner-overlay').style.display = "flex";
    
    w3.includeHTML();

    const waitForInclude = () => new Promise((resolve) => {
        const checkExist = setInterval(() => {
            const sidebarLoaded = document.querySelector('#sidebar');
            const headerLoaded = document.querySelector('#header');
            if (sidebarLoaded && headerLoaded) {
            clearInterval(checkExist);
            resolve();
          }
        }, 50);
      });
    try {
    await waitForInclude();
    markCurrentPage(); 
    ifGuestShowDropdownHelp();
    adjustInitialAfterLogin();
        taskId = Number(localStorage.getItem('taskId')) || 0; 
        await renderAllTasks();
        adjustHelpForMobile(); 
        window.addEventListener('resize', adjustHelpForMobile);
    } catch (error) {
        console.log('error in boardOnLoad');
    } finally {
        document.querySelector('.spinner-overlay').style.display = "none";
    }
}

async function renderAllTasks() {
    document.querySelector('.spinner-overlay').style.display = "flex";
    try {
        renderTasks('tasksContainer-0', 'board/toDo/', 'To Do');
        renderTasks('tasksContainer-1', 'board/InProgress/', 'In Progress');
        renderTasks('tasksContainer-2', 'board/awaitFeedback/', 'Await Feedback');
        renderTasks('tasksContainer-3', 'board/done/', 'Done');

    } catch (error) {
        console.log('error in renderAllTasks()');
    } finally {
        document.querySelector('.spinner-overlay').style.display = "none";
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
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        container.innerHTML += taskTemplate(task);
        updateProgressBar(task);
    }
}

function focusedSearchContainer() {
    const container = document.querySelector('.search-container');
    container.style.border = '1px solid rgb(42 170 226)';
}

function bluredSearchContainer() {
    const container = document.querySelector('.search-container');
    container.style.border = '1px solid black';
}

function hoveredAddTaskIcon(element) {
    const icon = document.getElementsByClassName('new-board-task')[element];
    icon.src = '../img/hovered_add_task.png';
}

function normalAddTaskIcon(element) {
    const icon = document.getElementsByClassName('new-board-task')[element];
    icon.src = '../img/add_task_in_board.png';
}

function closeTaskOverlay() {
    const overlay = document.getElementById('createTaskInBoardOverlay');
    overlay.style.display = 'none';
}

function openTaskOverlay(column) {
    currOverlay = 'boardAddTaskOverlay';
    if (window.innerWidth < 700) {
        window.location.href = '../templates/add_task.html';
    } else {
        const overlay = document.getElementById('createTaskInBoardOverlay');
        overlay.style.display = 'flex';
        renderTaskDialog();
        resetPriorityBtn();
        currentColumn = column;
    }
    fetchContacts();
}

function renderTaskDialog() {
    const infoOverlay = document.getElementById('taskInfoOverlay');
    const overlay = document.getElementById('createTaskInBoardOverlay');
    infoOverlay.innerHTML = '';
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
           return '';
    }
}

function renderPriorityIcon(task) {
    switch (task.priority) {
        case 'urgent':
            return `../img/urgent_priority.png`;
        case 'low':
            return `../img/low_priority.png`;
        default: 
            return `../img/medium_priority.png`;       
    }
}

function renderSubtasksAmount(task) {
    const subtasks = task.subtasks;
    const amount =  subtasks ? Object.keys(subtasks).length : 0;
    return amount;
}

function renderInitials(task) {
    const contacts = Object.values(task.contacts || {});
    return contacts.map(contact => `
      <div class="contact-initial" style="background-image: url('${contact.bg}'); background-size: cover; background-position: center;">
        ${contact.initial}
      </div>`).join('');
}

window.onresize = function handlePageRedirect() {
    const overlay = document.getElementById('createTaskInBoardOverlay');
    const isOVerlayOpen = overlay && overlay.style.display !== 'none';
    if (isOVerlayOpen && window.innerWidth < 700) {
        window.location.href = '../templates/add_task.html';
    }
}

async function createTaskInBoardFireBase() {
    const column = checkTargetColumn();
    console.log(column);
    if (!extractTaskValues()) {
        alert('chosen date is not in the future!');
        return;
      };
      const dataSafe = taskDataStorage();
      if (!restrictAddingTask()) {
      return; 
    } else {
        postData('board/' + column, dataSafe);
        console.log('board/' + column, dataSafe);
        taskId += 1;
        localStorage.setItem('taskId',taskId.toString());
        emptyTaskDocument();
        closeTaskOverlay();
        await renderAllTasks();
    }
}

function checkTargetColumn() {
    switch (currentColumn) {
        case 0:
            return 'toDo/';
        case 1:
            return 'InProgress/';
        case 2:
            return 'awaitFeedback/';
        default: 'toDo/';
            break;
    }
}

function closeTaskInfoOverlay() {
    const overlay = document.getElementById('taskInfoOverlay');
    overlay.classList.remove('active');
    renderAllTasks();
}

function openTaskInfoOverlay(task) {
    currOverlay = 'editOverlay';

    const overlay = document.getElementById('taskInfoOverlay');
    overlay.classList.add('active');
    renderDetailedTask(task);
}

function toggleDeleteBtn(event) {
    const img = event.target;
    if (event.type === 'mouseover') {
        img.src = '../img/delete_task_hovered.png';
    } else if (event.type === 'mouseout') {
        img.src = '../img/delete_task.png';
    }
}

function toggleEditBtn(event) {
    const overlay = document.getElementById('taskInfoOverlay');
    const boardAddTask = document.getElementById('overlayDialogBoard');
    const img = event.target;
    if (event.type === 'mouseover') {
        img.src = '../img/edit_task_hovered.png';
    } else if (event.type === 'mouseout') {
        img.src = '../img/edit_task.png';
    } else if ('click') {
        currOverlay = 'editOverlay';
        overlay.innerHTML = '';
        boardAddTask.innerHTML = '';
        overlay.innerHTML = editTaskTemplate();

    }
}

function renderDetailedTask(task) {
    const overlay = document.getElementById('taskInfoOverlay');
    overlay.innerHTML = taskDetailTemplate(task);
    currTask = task;
}

function encodeTask(task) {
    return JSON.stringify(task).replace(/"/g, '&quot;');
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;

}

function capitalize(word) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function loopTaskContacts(task) {
    let templateHTML = '';
    const contacts = task.contacts;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        templateHTML += `<div class="task-overlay-contact"> <div style="background-image: url('${contact.bg}')" class="initial">${contact.initial}</div> <p>${contact.name}</p> </div>`;
    }
    return templateHTML;
}

function loopTaskSubtasks(task) {
    let templateHTML = '';
    if (!task.subtasks || typeof task.subtasks !== 'object') return '';
    if (Object.entries(task.subtasks).length === 0) return '';

    for (const [subtaskKey, subtask] of Object.entries(task.subtasks)) {
        const { src, className } = renderCurrSubtaskState(subtask);
        templateHTML += `
            <div class="overlay-subtask-template">
                <img class="subtask-icon ${className}" 
                    onclick="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    onmouseover="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    onmouseout="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    id="subtaskIcon-${subtaskKey}" 
                    src="${src}">
                <p id="subtaskText-${subtaskKey}">${subtask.title}</p>
            </div>`;
    }
    return templateHTML;
}

function renderCurrSubtaskState(subtask) {
        if (subtask.state === true) {
            return {src: `../img/checkbox_checked_unhovered.png`,
                className: 'chosen',
            };
        } else {
            return {src: `../img/checkbox_unchecked_unhovered.png`,
                className: '',
            };
        }
        
    }

function toggleMobileTaskAddBtn(event) {
    const img = event.target;
    const hoverSrc = `../img/mobile_add_task_hovered.png`;
    const basicSrc = `../img/mobile_add_task_btn.png`;
    img.src = event.type === 'mouseover' ? hoverSrc : basicSrc;
}

function searchTasks() {
    const tasks = document.querySelectorAll('.task-body');
    const input = document.getElementById('searchTasksInput').value.toLowerCase();

    for (let i = 0; i < tasks.length; i++) {
        const title = tasks[i].querySelector('.task-title').innerText.toLowerCase();
        if (title.includes(input)) {
            tasks[i].style.display = 'flex';
        } else {
            tasks[i].style.display = 'none';
        }
    }
}


function updateSubtaskIcon(isHovered = false, icon, subtaskKey) {
    const chosen = icon.classList.contains('chosen');

    if (chosen) {
        icon.src = isHovered
        ? '../img/checkbox_checked_hovered.png'
        : '../img/checkbox_checked_unhovered.png';
        
    } else {
        icon.src = isHovered
        ? '../img/checkbox_unchecked_hovered.png'
        : '../img/checkbox_unchecked_unhovered.png';
    }
    findChosenSubtasks(subtaskKey, icon);
   // adjustIconStateInArray(subtaskKey, icon);
}

function toggleSubtaskIcon(event, icon, subtaskKey) {
    switch (event.type) {
        case 'click':
            icon.classList.toggle('chosen');
            updateSubtaskIcon(true, icon, subtaskKey);
            break;
        case 'mouseover':
            updateSubtaskIcon(true, icon, subtaskKey);
            break;
        case 'mouseout':
            updateSubtaskIcon(false, icon, subtaskKey);
            break;
        default:
            updateSubtaskIcon(false, icon, subtaskKey);
            break;
    }
}

async function findChosenSubtasks(subtaskKey, icon) {
    if (!icon) return;

    const board = await getData('board/');

    for (const [columnKey, tasks] of Object.entries(board)) {
        for (const [taskKey, oneTask] of Object.entries(tasks)) {
            if (oneTask.id === currTask.id) {
                let isChosen = icon.classList.contains('chosen');
                const data = await putData(`board/${columnKey}/${taskKey}/subtasks/${subtaskKey}/state`, isChosen);
            }
        }
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