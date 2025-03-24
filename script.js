window.onload = function () {
  w3.includeHTML();
};

const allPages = [
  '<div class="included-page-div" w3-include-html="./templates/summary.html"></div>',
  '<div class="included-page-div" w3-include-html="./templates/add_task.html"></div>',
  '<div class="included-page-div" w3-include-html="./templates/board.html"></div>',
  '<div class="included-page-div" w3-include-html="./templates/contacts.html"></div>',
  '<div class="included-page-div" w3-include-html="./templates/privacy_policy.html"></div>',
  '<div class="included-page-div" w3-include-html="./templates/legal_notice.html"></div>',
];

function renderPages(page) {
  const contentRef = document.getElementById("content");
  contentRef.innerHTML = "";

  contentRef.innerHTML = allPages[page];

  w3.includeHTML();
}
