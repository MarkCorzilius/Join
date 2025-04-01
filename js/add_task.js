function clearBtnToBlue() {
  document.getElementById("clearBtn").src = "./img/clear_btn_hovered.png";
}

function clearBtnToBlack() {
  document.getElementById("clearBtn").src = "./img/close.png";
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
}

function renderContactsToAssignment() {
  const containerRef = document.getElementById("assignContactsBox");
  containerRef.innerHTML = "";

  contactsArray.forEach((contact) => {
    containerRef.innerHTML += `hello ${contact.name}`;
  });
}
