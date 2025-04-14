const BASE_URL = 'https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(path="", data={}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

function extractTaskValues() {
  const title = document.getElementById('taskTitle');
  const titleValue = title.value;
  const description = document.getElementById('description');
  const descriptionValue = description.value;
  const date = document.getElementById('taskDate');
  const dateValue = date.value;

  return { titleValue, descriptionValue, dateValue};
}

function getTaskData() {
  const {titleValue, descriptionValue, dateValue} =  extractTaskValues();

  const dataSafe = {
    title: titleValue,
    description: descriptionValue,
    date: dateValue,
    priority: saveActivePriority(),
    category: saveCategory(),
    subtasks: saveSubtasks(),
  }

  postData('tasks', dataSafe);
  emptyTaskDocument();
}

function saveActivePriority() {
  const priorities = document.querySelectorAll('.priority-button');
  const active = Array.from(priorities).find(btn => btn.classList.contains('active'));
  const priority = active ? ['medium', 'urgent', 'low'].find(p => active.classList.contains(p)) : null;
  return priority;
}

/* CREATE saveChosenContacts() function */

function saveCategory() {
  const containerRef = document.getElementById('categoryChoiceInsert');
  if (!containerRef.innerText == 'Select task category') {
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
  if (!subtaskContainer == null) {
    for (let i = 0; i < subtaskTitles.length; i++) {
      const subtaskTitle = subtaskTitles[i];
      subtasks += subtaskTitle;
    }
    const subtasks = {}
    return subtasks;
  } else {
    return null;
  }
}