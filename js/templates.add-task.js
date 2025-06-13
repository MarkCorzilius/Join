/**
 * Generates an HTML string for a contact option in the contact dropdown.
 * @param {string} name - Full name of the contact.
 * @param {string} bg - Background image URL for the contact's initial.
 * @param {string} initial - Initials of the contact.
 * @param {number} contactId - Unique ID of the contact.
 * @returns {string} HTML string for rendering the contact option.
 */
function contactsTemplate(name, bg, initial, contactId) {
  return `<div onclick="styleChosenContact(this, '${initial}', '${bg}', '${name}', ${contactId})" class="option contact-line">
                    <div>
                    <div class="initial" style="background-image:url('${bg}')" alt="profile icon">${initial}</div>
                    <span class="contact-name">${name}</span>
                    </div>
                    <svg class="select-box unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                      </svg>
                    <svg class="select-box checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 12L12 16L20 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                  </div>`;
}


/**
 * Generates HTML for the selected contacts' profile bubble.
 * @param {string} bg - Background image URL.
 * @param {string} initial - Initials of the contact.
 * @returns {string} HTML for the contact's visual bubble.
 */
function generateBgAndInitialForChosenContactsBox(bg, initial) {
  return `
        <div class="initial" style="background-image:url('${bg}')">
            ${initial}
        </div>
    `;
}


/**
 * Returns HTML for a subtask, including both view and edit states.
 * @param {number} subtaskId - Unique ID of the subtask.
 * @param {string} valueRef - The display text of the subtask.
 * @param {string} subtaskClass - CSS class name to apply for styling/edit state.
 * @returns {string} HTML string for the subtask element.
 */
function subtaskTemplate(subtaskId, valueRef, subtaskClass) {
  return `                    
                                            <div class="template-subtask" id="subtaskTemplate${subtaskId}">
                          <div class="form-subtask-template task-active-state" id="taskNormalState${subtaskId}">
                           <div class="subtask-title">
                             <p>•</p>
                             <span id="subtaskTitle${subtaskId}" class="subtask-titles">${valueRef}</span>
                           </div>
                           <div class="control-subtask">
                             <div class="subtask-edit-icons">
                             <img onclick="editTask(${subtaskId})" src="../img/subtask_pencil.png" alt="edit">
                             <div class="subtask-separator"></div>
                             <img onclick="deleteTask(${subtaskId})" src="../img/subtask_trash.png" alt="delete">
                             </div>
                           </div>
                          </div>
    
                        <div class="task-active-state task-edit-state" id="taskEditState${subtaskId}" style="display: none;">
                          <div class="subtask-template-edit-state ${subtaskClass} subtask-edit-state" class="form-subtask-edit-input-wrapper">
                            <input onkeydown="postSubtaskOnEnter(event, ${subtaskId})" id="subtaskEditInput${subtaskId}" class="form-subtask-edit-input ${subtaskClass}" type="text">
                            <div class="subtask-icons-on-edit">
                              <div onclick="deleteSubtaskEditState(${subtaskId})" id="deleteSubtaskEditState${subtaskId}" class="subtask-icon-wrapper">
                              <img src="../img/subtask_trash.png" alt="delete">
                              </div>
                              <div class="subtask-separator"></div>
                              <div onclick="updateTask(${subtaskId})" class="subtask-icon-wrapper">
                              <img src="../img/subtask_edit_confirm.png" alt="confirm">
                              </div>
                              </div>
                          </div>
                        </div>
                      </div>`;
}


/**
 * Generates an HTML message when no contacts exist.
 * @returns {string} HTML string with "no contacts" message.
 */
function getNoContactsTemplate() {
  return `
    <p class="no-contacts-exist-message">No contacts existing. Create some contacts.</p>
  `;
}


/**
 * Generates an HTML message when a search returns no matching contacts.
 * @returns {string} HTML string with "no contacts found" message.
 */
function noContactsFoundTemplate() {
  return `
    <p id="noContactsFoundMessage" class="no-contacts-exist-message">No contacts found.</p>
  `;
}


/**
 * Returns HTML for the "More Contacts" button to load additional contacts.
 * @returns {string} HTML string for the button.
 */
function moreContactsBtnTemplate() {
  return `
    <div class="more-contacts-container" id="moreContactsContainer">
      <button onclick="renderNextChunk(document.getElementById('contactOptions'))" class="more-contacts-button" id="moreContactsButton">More Contacts</button>
    </div>
  `;
}


/**
 * Returns HTML for a bubble that shows how many more contacts are hidden.
 * @param {number} remainingCount - Number of remaining contacts not shown.
 * @param {string} currentClass - CSS class for bubble styling.
 * @returns {string} HTML string for the "+N" contacts bubble.
 */
function generateMoreContactsBubble(remainingCount, currentClass) {
  return `
    <div onclick="showMoreChosenContacts()" id="moreContactsBubble" class="${currentClass}">
      +${remainingCount}
    </div>
  `;
}