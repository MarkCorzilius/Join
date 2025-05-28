let subtaskId = null;
let chosenContacts = [];

async function taskPageOnLoad() {
  w3.includeHTML();
  try {
    await waitForSidebarAndHeader();
    setupTaskPageEnvironment();
    loadTaskPageData();
  } catch (error) {
    console.log("error in taskPageOnLoad()");
  }
}

function waitForSidebarAndHeader() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      const sidebarLoaded = document.querySelector("#sidebar");
      const headerLoaded = document.querySelector("#header");
      if (sidebarLoaded && headerLoaded) {
        clearInterval(checkExist);
        resolve();
      }
    }, 50);
  });
}

function setupTaskPageEnvironment() {
  markCurrentPage();
  ifGuestShowDropdownHelp();
  adjustInitialAfterLogin();
  taskId = Number(localStorage.getItem("taskId")) || 0;
}

function loadTaskPageData() {
  resetPriorityBtn();
  fetchContacts("contactOptions");
  findUserEmail();
  adjustHelpForMobile();
  window.addEventListener("resize", adjustHelpForMobile);
}

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
  const svgRef = document.querySelectorAll(".priority-icon");
  for (let i = 0; i < svgRef.length; i++) {
    const icon = svgRef[i];
    icon.classList.remove("clicked-priority-color");
    if (icon.classList.contains(`priority-icon-${id}`)) {
      icon.classList.add("clicked-priority-color");
    }
  }
}

function resetPriorityBtn() {
  const inactiveBtns = [document.getElementsByClassName("priority-button")[0], document.getElementsByClassName("priority-button")[2]];
  const medium = document.getElementsByClassName("priority-button")[1];
  inactiveBtns.forEach((btn) => {
    btn.style.backgroundColor = "white";
    btn.style.color = "black";
  });
  medium.classList.add("active");
  medium.style.backgroundColor = "rgb(255, 168, 1)";
  medium.style.color = "white";
  changePriorityBtnColor(1);
}

function resetContactCheckedBtn() {
  const selections = document.querySelectorAll(".select-box");
  const checked = document.querySelectorAll(".checked");
  const unchecked = document.querySelectorAll(".unchecked");

  for (let i = 0; i < checked.length; i++) {
    const check = checked[i];
    check.style.display = "none";
  }
  for (let i = 0; i < unchecked.length; i++) {
    const uncheck = unchecked[i];
    uncheck.style.display = "inline";
  }
}

function resetContacts() {
  const options = document.querySelectorAll(".option");
  const checked = document.querySelector(".checked");
  const unchecked = document.querySelector(".unchecked");

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    helpResetContacts(option, checked, unchecked);
  }
  chosenContacts = [];
  visualizeChosenContacts();
  closeContactAssignment();
}

function helpResetContacts(option, checked, unchecked) {
  if (option.classList.contains("selected-contact")) {
    option.classList.remove("selected-contact");
    resetContactCheckedBtn();
    checked.style.display = "none";
    unchecked.style.display = "inline";
  }
}

function styleChosenContact(element, initial, bg, name, contactId) {
  element.classList.toggle("selected-contact");
  const checked = element.querySelector(".checked");
  const unchecked = element.querySelector(".unchecked");

  if (element.classList.contains("selected-contact")) {
    runIfSelected(checked, unchecked, initial, bg, name, contactId);
  } else {
    runIfNotSelected(checked, unchecked, initial, bg, name, contactId);
  }
}

function runIfSelected(checked, unchecked, initial, bg, name, contactId) {
  checked.style.display = "inline";
  unchecked.style.display = "none";
  addContactToArray(initial, bg, name, contactId);
  visualizeChosenContacts();
}

function runIfNotSelected(checked, unchecked, initial, bg, name, contactId) {
  checked.style.display = "none";
  unchecked.style.display = "inline";
  deleteContactFromArray(initial, bg, name);
  visualizeChosenContacts();
}

function visualizeChosenContacts() {
  const container = document.getElementById("chosenContactsBox");
  container.innerHTML = "";
  for (let i = 0; i < chosenContacts.length; i++) {
    const contact = chosenContacts[i];
    container.innerHTML += generateBgAndInitialForChosenContactsBox(contact.bg, contact.initial);
  }
}

function addContactToArray(initial, bg, name, contactId) {
  chosenContacts.push({
    name: showNameWithoutYou(name),
    initial: initial,
    bg: bg,
    id: contactId,
  });
}

function deleteContactFromArray(initial, bg, name) {
  const index = chosenContacts.findIndex((contact) => contact.initial === initial && contact.bg === bg && contact.name === name.replace("(You)", "").trim());
  if (index != -1) {
    chosenContacts.splice(index, 1);
  }
}

function searchForContacts() {
  const input = document.getElementById("searchContacts").value.toLowerCase();
  const contacts = document.querySelectorAll(".option");
  for (let i = 0; i < contacts.length; i++) {
    const name = contacts[i].querySelector(".contact-name").innerText.toLowerCase();
    if (name.includes(input)) {
      contacts[i].style.display = "flex";
    } else {
      contacts[i].style.display = "none";
    }
  }
}

function openContactAssignmentInput() {
  const closedRef = document.getElementById("closedState");
  const searchState = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const wrapperRef = document.querySelector(".dropdown-wrapper");
  const container = document.getElementById("chosenContactsBox");

  handleContactAssignment(closedRef, searchState, optionsRef, wrapperRef, container);
}

function handleContactAssignment(closedRef, searchState, optionsRef, wrapperRef, container) {
  closedRef.style.display = "none";
  searchState.style.display = "flex";
  optionsRef.style.display = "flex";
  wrapperRef.style.marginBottom = "210px";
  container.style.display = "none";
  if (window.innerWidth <= 1000) {
    document.querySelector(".content").style.overflow = "hidden";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function(event) {
    const box = document.getElementById("dropdownBox");
    const searchState = document.getElementById("searchState");
    const optionsRef = document.getElementById("contactOptions");
    if (!box) return;
    const isSearchOpen = searchState && searchState.style.display === 'flex';
    const isOptionsOpen = optionsRef && optionsRef.style.display === 'flex';
    if (!isSearchOpen && !isOptionsOpen) return;
    if (!box.contains(event.target)) {
      closeContactAssignment();
    }
  });
});

function closeContactAssignment() {
  const closedRef = document.getElementById("closedState");
  const searchRef = document.getElementById("searchState");
  const optionsRef = document.getElementById("contactOptions");
  const wrapperRef = document.querySelector(".dropdown-wrapper");
  const container = document.getElementById("chosenContactsBox");

  closedRef.style.display = "flex";
  searchRef.style.display = "none";
  optionsRef.style.display = "none";
  wrapperRef.style.marginBottom = "0";
  container.style.display = "flex";
  document.querySelector(".content").style.overflow = "auto";
}
