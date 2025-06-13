/**
 * Renders the task creation dialog by clearing both the task info overlay
 * and the create task overlay, then inserting the task dialog template.
 */
function renderTaskDialog() {
  const infoOverlay = document.getElementById("taskInfoOverlay");
  const overlay = document.getElementById("createTaskInBoardOverlay");
  infoOverlay.innerHTML = "";
  overlay.innerHTML = "";
  overlay.innerHTML += tasksDialogTemplate();
}


/**
 * Returns an HTML string with an icon image based on the task's category.
 *
 * @param {Object} task - The task object containing a `category` property.
 * @returns {string} HTML string for the category icon, or an empty string if no match.
 */
function renderCategory(task) {
  switch (task.category) {
    case "User Story":
      return `<img src="../img/user-story.png">`;
    case "Technical Task":
      return `<img src="../img/technical-task.png">`;
    default:
      return "";
  }
}


/**
 * Returns the file path to the priority icon image based on the task's priority level.
 *
 * @param {Object} task - The task object containing a `priority` property.
 * @returns {string} The path to the corresponding priority icon image.
 */
function renderPriorityIcon(task) {
  switch (task.priority) {
    case "urgent":
      return `../img/urgent_priority.png`;
    case "low":
      return `../img/low_priority.png`;
    default:
      return `../img/medium_priority.png`;
  }
}


/**
 * Calculates and returns the number of subtasks in a given task.
 *
 * @param {Object} task - The task object containing a `subtasks` property.
 * @returns {number} The count of subtasks, or 0 if none exist.
 */
function renderSubtasksAmount(task) {
  const subtasks = task.subtasks;
  const amount = subtasks ? Object.keys(subtasks).length : 0;
  return amount;
}


/**
 * Renders HTML for contact initials related to a task.
 * @param {Object} task - The task object containing contact references.
 * @returns {Promise<string>} - HTML string of rendered contact initials.
 */
async function renderInitials(task) {
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  const taskContacts = Object.values(task.contacts || {});
  const contactsHTML = await checkContactsInitials(taskContacts, firebaseContactsArray);
  return contactsHTML;
}


/**
 * Renders HTML for a subset of contact initials with background images.
 * @param {Array} contacts - Array of contact objects with `initial` and `bg` properties.
 * @returns {string} - HTML string of contact elements.
 */
function renderContacts(contacts) {
  let templateHTML = "";
  if (!contacts) return templateHTML;
  const end = Math.min((contactsStart + contactsOffset), contacts.length);
  for (let i = 0; i < end; i++) {
    const contact = contacts[i];
    templateHTML += `<div class="contact-initial" style="background-image: url('${contact.bg}'); background-size: cover; background-position: center;">
    ${contact.initial}
</div>`;
  }
  return templateHTML;
}


/**
 * Displays a bubble indicating the number of remaining contacts not shown.
 * @param {Array} contacts - Array of contact objects.
 * @param {string|number} id - Unique identifier for the task or container element.
 */
function showContactsBubble(contacts, id) {
  if (!contacts || !id) return;
  const container = document.getElementById(`contactsAssigned${id}`);
  const contactsLeft = contacts.length - (contactsStart + contactsOffset);
  const remainingCount = Math.max(contactsLeft, 0);
  const existingBubble = container.querySelector('#moreContactsBubble');
  if (existingBubble) {
    existingBubble.remove();
  }
  if (remainingCount > 0) {
    container.insertAdjacentHTML('beforeend', generateMoreContactsBubble(remainingCount, 'board-task-bubble'));
  }
}