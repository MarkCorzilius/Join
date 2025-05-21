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

function loopTaskContacts(task, user) {
    let templateHTML = '';
    if (user) {
        templateHTML += `
        <div class="task-overlay-contact">
            <div style="background-image: url('${user.icon.bg}')" class="initial">${user.icon.initial}</div>
            <p>${user.name}</p>
        </div>`;
    }

    const contacts = task.contacts;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (contact === null) continue;
        templateHTML += `<div class="task-overlay-contact"> <div style="background-image: url('${contact.bg}')" class="initial">${contact.initial}</div> <p>${contact.name}</p> </div>`;
    }
    return templateHTML;
}

function loopTaskSubtasks(task) {
    if (!task.subtasks || typeof task.subtasks !== 'object') return '';
    if (Object.entries(task.subtasks).length === 0) return '';

    return handleLoopingSubtasks(task);
}

function handleLoopingSubtasks(task) {
    let templateHTML = '';
    for (const [subtaskKey, subtask] of Object.entries(task.subtasks)) {
        const { src, className } = renderCurrSubtaskState(subtask);
        templateHTML += subtasksTemplate(subtaskKey, className, src, subtask);
    }
    return templateHTML;
}

function subtasksTemplate(subtaskKey, className, src, subtask) {
    return `
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

  async function handleTaskTransfer(task, column) {
    document.querySelector('.spinner-overlay').style.display = "flex";
    try {
        await iterateForTaskTransfer(task, column);
    } catch (error) {
        console.log('error in handleTaskTransfer()');
    } finally {
        document.querySelector('.spinner-overlay').style.display = "none";
    }
  }

  async function iterateForTaskTransfer(task, column) {
    const board = await getData('board/');
    for (const [columnKey, tasks] of Object.entries(board)) {
        for (const [taskKey, oneTask] of Object.entries(tasks)) {
            if (oneTask.id === task.id) {
                await postData(`board/${column}`, task);
                await deleteData(`board/${columnKey}/${taskKey}`);
            }
        }
    } 
  }

  async function moveMobileTasks(direction, task, event, element) {
    event.stopPropagation();
    const currColumnName = await checkCurrColumnName(task.id);
    const nextColumn = await checkNextColumnName(task.id, currColumnName);
    const prevColumn = await checkPrevColumnName(task.id, currColumnName);
    
    switch (direction) {
        case 'forward':
            handleForwardCase(nextColumn, element, task);
           break;
        case 'back':
            handleBackCase(prevColumn, element, task);
            break;
  }
}

async function handleForwardCase(nextColumn, element, task) {
    if (nextColumn === 'done') {
        element.classList.add('disabled');
        await handleTaskTransfer(task, nextColumn);
        renderAllTasks();
    } else {
        await handleTaskTransfer(task, nextColumn);
        renderAllTasks();
    }
}

async function handleBackCase(prevColumn, element, task) {
    if (prevColumn === 'toDo') {
        element.classList.add('disabled');
        await handleTaskTransfer(task, prevColumn);
        renderAllTasks();
    } else {
        await handleTaskTransfer(task, prevColumn);
        renderAllTasks();
    }
}

  async function checkCurrColumnName(id) {
    const board = await getData('board/');
    for (const [columnKey, tasks] of Object.entries(board)) {
        for (const [taskKey, oneTask] of Object.entries(tasks)) {
            if (oneTask.id === id) {
                return `${columnKey}`;
            }
        }
    }
  }

  async function disableMoveBtns(course, path) {
    const toDos = await getData(path);
    if (!toDos) return ;
    for (const task of Object.values(toDos)) {
        const taskBody = document.getElementById(`taskBody${task.id}`)
        if (taskBody) {
            const btn = taskBody.querySelector(course);
            if (btn) {
              btn.classList.add('disabled');
            }
          }
    }
  }

  async function checkNextColumnName(id, currColumnName) {
    const order = ['toDo', 'InProgress', 'awaitFeedback', 'done'];
    const currColumnIndex = order.indexOf(currColumnName);
    const nextColumnName = order[currColumnIndex + 1];
    return nextColumnName;
  }

  async function checkPrevColumnName(id, currColumnName) {
    const order = ['toDo', 'InProgress', 'awaitFeedback', 'done'];
    const currColumnIndex = order.indexOf(currColumnName);
    const prevColumnName = order[currColumnIndex - 1];
    return prevColumnName;
  }
