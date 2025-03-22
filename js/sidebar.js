function buttonClicked(element) {
  const buttons = document.querySelectorAll(".nav-button");
  buttons.forEach((btn) => btn.classList.remove("clicked-color"));
  element.classList.add("clicked-color");
}
