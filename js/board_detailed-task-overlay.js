let currentId = 0;

async function deleteTaskInOverlay(currentTask) {
    const board = await getData('board/');

    for (const [columnKey, tasks] of Object.entries(board)) {
        for (const [taskKey, task] of Object.entries(tasks)) {
            if (task.id === currentTask.id) {
                await deleteData(`board/${columnKey}/${taskKey}`);
                closeTaskInfoOverlay();
                await renderAllTasks();
                return;
            }
        }
    }
}

function openTaskEditStateInOverlay(task) {
    const overlay = document.getElementById('taskInfoOverlay');
    overlay.innerHTML = '';
    overlay.innerHTML = editStateOverlayTemplate(task);

}

function allowDrop(ev) {
    ev.preventDefault();
}

let dragStartX = 0;
let dragStartY = 0;
let currentX = 0;
let currentY = 0;
let rotation = 0;


function startDragging(id, ev) {
    const task = document.getElementById(`taskBody${id}`);
    currentId = id;
    dragStartX = ev.clientX;
    dragStartY = ev.clientY;

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMXB4IiBoZWlnaHQ9IjFweCI+PC9zdmc+'; // 1x1 transparent SVG
    ev.dataTransfer.setDragImage(img, 0, 0);

}

function dragMove(id, ev) {
    const task = document.getElementById(`taskBody${id}`);
    currentX = ev.clientX;
    currentY = ev.clientY;

    const deltaX = currentX - dragStartX;
    const deltaY = currentY - dragStartY;

    decideRotation();

    task.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
}

function decideRotation() {
    if (currentX > dragStartX) {
        rotation = 30;
    } else {
        rotation = -30;
    }
}

function stopDragging(id) {
    const task = document.getElementById(`taskBody${id}`);

    rotation = 0;
    dragStartX = 0;
    dragStartY = 0;
    currentX = 0;
    currentY = 0;
}

function moveElementTo(ev, containerId) {
    ev.preventDefault();
    droppedInZone = true;
    stopDragging(containerId);
    moveTaskFireBase(containerId, currentId);
}

async function moveTaskFireBase(containerId, currentId) {
    const board = await getData('board/');
    for (const [columnKey, tasks] of Object.entries(board)) {
        if (typeof tasks !== 'object' || tasks === null) continue;
        for (const [taskKey, task] of Object.entries(tasks)) {
            if (task.id === currentId) {
                const newColumn = checkNewColumn(containerId);
                await postData(`board/${newColumn}`, task);
                await deleteData(`board/${columnKey}/${taskKey}`);
                await renderAllTasks();
                return;
            }
        }
    }
}

function checkNewColumn(container) {
    switch (container) {
        case 'tasksContainer-0':
            return 'toDo/';
        case 'tasksContainer-1':
            return 'InProgress/';
        case 'tasksContainer-2':
            return 'awaitFeedback/';
        case 'tasksContainer-3': 
            return 'done/';
        default: 
            return 'toDo/';

    }
}

function endDragging(id, ev) {
    const task = document.getElementById(`taskBody${id}`);
    task.style.position = 'static';
}