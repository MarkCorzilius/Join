let isMobileLayout = false;
let draggedTaskNum = 0;
let dragStartX = 0;
let dragStartY = 0;
let currentX = 0;
let currentY = 0;
let rotation = 0;
let wasDropped = false;

function allowDrop(ev) {
    ev.preventDefault();
}


function startDragging(id, ev) {
    checkIfMobileLayout();
    if (isMobileLayout) {
        ev.preventDefault();
        return;
    };
    prepareDraggedTask(id, ev);

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMXB4IiBoZWlnaHQ9IjFweCI+PC9zdmc+'; // 1x1 transparent SVG
    ev.dataTransfer.setDragImage(img, 0, 0);

}

function prepareDraggedTask(id, ev) {
    const task = document.getElementById(`taskBody${id}`);
    draggedTaskNum = id;
    dragStartX = ev.clientX;
    dragStartY = ev.clientY;
    wasDropped = false;
    task.style.position = 'absolute';
    task.style.zIndex = '1000';
    task.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    task.style.transform = 'scale(1.1)';
    setTimeout(() => {
        task.style.pointerEvents = 'none';
    }, 100);
}

function dragMove(id, ev) {
    checkIfMobileLayout();
    if (isMobileLayout) return;
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
    checkIfMobileLayout();
    if (isMobileLayout) return;
    const task = document.getElementById(`taskBody${id}`);
    task.style.position = 'static';
    task.style.zIndex = '';
    task.style.pointerEvents = 'none';
    task.style.boxShadow = '';
    task.style.transform = '';
    rotation = 0;
    dragStartX = 0;
    dragStartY = 0;
    currentX = 0;
    currentY = 0;
}

function moveElementTo(ev, containerEl) {
    checkIfMobileLayout();
    if (isMobileLayout) return;
    ev.preventDefault();
    wasDropped = true;
    stopDragging(draggedTaskNum);
    moveTaskFireBase(containerEl, draggedTaskNum);
}

async function moveTaskFireBase(containerEl, draggedTaskNum) {
    const board = await getData('board/');
    for (const [columnKey, tasks] of Object.entries(board)) {
        if (typeof tasks !== 'object' || tasks === null) continue;
        for (const [taskKey, task] of Object.entries(tasks)) {
            if (task.id === draggedTaskNum) {
                const newColumn = checkNewColumn(containerEl.id);
                await postData(`board/${newColumn}`, task);
                await deleteData(`board/${columnKey}/${taskKey}`);
                await renderAllTasks();
                return;
            }
        }
    }
}

function checkNewColumn(container) {
    console.log(container);
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
    checkIfMobileLayout();
    if (isMobileLayout) return;
    const task = document.getElementById(`taskBody${id}`);
    task.style.position = 'static';
    if (!wasDropped) {
        console.warn('Task was dropped outside valid area');
        renderAllTasks();
    }
}

function checkIfMobileLayout() {
    isMobileLayout = window.innerWidth <= 1350;
    const tasks = document.querySelectorAll('.task-body');
    tasks.forEach(task => {
        task.setAttribute('draggable', isMobileLayout ? 'false' : 'true');
    });
  }