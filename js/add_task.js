function clearBtnToBlue() {
  document.getElementById("clearBtn").src = "../img/clear_btn_hovered.png";
}

function clearBtnToBlack() {
  document.getElementById("clearBtn").src = "../img/close.png";
}

function setActivePriority(button, color) {
  document.querySelectorAll(".priority-button").forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "";
    btn.style.color = "";
  });
  button.classList.add("active");
  button.style.backgroundColor = color;
  button.style.color = "white";

  changePriorityBtnColor(button);
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

function changePriorityBtnColor(button) {
  const svg = button.nextElementSibling;

  if (button.classList.contains('active')) {
    svg.setAttribute('fill', 'white');
  } else {
    svg.setAttribute('fill', 'auto');
  }
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
  const outputDiv = document.getElementById('subtaskContainer');

  outputDiv.innerHTML += `                    
                    <div id="subtaskTemplate" class="subtask-template">
                      <div class="subtask-title">
                        <p>•</p>
                        <span>Trial subtask</span>
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
}
