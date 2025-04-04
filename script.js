function renderSideBar() {
  const containerRef = document.getElementById("sidebarContainer");
  containerRef.innerHTML = "";

  containerRef.innerHTML = sideBarTemplate();
}

function renderHeader() {
  const containerRef = document.getElementById("headerContainer");
  containerRef.innerHTML = "";

  containerRef.innerHTML = headerTemplate();
}

function sideBarTemplate() {
  return `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <img src="../img/join-logo-white.svg" alt="Join Logo" />
  </div>
  <div class="sidebar-button">
    <a href="../templates/summary.html">
      <button class="nav-button">
        <img src="../img/sidebar_summary.png" alt="summary" />
        <p>Summary</p>
      </button></a
    >
    <a href="../templates/add_task.html">
      <button class="nav-button">
        <img src="../img/add_task_sidebar.png" alt="tasks" />
        <p>Add Task</p>
      </button></a
    >
    <a href="../templates/board.html">
      <button class="nav-button">
        <img src="../img/sidebar_board.png" alt="board" />
        <p>Board</p>
      </button></a
    >


    <a href="../templates/contacts.html">
      <button class="nav-button" onclick="setTimeout(renderContacts, 300)">
        <img src="../img/sidebar_contact.png" alt="contacts" />
        <p>Contacts</p>
      </button></a
    >
  </div>

  <div class="sidebar-footer">
    <a href="../templates/privacy_policy.html"> <button class="nav-button">Privacy Policy</button></a>
    <a href="../templates/legal_notice.html"> <button class="nav-button">Legal Notice</button></a>
  </div>
</aside>
`;
}

function headerTemplate() {
  return `
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <!-- <img src="../img/join-logo.svg" alt="Join Logo" class="header-logo"> -->
        <h1 class="header-title">Kanban Project Management Tool</h1>
      </div>
      <div class="header-right">
        <a href="../templates/help.html"><img id="helpIcon" class="help-icon" src="../img/help.png" alt="Go to help onclick="hideHelpIcon()"></a>
        <div class="user-initials">SM</div>
      </div>
    </div>
  </header>
`;
}
