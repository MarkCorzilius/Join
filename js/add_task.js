function clearBtnToBlue() {
  document.getElementById("clearBtn").src = "../img/clear_btn_hovered.png";
}

function clearBtnToBlack() {
  document.getElementById("clearBtn").src = "../img/close.png";
}

function setActivePriority(button, color, id) {
  document.querySelectorAll(".priority-button").forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "";
    btn.style.color = "";
  });
  button.classList.add("active");
  button.style.backgroundColor = color;
  button.style.color = "white";

  changePriorityBtnColor(id); 
}

function changePriorityBtnColor(id) {
  const svgRef = document.querySelectorAll('.priority-icon');
  for (let i = 0; i < svgRef.length; i++) {
    const icon = svgRef[i];
    icon.classList.remove('clicked-priority-color');

    if (icon.classList.contains(`priority-icon-${id}`)) {
      icon.classList.add('clicked-priority-color');
    }
    
  }
}

function resetPriorityBtn() {
  const inactiveBtns = [document.getElementsByClassName('priority-button')[0], document.getElementsByClassName('priority-button')[2]];
  const medium = document.getElementsByClassName('priority-button')[1];

  inactiveBtns.forEach(btn => {
    btn.style.backgroundColor = 'white';
    btn.style.color = 'black';
  });
  medium.classList.add('active');
  medium.style.backgroundColor = 'rgb(255, 168, 1)';
  medium.style.color = 'white';
  changePriorityBtnColor(1);
}

function styleChosenContact(element) {
  element.classList.toggle('selected-contact');

  const checked = element.querySelector('.checked')
  const unchecked = element.querySelector('.unchecked')

  if (element.classList.contains('selected-contact')) {
    checked.style.display ='inline';
    unchecked.style.display = 'none';
  } else {
    checked.style.display ='none';
    unchecked.style.display = 'inline';
  }
}

function openContactAssignmentInput() {
  const closedRef = document.getElementById('closedState');
  const searchState = document.getElementById('searchState');
  const optionsRef = document.getElementById('contactOptions');
  const wrapperRef = document.querySelector('.dropdown-wrapper');

  closedRef.style.display = 'none';
  searchState.style.display = 'flex';
  optionsRef.style.display = 'flex';
  wrapperRef.style.marginBottom = '210px';
}

function closeContactAssignment() {
  const closedRef = document.getElementById('closedState');
  const searchRef = document.getElementById('searchState');
  const optionsRef = document.getElementById('contactOptions');
  const wrapperRef = document.querySelector('.dropdown-wrapper');
  

  closedRef.style.display = 'flex';
  searchRef.style.display = 'none';
  optionsRef.style.display = 'none';
  wrapperRef.style.marginBottom = '0';
}

function toggleCategoryOptions() {
  const arrow = document.getElementById('categoryArrow');
  const section = document.querySelector('.category-section');
  const optionsRef = document.querySelector('.category-options');
  optionsRef.style.display = optionsRef.style.display === 'flex' ? 'none' : 'flex';

  if (optionsRef.style.display === 'flex') {
    section.style.marginBottom = '100px';
    arrow.src = '../img/dropdown-arrow-up.png';
    document.getElementById('categoryChoiceInsert').innerText = 'Select task category';
  } else {
    section.style.marginBottom = 'auto';
    arrow.src = '../img/dropdown-arrow-down.png';
  }
}

function chooseCategory(option) {
  const containerRef = document.getElementById('categoryChoiceInsert');
  const choice = option.innerText;

  containerRef.innerText = '';
  containerRef.innerText = choice;

  toggleCategoryOptions();
}

function showActionBtns() {
  const focusBtns = document.getElementById('focusBtns');
  const mainBtn = document.getElementById('subtaskMainBtn');

  mainBtn.style.display = 'none';
  focusBtns.style.display = 'flex';

}

function showMainBtn() {
  const focusBtns = document.getElementById('focusBtns');
  const mainBtn = document.getElementById('subtaskMainBtn');

  mainBtn.style.display = 'flex';
  focusBtns.style.display = 'none';
}

function addSubtask() {
  const valueRef = document.getElementById('subtaskInput').value;
  const input = document.getElementById('subtaskInput');
  const outputDiv = document.getElementById('subtaskContainer');

  outputDiv.innerHTML += `                    
                    <div id="subtaskTemplate" class="subtask-template">
                      <div class="subtask-title">
                        <p>•</p>
                        <span class="subtask-titles">${valueRef}</span>
                      </div>
                      <div class="control-subtask">
                        <div id="subtaskNormalState">
                        <img src="../img/subtask_pencil.png" alt="edit">
                        <div class="subtask-separator"></div>
                        <img src="../img/subtask_trash.png" alt="delete">
                        </div>
                        <div id="subtaskEditState" style="display: none;">
                          <div class="subtask-icon-wrapper">
                          <img src="../img/subtask_trash.png" alt="delete">
                          </div>
                          <div class="subtask-separator"></div>
                          <div class="subtask-icon-wrapper">
                          <img src="../img/subtask_edit_confirm.png" alt="confirm">
                          </div>
                        </div>
                      </div>
                    </div>`;

  document.getElementById('subtaskInput').value = '';

  showMainBtn();
  scrollToCreatedSubtask();
  setTimeout(() => {
    input.focus();
  }, 0);
  
}

function scrollToCreatedSubtask() {
  const container = document.getElementById('subtaskContainer');
  container.scrollTop = container.scrollHeight;
}

function emptyTaskDocument() {
  const title = document.querySelector('.title-field');
  const description = document.querySelector('.description-area');
  const date = document.querySelector('.due-date-field');
  const subtaskInput = document.getElementById('subtaskInput');

  title.value = '';
  description.value = '';
  date.value = '';
  subtaskInput.value = '';
  resetPriorityBtn();
  resetCategory();
  resetSubtasks();
  
}

function resetCategory() {
  document.getElementById('categoryChoiceInsert').innerText = 'Select task category';
}

function resetSubtasks() {
  const subtasks = document.getElementById('subtaskContainer');
  subtasks.innerHTML = '';
}

function checkShift(event) {
  if (event.key === 'Enter') {
    addSubtask();
  }
}