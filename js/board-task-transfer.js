async function handleTaskTransfer(task, column) {
  document.querySelector(".spinner-overlay").style.display = "flex";
  try {
    await iterateForTaskTransfer(task, column);
  } catch (error) {
    console.log("error in handleTaskTransfer()");
  } finally {
    document.querySelector(".spinner-overlay").style.display = "none";
  }
}


async function iterateForTaskTransfer(task, column) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === task.id) {
        await postData(`board/${column}`, task);
        await deleteData(`board/${columnKey}/${taskKey}`);
      }
    }
  }
}


async function moveMobileTasks(direction, task, event, element) {
  event.stopPropagation();
  const currColumnName = await checkCurrColumnName(task.id);
  const nextColumn = await checkNextColumnName(task.id, currColumnName);
  const prevColumn = await checkPrevColumnName(task.id, currColumnName);
  switch (direction) {
    case "forward":
      handleForwardCase(nextColumn, element, task);
      break;
    case "back":
      handleBackCase(prevColumn, element, task);
      break;
  }
}


async function handleForwardCase(nextColumn, element, task) {
  if (nextColumn === "done") {
    element.classList.add("disabled");
    await handleTaskTransfer(task, nextColumn);
  } else {
    await handleTaskTransfer(task, nextColumn);
  }
  await renderAllTasks();
}


async function handleBackCase(prevColumn, element, task) {
  if (prevColumn === "toDo") {
    element.classList.add("disabled");
    await handleTaskTransfer(task, prevColumn);
  } else {
    await handleTaskTransfer(task, prevColumn);
  }
  await renderAllTasks();
}


async function checkCurrColumnName(id) {
  const board = await getData("board/");
  for (const [columnKey, tasks] of Object.entries(board)) {
    for (const [taskKey, oneTask] of Object.entries(tasks)) {
      if (oneTask.id === id) {
        return `${columnKey}`;
      }
    }
  }
}


async function disableMoveBtns(course, path) {
  const toDos = await getData(path);
  if (!toDos) return;
  for (const task of Object.values(toDos)) {
    const taskBody = document.getElementById(`taskBody${task.id}`);
    if (taskBody) {
      const btn = taskBody.querySelector(course);
      if (btn) {
        btn.classList.add("disabled");
      }
    }
  }
}


async function checkNextColumnName(id, currColumnName) {
  const order = ["toDo", "InProgress", "awaitFeedback", "done"];
  const currColumnIndex = order.indexOf(currColumnName);
  const nextColumnName = order[currColumnIndex + 1];
  return nextColumnName;
}


async function checkPrevColumnName(id, currColumnName) {
  const order = ["toDo", "InProgress", "awaitFeedback", "done"];
  const currColumnIndex = order.indexOf(currColumnName);
  const prevColumnName = order[currColumnIndex - 1];
  return prevColumnName;
}