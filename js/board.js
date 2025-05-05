let currentColumn = 0;

async function boardOnLoad() {
    document.querySelector('.spinner-overlay').style.display = "flex";
    try {
        taskId = Number(localStorage.getItem('taskId')) || 0;
        w3.includeHTML(); 
        renderTaskDialog(); 

        await renderAllTasks();
    } catch (error) {
        console.log('error in boardOnLoad');
    } finally {
        document.querySelector('.spinner-overlay').style.display = "none";
    }
}

async function renderAllTasks() {
    document.querySelector('.spinner-overlay').style.display = "flex";
    try {
        await renderToDoTasks();
        await renderTasksInProgress();
        await renderTasksAwaitFeedback();
        await renderTasksDone();
    } catch (error) {
        console.log('error in renderAllTasks()');
    } finally {
        document.querySelector('.spinner-overlay').style.display = "none";
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
    if (window.innerWidth < 700) {
        window.location.href = '../templates/add_task.html';
    } else {
        const overlay = document.getElementById('createTaskInBoardOverlay');
        overlay.style.display = 'flex';
        currentColumn = column;
    }
    fetchContacts();
}

function renderTaskDialog() {
    const overlay = document.getElementById('createTaskInBoardOverlay');
    overlay.innerHTML = "";
    overlay.innerHTML += tasksDialogTemplate();
}

async function renderTasksInProgress() {
    const container = document.getElementById('tasksContainer-1');
    container.innerHTML = "";
    const rawTasks = await getData('board/InProgress/');
    const tasks = rawTasks ? Object.values(rawTasks) : [];
    if (tasks.length === 0) {
        container.innerHTML = emptyColumnTemplate('In Progress');
        return;
    }
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        container.innerHTML += taskTemplate(task);
    }
}

async function renderTasksDone() {
    const container = document.getElementById('tasksContainer-3');
    container.innerHTML = '';
    const rawTasks = await getData('board/done/');
    const tasks = rawTasks ? Object.values(rawTasks) : [];
    if (tasks.length === 0) {
        container.innerHTML = emptyColumnTemplate('no tasks done');
        return;
    }
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        container.innerHTML += taskTemplate(task);
    }
}

async function renderTasksAwaitFeedback() {
    const container = document.getElementById('tasksContainer-2');
    container.innerHTML = '';
    const rawTasks = await getData('board/awaitFeedback/');
    const tasks = rawTasks ? Object.values(rawTasks) : [];
    if (tasks.length === 0) {
        container.innerHTML = emptyColumnTemplate('Await Feedback');
        return;
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        container.innerHTML += taskTemplate(task);
    }
}

async function renderToDoTasks() {
    const rawTasks = await getData('board/toDo/');
    const container = document.getElementById('tasksContainer-0');
    container.innerHTML = "";
    const tasks = Object.values(rawTasks ?? {});
    if (tasks.length === 0) {
        container.innerHTML = emptyColumnTemplate('To Do');
        return;
    }
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];   
        container.innerHTML += taskTemplate(task);
    }
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
    if (!extractTaskValues()) {
        alert('chosen date is not in the future!');
        return;
      };
      const dataSafe = taskDataStorage();
      if (!restrictAddingTask()) {
      return; 
    } else {
        postData('board/' + column, dataSafe);
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
}

function openTaskInfoOverlay(task) {
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
    const img = event.target;
    if (event.type === 'mouseover') {
        img.src = '../img/edit_task_hovered.png';
    } else if (event.type === 'mouseout') {
        img.src = '../img/edit_task.png';
    }
}

function renderDetailedTask(task) {
    const overlay = document.getElementById('taskInfoOverlay');
    overlay.innerHTML = '';
    overlay.innerHTML = taskDetailTemplate(task);
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
    let subtaskNum = 0;
    let templateHTML = '';
    if (!task.subtasks || typeof task.subtasks !== 'object') return;

    const subtasks = Object.values(task.subtasks);
    if (subtasks.length === 0) return;
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        templateHTML += `<div class="overlay-subtask-template"><img onclick="toggleSubtaskIcon(event, this)" onmouseover="toggleSubtaskIcon(event, this)" onmouseout="toggleSubtaskIcon(event, this)" id="subtaskIcon${subtaskNum}" src="../img/checkbox_unchecked_unhovered.png"><p>${subtask.title}</p></div>`;
        subtaskNum += 1;
    }
    return templateHTML;
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

function updateSubtaskIcon(isHovered = false, icon) {
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
}

function toggleSubtaskIcon(event, icon) {
    console.log('event.target is: ', event.target);
    console.log('icon is: ', icon);
    switch (event.type) {
        case 'click':
            icon.classList.toggle('chosen');
            updateSubtaskIcon(true, icon);
            break;
        case 'mouseover':
            updateSubtaskIcon(true, icon);
        break;
        case 'mouseout':
            updateSubtaskIcon(false, icon);
        break;
        default: updateSubtaskIcon(false, icon);
            break;
    }
}