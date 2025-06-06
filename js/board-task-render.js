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


function renderContacts(contacts) {
  let templateHTML = "";
  if (!contacts) return templateHTML;
  contacts.forEach((contact) => {
    templateHTML += `<div class="contact-initial" style="background-image: url('${contact.bg}'); background-size: cover; background-position: center;">
          ${contact.initial}
      </div>`;
  });
  return templateHTML;
}