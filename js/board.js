
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
    overlay.innerHTML += taksDialogTemplate();
}