let isMobileLayout = false;
let draggedTaskNum = 0;
let dragStartX = 0;
let dragStartY = 0;
let currentX = 0;
let currentY = 0;
let rotation = 0;
let wasDropped = false;


/**
 * Allows an element to be a drop target by preventing the default handling
 * of the dragover event.
 * 
 * @param {DragEvent} ev - The drag event triggered when dragging over the target.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Initiates the dragging process for a task element, sets a transparent drag image,
 * and prevents dragging on mobile layout.
 * 
 * @param {string} id - The ID of the task being dragged.
 * @param {DragEvent} ev - The drag event triggered when dragging starts.
 */
function startDragging(id, ev) {
  checkIfMobileLayout();
  if (isMobileLayout) {
    ev.preventDefault();
    return;
  }
  prepareDraggedTask(id, ev);

  const img = new Image();
  img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMXB4IiBoZWlnaHQ9IjFweCI+PC9zdmc+"; // 1x1 transparent SVG
  ev.dataTransfer.setDragImage(img, 0, 0);
}


/**
 * Prepares a task element visually and internally for dragging.
 * Sets styles to indicate dragging and records initial drag coordinates.
 * 
 * @param {string|number} id - The unique identifier of the task being dragged.
 * @param {DragEvent} ev - The drag event associated with the drag start.
 */
function prepareDraggedTask(id, ev) {
  const task = document.getElementById(`taskBody${id}`);
  draggedTaskNum = id;
  dragStartX = ev.pageX;
  dragStartY = ev.pageY;
  wasDropped = false;
  task.style.position = "absolute";
  task.style.zIndex = "1000";
  task.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  task.style.transform = "scale(1.1)";
  setTimeout(() => {
    task.style.pointerEvents = "none";
  }, 100);
}


/**
 * Handles the movement of a dragged task element, updating its position and rotation.
 * Does nothing if the layout is detected as mobile.
 * 
 * @param {string|number} id - The unique identifier of the task being dragged.
 * @param {DragEvent} ev - The drag event containing current pointer coordinates.
 */
function dragMove(id, ev) {
  checkIfMobileLayout();
  if (isMobileLayout) return;
  const task = document.getElementById(`taskBody${id}`);
  currentX = ev.pageX;
  currentY = ev.pageY;
  const deltaX = currentX - dragStartX;
  const deltaY = currentY - dragStartY;
  decideRotation();
  task.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
}


/**
 * Determines the rotation angle of the dragged task based on horizontal drag direction.
 * Sets the global `rotation` variable to 30 degrees if dragged right, otherwise -30 degrees.
 */
function decideRotation() {
  if (currentX > dragStartX) {
    rotation = 30;
  } else {
    rotation = -30;
  }
}


/**
 * Stops the dragging of a task and resets its styles and drag-related variables.
 * Does nothing if in mobile layout.
 * 
 * @param {number|string} id - The ID of the task being dragged.
 */
function stopDragging(id) {
  checkIfMobileLayout();
  if (isMobileLayout) return;
  const task = document.getElementById(`taskBody${id}`);
  task.style.position = "static";
  task.style.zIndex = "";
  task.style.pointerEvents = "none";
  task.style.boxShadow = "";
  task.style.transform = "";
  task.style.pointerEvents = "auto";
  rotation = 0;
  dragStartX = 0;
  dragStartY = 0;
  currentX = 0;
  currentY = 0;
}

/**
 * Moves a dragged task element to a new container on drop event.
 * Prevents default behavior, stops dragging styles, marks drop as done,
 * and updates task location in Firebase.
 * Does nothing if in mobile layout.
 * 
 * @param {DragEvent} ev - The drop event.
 * @param {HTMLElement} containerEl - The container element where the task is dropped.
 */
function moveElementTo(ev, containerEl) {
  checkIfMobileLayout();
  if (isMobileLayout) return;
  ev.preventDefault();
  wasDropped = true;
  stopDragging(draggedTaskNum);
  moveTaskFireBase(containerEl, draggedTaskNum);
}


/**
 * Moves a task in the Firebase board data structure from its current column
 * to a new column based on the drop container element.
 * It fetches the board data, finds the task by its id, posts the task
 * to the new column, deletes it from the old column, and re-renders all tasks.
 * 
 * @param {HTMLElement} containerEl - The container element representing the new column.
 * @param {number} draggedTaskNum - The ID of the task being moved.
 * @returns {Promise<void>}
 */
async function moveTaskFireBase(containerEl, draggedTaskNum) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    if (typeof tasks !== "object" || tasks === null) continue;
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


/**
 * Maps a container element ID to its corresponding task column name.
 *
 * @param {string} container - The ID of the container element.
 * @returns {string} - The name of the task column in the backend.
 */
function checkNewColumn(container) {
  switch (container) {
    case "tasksContainer-0":
      return "toDo/";
    case "tasksContainer-1":
      return "InProgress/";
    case "tasksContainer-2":
      return "awaitFeedback/";
    case "tasksContainer-3":
      return "done/";
    default:
      return "toDo/";
  }
}


/**
 * Ends the drag operation for a task element.
 * Resets the task's style and checks if the task was dropped correctly.
 * If not dropped in a valid area, logs a warning and re-renders all tasks.
 *
 * @param {number|string} id - The ID of the dragged task.
 * @param {DragEvent} ev - The drag event object.
 */
function endDragging(id, ev) {
  checkIfMobileLayout();
  if (isMobileLayout) return;
  const task = document.getElementById(`taskBody${id}`);
  task.style.position = "static";
  task.style.pointerEvents = "auto";
  if (!wasDropped) {
    console.warn("Task was dropped outside valid area");
    renderAllTasks();
  }
}


/**
 * Checks if the current viewport width qualifies as a mobile layout.
 * Sets the global `isMobileLayout` flag accordingly.
 * Updates all elements with class "task-body" to be draggable only if not mobile.
 */
function checkIfMobileLayout() {
  isMobileLayout = window.innerWidth <= 1350;
  const tasks = document.querySelectorAll(".task-body");
  tasks.forEach((task) => {
    task.setAttribute("draggable", isMobileLayout ? "false" : "true");
  });
}