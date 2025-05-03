

function restrictAddingTask() {
  const title = document.getElementById('taskTitle');
  const date = document.getElementById('taskDate');
  
  if (chosenContacts === "" || !title.value || !date.value) {
    alert('title, date and contacts are required!');
    return false;
  } else {
    return true;
  }
}

function isNotInTheFuture(inputDate) {
  const currentDate = new Date();
  const inputDateObject = new Date(inputDate);

  if (currentDate > inputDateObject) {
    return true;
  } else {
    return false;
  }
}

function extractTaskValues() {
  const title = document.getElementById('taskTitle');
  const titleValue = title.value;
  const description = document.getElementById('description');
  const descriptionValue = description.value;
  const date = document.getElementById('taskDate');
  const dateValue = date.value;
  if (isNotInTheFuture(dateValue)) {
    return false;
  } else {
    return { titleValue, descriptionValue, dateValue};
 }
}

function taskDataStorage() {
  const {titleValue, descriptionValue, dateValue} =  extractTaskValues();
  const dataSafe = {
    id: taskId,
    title: titleValue,
    description: descriptionValue,
    date: dateValue,
    priority: saveActivePriority(),
    contacts: chosenContacts,
    category: saveCategory(),
    subtasks: saveSubtasks(),
  }
  return dataSafe;
}

function getTaskData() {
  if (!extractTaskValues()) {
    alert('chosen date is not in the future!');
    return;
  };
  const dataSafe = taskDataStorage();
  if (!restrictAddingTask()) {
  return; 
} else {
  postData('board/toDo/', dataSafe);
  taskId += 1;
  localStorage.setItem('taskId',taskId.toString());
  emptyTaskDocument();
}
}

function saveActivePriority() {
  const priorities = document.querySelectorAll('.priority-button');
  const active = Array.from(priorities).find(btn => btn.classList.contains('active'));
  const priority = active ? ['medium', 'urgent', 'low'].find(p => active.classList.contains(p)) : null;
  return priority;
}

function saveCategory() {
  const containerRef = document.getElementById('categoryChoiceInsert');
  if (containerRef.innerText !== 'Select task category') {
    const category = containerRef.innerText;
    return category;
  } else {
    const category = null;
    return category;
  }
}

function saveSubtasks() {
  const subtaskContainer = document.getElementById('subtaskContainer');
  const subtaskTitles = document.querySelectorAll('.subtask-titles');

  if (!subtaskContainer) return null;

  const subtasks = {};

  for (let i = 0; i < subtaskTitles.length; i++) {
    const titleText = subtaskTitles[i].innerText.trim();
    if (titleText !== '') {
      subtasks[`subtask-${i + 1}`] = {title: titleText, state: false}
    }
  }
  return Object.keys(subtasks).length > 0 ? subtasks : null; 
  }


  async function fetchContacts() {
    let contactsContainer = document.getElementById('contactOptions');
    contactsContainer.innerHTML = '';
    let response = await fetch(BASE_URL + 'contacts/' + '.json');
    let contacts = await response.json();

    for (const contact of Object.values(contacts)) {
      const sanitizedEmail = sanitizeEmail(contact.email);
      const currentIcon = await getData('contacts/' + sanitizedEmail + '/icon');
      contactsContainer.innerHTML += contactsTemplate(contact.name, currentIcon.bg, currentIcon.initial);
    }
  }

  function contactsTemplate(name, bg, initial) {
    return `<div onclick="styleChosenContact(this, '${initial}', '${bg}', '${name}')" class="option">
                    <div>
                    <div class="initial" style="background-image:url('${bg}')" alt="profile icon">${initial}</div>
                    <span class="contact-name">${showUser(name)}</span>
                    </div>
                    <svg class="select-box unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                      </svg>
                    <svg class="select-box checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 12L12 16L20 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                  </div>`;
  }

  const currentUser = JSON.parse(localStorage.getItem('user'));
  let userEmail = null;

  function showUser(name) {
    const email = findUserEmail();
    if (currentUser.name === 'Guest') {
      return name;
    }
    if (currentUser.name === name && currentUser.email === userEmail) {
      return name + ' (You)';
    } else {
      return name;
    }
  }

  async function findUserEmail() {
    const contacts = await getData('contacts/');
    for (const contact of Object.values(contacts)) {
      if (contact.email === currentUser.email) {
        userEmail = contact.email;
      }
    }
  }

  function sanitizeEmail(email) {
    return email.replace(/[@.]/g, "_");
}