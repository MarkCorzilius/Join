
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

function openTaskOverlay() {
    const overlay = document.getElementById('createTaskInBoardOverlay');
    overlay.style.display = 'flex';
}

function renderTaskDialog() {
    const overlay = document.getElementById('createTaskInBoardOverlay');
    overlay.innerHTML = "";
    overlay.innerHTML += tasksDialogTemplate();
}



async function fetchTasks() {
    const tasks = await getData('tasks/');
    const existingTasks = await getData('board/toDo/');
    const existingValues = existingTasks ? Object.values(existingTasks) : [];

    for (const task of Object.values(tasks)) {
        const alreadyExists = existingValues.some(existing => JSON.stringify(existing) === JSON.stringify(task));
        if (!alreadyExists) {
            await postData('board/toDo/', task);
        }
    }
}

async function renderToDoTasks() {
    const rawTasks = await getData('board/toDo/');
    const container = document.getElementById('tasksContainer');
    container.innerHTML = "";
    const tasks = Object.values(rawTasks);

    if (tasks.length == 0) {
        container.innerHTML = emptyColumnTemplate();
        return;
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];   
        container.innerHTML += toDoTemplate(task);
    }
}

function renderCategory(task) {
    switch (task.category) {
        case 'User Story':
           return `<img src="../img/user-story.png">`; 
        case 'Technical Task':
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