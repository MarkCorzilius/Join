

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
    const addTaskOverlay = document.getElementById('createTaskInBoardOverlay');
    const overlay = document.getElementById('taskInfoOverlay');
    addTaskOverlay.innerHTML = '';
    overlay.innerHTML = '';
    overlay.innerHTML = editTaskTemplate(task);
    renderTaskDetails(task);
    fetchContacts();

}

function renderTaskDetails(task) {
    const title = document.getElementById('taskTitle');
    const description = document.getElementById('description');
    const date = document.getElementById('taskDate');
    title.value = task.title;
    description.value = task.description;
    date.value = task.date;
}

function handleOkBtnEvents() {
    
}

