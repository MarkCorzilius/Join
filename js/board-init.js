let disabled = false;
let currentColumn = 0;
let searching = false;
const contactsOffset = 2;
let contactsStart = 0; 


/**
 * Initializes the board UI when the page loads.
 * Shows a spinner overlay during loading.
 * Calls functions to set up page structure, prepare the environment, and load tasks.
 * Hides the spinner overlay after loading or on error.
 */
async function boardOnLoad() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await initializePageStructure();
    await prepareBoardEnvironment();
    await loadBoardTasks();
  } catch (error) {
    console.log("error in boardOnLoad:", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Initializes the page structure by including external HTML components using w3.includeHTML.
 * Waits asynchronously until both the sidebar (#sidebar) and header (#header) elements are loaded into the DOM.
 * Resolves the promise once both elements are found, allowing subsequent code to run safely.
 */
async function initializePageStructure() {
  w3.includeHTML();
  const waitForInclude = () =>
    new Promise((resolve) => {
      const checkExist = setInterval(() => {
        const sidebarLoaded = document.querySelector("#sidebar");
        const headerLoaded = document.querySelector("#header");
        if (sidebarLoaded && headerLoaded) {
          clearInterval(checkExist);
          resolve();
        }
      }, 50);
    });
  await waitForInclude();
}


/**
 * Prepares the board environment by initializing necessary UI states and data.
 * - Marks the current page in the navigation or UI.
 * - Shows dropdown help if the user is a guest.
 * - Adjusts the UI or data based on the initial login state.
 * - Ensures the first ID for tasks and contacts is set in the backend/storage.
 * - Displays the legal notice and privacy policy.
 * 
 * This function is asynchronous because it awaits the completion of setting initial IDs.
 */
async function prepareBoardEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  await putFirstIdForTasksAndContacts("taskId")
  displayLegalNoticeAndPrivacyPolicy();
}


/**
 * Loads all tasks onto the board and sets up related UI behavior.
 * - Renders all tasks from the data source.
 * - Checks if any contacts exist and adjusts the UI accordingly.
 * - Adjusts help overlays or hints specifically for mobile devices.
 * - Adds a window resize event listener to re-adjust mobile help on viewport changes.
 * - Checks and sets draggable task behavior based on the current viewport width.
 * 
 * This function is asynchronous because it awaits the rendering and contact checks.
 */
async function loadBoardTasks() {
  await renderAllTasks();
  await checkContactsExistance();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
  checkIfMobileLayout();
}


/**
 * Renders all task columns on the board and manages UI elements accordingly.
 * 
 * This function performs the following asynchronously:
 * - Shows a loading spinner overlay while rendering.
 * - Renders tasks for each column by calling renderTasks with the container ID, data path, and empty message.
 * - Disables "move task up" buttons in the first column and "move task down" buttons in the last column to prevent invalid moves.
 * - Hides the spinner overlay once rendering completes or if an error occurs.
 * - Catches and logs any errors during the rendering process.
 */
async function renderAllTasks() {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await renderTasks("tasksContainer-0", "board/toDo/", "No tasks To Do");
    await renderTasks("tasksContainer-1", "board/InProgress/", "No tasks In Progress");
    await renderTasks("tasksContainer-2", "board/awaitFeedback/", "No tasks Await Feedback");
    await renderTasks("tasksContainer-3", "board/done/", "No tasks Done");
    await disableMoveBtns(".move-task-up", "board/toDo/");
    await disableMoveBtns(".move-task-down", "board/done/");
  } catch (error) {
    console.log("error in renderAllTasks()", error);
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


/**
 * Renders tasks inside a specified container element.
 * 
 * @param {string} id - The DOM element ID of the container to render tasks into.
 * @param {string} path - The data path in the database to fetch tasks from.
 * @param {string} emptyMessage - Message to display if no tasks are found.
 * 
 * This function performs the following:
 * - Clears the container's current content.
 * - Fetches raw tasks data from the given path.
 * - Converts raw task objects into an array.
 * - If no tasks exist, displays an empty column message.
 * - Otherwise, fetches contact data.
 * - Calls visualizeTasks to render each task with the associated contacts.
 */
async function renderTasks(id, path, emptyMessage) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  const rawTasks = await getData(path);
  const tasks = rawTasks ? Object.values(rawTasks) : [];
  if (tasks.length === 0) {
    container.innerHTML = emptyColumnTemplate(emptyMessage);
    return;
  }
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  await visualizeTasks(tasks, firebaseContactsArray, container);
}


/**
 * Renders a list of tasks into a specified container element.
 * 
 * @param {Array<Object>} tasks - Array of task objects to render.
 * @param {HTMLElement} container - The DOM element where tasks will be appended.
 * 
 * This function iterates through the tasks, renders each task's initials asynchronously,
 * appends the rendered task HTML to the container, and updates UI elements such as
 * contacts bubble and progress bar for each task.
 */
async function renderTasksToContainer(tasks, container) {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const initialsHTML = await renderInitials(task);
      container.innerHTML += taskTemplate(task, initialsHTML);
      showContactsBubble(task.contacts, task.id);
      updateProgressBar(task);
    }
  }

  
  /**
 * Cleans tasks by removing any contacts that no longer exist, then renders the tasks into the given container.
 * 
 * @param {Array<Object>} tasks - Array of task objects to visualize.
 * @param {Array<Object>} firebaseContactsArray - Array of contact objects fetched from Firebase.
 * @param {HTMLElement} container - The DOM element where tasks should be rendered.
 * 
 * This function first removes invalid contacts from each task, then renders the tasks inside the container.
 */
async function visualizeTasks(tasks, firebaseContactsArray, container) {
    cleanTaskContacts(tasks, firebaseContactsArray);
    await renderTasksToContainer(tasks, container);
  }