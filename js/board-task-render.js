function renderTaskDialog() {
  const infoOverlay = document.getElementById("taskInfoOverlay");
  const overlay = document.getElementById("createTaskInBoardOverlay");
  infoOverlay.innerHTML = "";
  overlay.innerHTML = "";
  overlay.innerHTML += tasksDialogTemplate();
}


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


function renderSubtasksAmount(task) {
  const subtasks = task.subtasks;
  const amount = subtasks ? Object.keys(subtasks).length : 0;
  return amount;
}


async function renderInitials(task) {
  const firebaseContacts = await getData("contacts/");
  const firebaseContactsArray = Object.values(firebaseContacts || {});
  const taskContacts = Object.values(task.contacts || {});
  const contactsHTML = await checkContactsInitials(taskContacts, firebaseContactsArray);
  return contactsHTML;
}

const contactsOffset = 2;
let contactsStart = 0; 

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