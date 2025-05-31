function restrictAddingTask() {
  const title = document.getElementById("taskTitle");
  const date = document.getElementById("taskDate");
  if (chosenContacts.length === 0 || !title.value || !date.value) {
    alert("title, date and contacts are required!");
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
  const title = document.getElementById("taskTitle");
  const titleValue = title.value;
  const description = document.getElementById("description");
  const descriptionValue = description.value;
  const date = document.getElementById("taskDate");
  const dateValue = date.value;
  if (isNotInTheFuture(dateValue)) {
    return false;
  } else {
    return { titleValue, descriptionValue, dateValue };
  }
}

function checkChosenColummn(columnNum) {
  switch (columnNum) {
    case "0":
      return "toDo";
    case "1":
      return "InProgress";
    case "2":
      return "awaitFeedback";
    case "3":
      return "done";
    default:
      return "toDo";
  }
}

function clearBtnToBlue() {
    document.getElementById("clearBtn").src = "../img/clear_btn_hovered.png";
  }
  
  function clearBtnToBlack() {
    document.getElementById("clearBtn").src = "../img/close.png";
  }