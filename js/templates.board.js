﻿/**
 * Returns HTML for an empty column message.
 * @param {string} text - The message to display.
 * @returns {string} HTML string
 */
function emptyColumnTemplate(text) {
  return `                <div class="empty-column">
                  <span>${text}</span>
                </div>`;
}


/**
 * Returns HTML for an empty search result message.
 * @param {string} text - The message to display.
 * @returns {string} HTML string
 */
function emptySearchColumnTemplate(text) {
  return `                <div class="empty-search">
                  <span>${text}</span>
                </div>`;
}


/**
 * Returns HTML for a single task card.
 * @param {Object} task - Task object with details.
 * @param {string} initialsHTML - HTML string of assigned contacts.
 * @returns {string} HTML string
 */
function taskTemplate(task, initialsHTML) {
  return `                <div id="taskBody${task.id}" class="task-body" draggable="true" ondragstart="startDragging(${task.id}, event)" ondrag="dragMove(${task.id
    }, event)" ondragend="endDragging(${task.id}, event)" onclick="openTaskInfoOverlay(${encodeTask(task)})">
                  <div class="task-category">${renderCategory(task)}</div>
                  <h3 class="task-title">${task.title}</h2>
                    <p class="task-description">${task.description}</p>
                    <div id="progressSection${task.id}" class="progress-section">
                      <div class="progress-container">
                       <div class="progress-bar" id="progressBar${task.id}"></div>
                      </div>
                      <span class="tasks-done"> ${renderSubtasksDone(task)}/${renderSubtasksAmount(task)} Subtasks</span>
                    </div>
                    <div class="user-task-footer">
                      <div id="contactsAssigned${task.id}" class="contacts-assigned">${initialsHTML}</div>
                      <img class='priority-png' src="${renderPriorityIcon(task)}">
                    </div>

                    <div class="mobile-switch">
                      <button onclick="moveMobileTasks('back', ${encodeTask(
      task
    )}, event, this)" class="mobile-switch-btn move-task-up" id="moveTaskUp">back</button>
                      <button onclick="moveMobileTasks('forward', ${encodeTask(
      task
    )}, event, this)" class="mobile-switch-btn move-task-down" id="moveTaskDown">forward</button>
                    </div>
                </div>`;
}


/**
 * Returns HTML for task detail overlay.
 * @param {Object} task - Task object with details.
 * @param {Array} user - List of user objects.
 * @returns {string} HTML string
 */
function taskDetailTemplate(task, user) {
  return `     <div id="taskInfoDialog" onclick="event.stopPropagation()">
        <div class="task-overlay-info">
        <div class="task-detail-header">
          <div>${renderCategory(task)}</div>
          <div onclick="closeTaskInfoOverlay()" class="close-btn-wrapper">
            <img class="task-form-close" src="../img/close.png">
          </div>
        </div>
        <div class="details-main">
        <h2 class="detail-task-title">${task.title}</h2>
        <span class="task-overlay-description">${task.description}</span>
        <div class="prio-and-date-section">
        <div class="date-section">
          <span class="greyColor">Due date:</span>
          <p>${formatDate(task.date)}</p>
        </div>
        <div class="prio-section">
          <span class="greyColor">Priority:</span>
          <div class="task-prio">
            <p>${capitalize(task.priority)}</p>
            <img src="${renderPriorityIcon(task)}" alt="">
          </div>
        </div>
        </div>
        <div class="contacts-assignment">
          <span class="assigned-to">Assigned To:</span>
          <div id="contactsContainer">${loopTaskContacts(task, user)}</div>
        </div>
        <div class="task-overlay-subtasks">
          <span class="title-subtask">Subtasks</span>
          <div id="subtasksList">${loopTaskSubtasks(task, user)}</div>
        </div>
        </div>
        </div>
        <div class="task-overlay-control">
          <img onclick="deleteTaskInOverlay(${encodeTask(
    task
  )})" onmouseover="toggleDeleteBtn(event)" onmouseout="toggleDeleteBtn(event)" id="deleteTask" src="../img/delete_task.png" alt="del">
          <img onclick="openTaskEditStateInOverlay(${encodeTask(
    task
  )})" onmouseover="toggleEditBtn(event)" onmouseout="toggleEditBtn(event)" id="editTask" src="../img/edit_task.png" alt="edit">
        </div>
      </div>`;
}


/**
 * Returns HTML for the task creation dialog.
 * @returns {string} HTML string
 */
function tasksDialogTemplate() {
  return `      <div onclick="closeDropdownsIfClickedOutside(event); closeSubtaskInsert(event); event.stopPropagation()" id="overlayDialogBoard">
          <div class="content-in-main">
          <div class="add-task-page-header">
            <h1 class="add-task-page-title">Add Task</h1>
            <div class="task-form-close-wrapper" onclick="closeTaskOverlay()">
             <img class="task-form-close" src="../img/close.png">
            </div>
            </div>
            <div class="question-blocks">
              <div class="task-left-block">
                <div class="title-field-space">
                  <span required class="field-label-required task-subtitle">Title</span>
                  <input onkeydown="blurOnEnter(event)" id="taskTitle" class="form-size task-txt form-border" placeholder="Enter a title" type="text" />
                </div>
                <div class="title-field-space">
                  <span class="field-label task-subtitle" for="description">Description</span>
                  <textarea class="description-area form-border form-description task-txt" id="description" name="description" placeholder="Enter a description"></textarea>
                </div>
                <div class="title-field-space">
                  <span class="field-label-required due-date-title task-subtitle">Due date</span>
                  <input onkeydown="blurOnEnter(event)" id="taskDate" required class="form-size due-date-field form-border task-txt" type="date" />
                </div>
              </div>
              <div class="vertical-line"></div>
              <div class="task-right-block">
                <div class="priority-section">
                  <span class="field-label task-subtitle">Priority</span>
                  <div class="priority-buttons">
                    <button onclick="setActivePriority(this, 'rgb(255, 61, 0)', 0)" class="priority-button form-priority urgent">
                      <p class="task-txt">Urgent</p>
                      <svg class="priority-icon priority-icon-0" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_156_1009)">
                          <path
                            d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                            fill="rgb(255, 61, 0)"
                          />
                          <path
                            d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                            fill="rgb(255, 61, 0)"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_156_1009">
                            <rect width="20" height="14.5098" fill="black" transform="translate(0.355469 0.936768)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button onclick="setActivePriority(this, 'rgb(255, 168, 1)', 1)" class="priority-button form-priority medium">
                      <p class="task-txt">Medium</p>
                      <svg class="priority-icon priority-icon-1" width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_156_1038)">
                          <path
                            d="M19.7596 7.91717H1.95136C1.66071 7.91717 1.38197 7.80087 1.17645 7.59386C0.970928 7.38685 0.855469 7.10608 0.855469 6.81332C0.855469 6.52056 0.970928 6.23979 1.17645 6.03278C1.38197 5.82577 1.66071 5.70947 1.95136 5.70947H19.7596C20.0502 5.70947 20.329 5.82577 20.5345 6.03278C20.74 6.23979 20.8555 6.52056 20.8555 6.81332C20.8555 7.10608 20.74 7.38685 20.5345 7.59386C20.329 7.80087 20.0502 7.91717 19.7596 7.91717Z"
                            fill="rgb(255, 168, 0)"
                          />
                          <path
                            d="M19.7596 2.67388H1.95136C1.66071 2.67388 1.38197 2.55759 1.17645 2.35057C0.970928 2.14356 0.855469 1.86279 0.855469 1.57004C0.855469 1.27728 0.970928 0.996508 1.17645 0.789496C1.38197 0.582485 1.66071 0.466187 1.95136 0.466187L19.7596 0.466187C20.0502 0.466187 20.329 0.582485 20.5345 0.789496C20.74 0.996508 20.8555 1.27728 20.8555 1.57004C20.8555 1.86279 20.74 2.14356 20.5345 2.35057C20.329 2.55759 20.0502 2.67388 19.7596 2.67388Z"
                            fill="rgb(255, 168, 0)"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_156_1038">
                            <rect width="20" height="7.45098" fill="white" transform="translate(0.855469 0.466187)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button onclick="setActivePriority(this, 'rgb(123, 225, 41)', 2)" class="priority-button form-priority low">
                      <p class="task-txt">Low</p>
                      <svg class="priority-icon priority-icon-2" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.3555 9.69779C10.1209 9.69819 9.89234 9.62335 9.70349 9.48427L0.800382 2.91453C0.684543 2.82898 0.586704 2.72146 0.512448 2.59812C0.438193 2.47478 0.388977 2.33803 0.367609 2.19569C0.324455 1.90821 0.397354 1.61537 0.57027 1.3816C0.743187 1.14782 1.00196 0.992265 1.28965 0.949143C1.57734 0.906021 1.8704 0.978866 2.10434 1.15165L10.3555 7.23414L18.6066 1.15165C18.7224 1.0661 18.854 1.00418 18.9938 0.969432C19.1336 0.934685 19.2788 0.927791 19.4213 0.949143C19.5637 0.970495 19.7006 1.01967 19.824 1.09388C19.9474 1.16808 20.055 1.26584 20.1407 1.3816C20.2263 1.49735 20.2883 1.62882 20.323 1.7685C20.3578 1.90818 20.3647 2.05334 20.3433 2.19569C20.322 2.33803 20.2727 2.47478 20.1985 2.59812C20.1242 2.72146 20.0264 2.82898 19.9106 2.91453L11.0075 9.48427C10.8186 9.62335 10.5901 9.69819 10.3555 9.69779Z"
                          fill="rgb(123, 225, 41)"
                        />
                        <path
                          d="M10.3555 15.4463C10.1209 15.4467 9.89234 15.3719 9.70349 15.2328L0.800381 8.66307C0.566436 8.49028 0.410763 8.2317 0.367609 7.94422C0.324455 7.65674 0.397354 7.3639 0.57027 7.13013C0.743187 6.89636 1.00196 6.7408 1.28965 6.69768C1.57734 6.65456 1.8704 6.7274 2.10434 6.90019L10.3555 12.9827L18.6066 6.90019C18.8405 6.7274 19.1336 6.65456 19.4213 6.69768C19.709 6.7408 19.9678 6.89636 20.1407 7.13013C20.3136 7.3639 20.3865 7.65674 20.3433 7.94422C20.3002 8.2317 20.1445 8.49028 19.9106 8.66307L11.0075 15.2328C10.8186 15.3719 10.5901 15.4467 10.3555 15.4463Z"
                          fill="rgb(123, 225, 41)"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="contacts-section">
                <span required class="field-label-required task-subtitle">Assigned to</span>
                <div class="dropdown-wrapper">
                  <div class="assignment-toggle-buttons">
                  <div id="closedState" onclick="openContactAssignmentInput()" class="form-size form-select form-border">
                    <span class="task-txt">Select contacts to assign</span>
                    <div class="dropdown-icon-wrapper">
                      <img class="dropdown-icon" src="../img/dropdown-arrow-down.png" alt="dropdown arrow">
                    </div>
                  </div>
                  <div class="form-size form-contact-search" style="display: none;" id="searchState">
                    <input id="searchContacts" oninput="searchForContacts()" onkeydown="blurOnEnter(event)" type="text">
                    <div onclick="closeContactAssignment()" class="arrow-up-wrapper">
                      <img src="../img/dropdown-arrow-up.png" alt="dropdown arrow">
                    </div>
                  </div>
                  </div>
                  <div id="contactOptions" class="contacts-options">
                  </div>
                  </div>
                  <div id="chosenContactsBox"></div>
                </div>
                <div class="category-section">
                  <span class="field-label task-subtitle" for="description">Category</span>
                  <div class="category-btn-and-options">
                    <div onclick="toggleCategoryOptions()" class="dropdown-btn-category">
                      <button class="form-size form-select form-border">
                        <span id="categoryChoiceInsert" class="task-txt">Select task category</span>
                        <div class="category-dropdown-wrapper">
                        <img id="categoryArrow" src="../img/dropdown-arrow-down.png" alt="dropdown arrow">
                        </div>
                      </button>
                    </div>
                    <div style="display: none;" class="category-options form-category-options">
                      <span onclick="chooseCategory(this)" class="category-option">Technical Task</span>
                      <span onclick="chooseCategory(this)" class="category-option">User Story</span>
                    </div>
                    </div>
                </div>
                <div class="subtask-section">
                <span class="field-label task-subtitle" for="description">Subtask</span>
                <div class="subtask-input-wrapper edit-form-size">
                <input onfocus="showActionBtns()" onkeydown="checkShiftSubtask(event)" class="edit-form-size form-subtask form-border" id="subtaskInput" placeholder="Add new subtask" minlength="1" type="text">
                <div onclick="showActionBtns()" id="subtaskMainBtn" class="subtask-btn-wrapper subtask-main-btn">
                  <img src="../img/add.png" alt="write">
                </div>
                <div id="focusBtns" class="subtask-focus-btns">
                  <div onclick="emptySubtaskInput()" class="subtask-edit-btns subtask-btn-wrapper">
                    <img src="../img/subtask_del.png" alt="del">
                  </div>
                  <div class="subtask-btns-separator"></div>
                  <div onclick="addSubtask()" class="subtask-edit-btns subtask-btn-wrapper">
                    <img src="../img/subtask_add.png" alt="add">
                  </div>
                </div>
                </div>
                <div class="subtask-container" id="subtaskContainer">
                </div>
              </div>
              </div>
            </div>
            <div class="add-task-footer">
              <p class="requirement-warning task-txt">This field is required</p>
              <div class="footer-buttons-wrapper">
                <button onclick="emptyTaskDocument()" onmouseleave="clearBtnToBlack()" onmouseover="clearBtnToBlue()" class="clear-all-button">
                  <p>Clear</p>
                  <img id="clearBtn" src="../img/close.png" alt="close" />
                </button>
                <button onclick="createTaskInBoardFireBase()" class="create-task-button">
                  <p>Create Task</p>
                  <img src="../img/check.png" alt="check" />
                </button>
              </div>
            </div>
          </div>
    </div>`;
}


/**
 * Returns the HTML string for rendering the edit task modal overlay.
 * @param {Object} task - The task object to be edited.
 * @returns {string} HTML string of the edit task template.
 */
function editTaskTemplate(task) {
  return `<div onclick="closeDropdownsIfClickedOutside(event); closeSubtaskInsert(event); event.stopPropagation()" class="detailed-overlay" id="taskDetailedOverlay">
  <div class="leave-edit-icon-wrapper">
   <div onclick="closeTaskInfoOverlay()" class="leave-edit-icon">
    <img src="../img/close.png">
   </div>
  </div>
  <div class="edit-data-container">
         <div class="title-field-space space-between">
       <span required class="edit-state-subtitle">Title</span>
       <input onkeydown="blurOnEnter(event)" id="taskTitle" class="form-border edit-form-size" placeholder="Enter a title" type="text" />
     </div>
      <div class="title-field-space space-between">
       <span class="edit-state-subtitle" for="description">Description</span>
       <textarea class="form-border edit-form-description" id="description" name="description" placeholder="Enter a description"></textarea>
     </div>
     <div class="title-field-space space-between">
       <span class="edit-state-subtitle">Due date</span>
       <input onkeydown="blurOnEnter(event)" id="taskDate" required class="due-date-field form-border edit-form-size" type="date" />
     </div>
     <div class="priority-section">
             <span class="edit-state-subtitle">Priority</span>
             <div class="prio-buttons">
               <button onclick="setActivePriority(this, 'rgb(255, 61, 0)', 0)" class="priority-button prio-small form-priority urgent prio-btn">
                 <p class="prio-txt">Urgent</p>
                 <svg class="priority-icon priority-icon-0" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <g clip-path="url(#clip0_156_1009)">
                     <path
                       d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                       fill="rgb(255, 61, 0)"
                     />
                     <path
                       d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                       fill="rgb(255, 61, 0)"
                     />
                   </g>
                   <defs>
                     <clipPath id="clip0_156_1009">
                       <rect width="20" height="14.5098" fill="black" transform="translate(0.355469 0.936768)" />
                     </clipPath>
                   </defs>
                 </svg>
               </button>
               <button onclick="setActivePriority(this, 'rgb(255, 168, 1)', 1)" class="priority-button prio-small form-priority medium prio-btn">
                 <p class="prio-txt">Medium</p>
                 <svg class="priority-icon priority-icon-1" width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <g clip-path="url(#clip0_156_1038)">
                     <path
                       d="M19.7596 7.91717H1.95136C1.66071 7.91717 1.38197 7.80087 1.17645 7.59386C0.970928 7.38685 0.855469 7.10608 0.855469 6.81332C0.855469 6.52056 0.970928 6.23979 1.17645 6.03278C1.38197 5.82577 1.66071 5.70947 1.95136 5.70947H19.7596C20.0502 5.70947 20.329 5.82577 20.5345 6.03278C20.74 6.23979 20.8555 6.52056 20.8555 6.81332C20.8555 7.10608 20.74 7.38685 20.5345 7.59386C20.329 7.80087 20.0502 7.91717 19.7596 7.91717Z"
                       fill="rgb(255, 168, 0)"
                     />
                     <path
                       d="M19.7596 2.67388H1.95136C1.66071 2.67388 1.38197 2.55759 1.17645 2.35057C0.970928 2.14356 0.855469 1.86279 0.855469 1.57004C0.855469 1.27728 0.970928 0.996508 1.17645 0.789496C1.38197 0.582485 1.66071 0.466187 1.95136 0.466187L19.7596 0.466187C20.0502 0.466187 20.329 0.582485 20.5345 0.789496C20.74 0.996508 20.8555 1.27728 20.8555 1.57004C20.8555 1.86279 20.74 2.14356 20.5345 2.35057C20.329 2.55759 20.0502 2.67388 19.7596 2.67388Z"
                       fill="rgb(255, 168, 0)"
                     />
                   </g>
                   <defs>
                     <clipPath id="clip0_156_1038">
                       <rect width="20" height="7.45098" fill="white" transform="translate(0.855469 0.466187)" />
                     </clipPath>
                   </defs>
                 </svg>
               </button>
               <button onclick="setActivePriority(this, 'rgb(123, 225, 41)', 2)" class="priority-button prio-small form-priority low prio-btn">
                 <p class="prio-txt">Low</p>
                 <svg class="priority-icon priority-icon-2" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path
                     d="M10.3555 9.69779C10.1209 9.69819 9.89234 9.62335 9.70349 9.48427L0.800382 2.91453C0.684543 2.82898 0.586704 2.72146 0.512448 2.59812C0.438193 2.47478 0.388977 2.33803 0.367609 2.19569C0.324455 1.90821 0.397354 1.61537 0.57027 1.3816C0.743187 1.14782 1.00196 0.992265 1.28965 0.949143C1.57734 0.906021 1.8704 0.978866 2.10434 1.15165L10.3555 7.23414L18.6066 1.15165C18.7224 1.0661 18.854 1.00418 18.9938 0.969432C19.1336 0.934685 19.2788 0.927791 19.4213 0.949143C19.5637 0.970495 19.7006 1.01967 19.824 1.09388C19.9474 1.16808 20.055 1.26584 20.1407 1.3816C20.2263 1.49735 20.2883 1.62882 20.323 1.7685C20.3578 1.90818 20.3647 2.05334 20.3433 2.19569C20.322 2.33803 20.2727 2.47478 20.1985 2.59812C20.1242 2.72146 20.0264 2.82898 19.9106 2.91453L11.0075 9.48427C10.8186 9.62335 10.5901 9.69819 10.3555 9.69779Z"
                     fill="rgb(123, 225, 41)"
                   />
                   <path
                     d="M10.3555 15.4463C10.1209 15.4467 9.89234 15.3719 9.70349 15.2328L0.800381 8.66307C0.566436 8.49028 0.410763 8.2317 0.367609 7.94422C0.324455 7.65674 0.397354 7.3639 0.57027 7.13013C0.743187 6.89636 1.00196 6.7408 1.28965 6.69768C1.57734 6.65456 1.8704 6.7274 2.10434 6.90019L10.3555 12.9827L18.6066 6.90019C18.8405 6.7274 19.1336 6.65456 19.4213 6.69768C19.709 6.7408 19.9678 6.89636 20.1407 7.13013C20.3136 7.3639 20.3865 7.65674 20.3433 7.94422C20.3002 8.2317 20.1445 8.49028 19.9106 8.66307L11.0075 15.2328C10.8186 15.3719 10.5901 15.4467 10.3555 15.4463Z"
                     fill="rgb(123, 225, 41)"
                   />
                 </svg>
               </button>
             </div>
           </div>
           <div class="contacts-section">
            <span required class="edit-state-subtitle">Assigned to</span>
            <div class="dropdown-wrapper">
              <div class="assignment-toggle-buttons">
              <div id="closedState" onclick="openContactAssignmentInput()" class="form-select edit-form-size form-border">
                <span class="">Select contacts to assign</span>
                <div class="dropdown-icon-wrapper">
                  <img class="dropdown-icon" src="../img/dropdown-arrow-down.png" alt="dropdown arrow">
                </div>
              </div>
              <div class="form-contact-search edit-form-size" style="display: none;" id="searchState">
                <input id="searchContacts" oninput="searchForContacts()" onkeydown="blurOnEnter(event)" type="text">
                <div onclick="closeContactAssignment()" class="arrow-up-wrapper">
                  <img src="../img/dropdown-arrow-up.png" alt="dropdown arrow">
                </div>
              </div>
              </div>
              <div id="contactOptions" class="contacts-options">
              </div>
              </div>
              <div id="chosenContactsBox"></div>
            </div>
            <div class="edit-subtask-section">
            <span class="edit-state-subtitle" for="description">Subtasks</span>
            <div class="subtask-input-wrapper input-wrapper-subtask">
            <input onfocus="showActionBtns()" onkeydown="checkShiftSubtask(event)" class="edit-form-size form-subtask form-border task-txt" id="subtaskInput" placeholder="Add new subtask" minlength="1" type="text">
            <div onclick="showActionBtns()" id="subtaskMainBtn" class="subtask-btn-wrapper subtask-main-btn">
              <img src="../img/add.png" alt="write">
            </div>
            <div id="focusBtns" class="subtask-focus-btns">
              <div onclick="emptySubtaskInput()" class="subtask-edit-btns subtask-btn-wrapper">
                <img src="../img/subtask_del.png" alt="del">
              </div>
              <div class="subtask-btns-separator"></div>
              <div onclick="addSubtask()" class="subtask-edit-btns subtask-btn-wrapper">
                <img src="../img/subtask_add.png" alt="add">
              </div>
            </div>
            </div>
            <div class="subtask-container edit-subtask-container" id="subtaskContainer">
            </div>
            <p class="mobile-warning task-txt">This field is required</p>
          </div>
    </div>
    <div class="accept-btn-wrapper">
    <svg onclick="handleOkBtnEvents(event)" onmouseover="handleOkBtnEvents(event)" onmouseout="handleOkBtnEvents(event)" class="accept-changes-btn" width="90" height="58" viewBox="0 0 90 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect class="ok-btn-color" x="0.682129" y="0.396729" width="89" height="57" rx="10" fill="#2A3647"/>
      <path d="M32.0443 28.7604C32.0443 30.4258 31.7286 31.8428 31.0973 33.0111C30.4708 34.1794 29.6157 35.0718 28.5319 35.6883C27.4531 36.2998 26.24 36.6055 24.8927 36.6055C23.5355 36.6055 22.3174 36.2973 21.2386 35.6808C20.1598 35.0643 19.3071 34.1719 18.6807 33.0036C18.0543 31.8353 17.7411 30.4209 17.7411 28.7604C17.7411 27.0949 18.0543 25.678 18.6807 24.5097C19.3071 23.3413 20.1598 22.4514 21.2386 21.8399C22.3174 21.2234 23.5355 20.9152 24.8927 20.9152C26.24 20.9152 27.4531 21.2234 28.5319 21.8399C29.6157 22.4514 30.4708 23.3413 31.0973 24.5097C31.7286 25.678 32.0443 27.0949 32.0443 28.7604ZM28.7706 28.7604C28.7706 27.6815 28.609 26.7717 28.2858 26.031C27.9676 25.2902 27.5177 24.7284 26.936 24.3456C26.3544 23.9628 25.6733 23.7714 24.8927 23.7714C24.1122 23.7714 23.4311 23.9628 22.8494 24.3456C22.2677 24.7284 21.8153 25.2902 21.4921 26.031C21.174 26.7717 21.0149 27.6815 21.0149 28.7604C21.0149 29.8392 21.174 30.749 21.4921 31.4898C21.8153 32.2305 22.2677 32.7923 22.8494 33.1751C23.4311 33.558 24.1122 33.7494 24.8927 33.7494C25.6733 33.7494 26.3544 33.558 26.936 33.1751C27.5177 32.7923 27.9676 32.2305 28.2858 31.4898C28.609 30.749 28.7706 29.8392 28.7706 28.7604ZM37.2552 33.1006L37.2627 29.2898H37.725L41.394 24.9422H45.0407L40.1114 30.6993H39.3582L37.2552 33.1006ZM34.3766 36.3967V21.124H37.5535V36.3967H34.3766ZM41.5357 36.3967L38.165 31.4077L40.2829 29.1631L45.257 36.3967H41.5357Z" fill="white"/>
      <mask id="mask0_75609_16286" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="49" y="16" width="25" height="25">
      <rect x="49.6821" y="16.8967" width="24" height="24" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_75609_16286)">
      <path d="M59.2328 32.0467L67.7078 23.5717C67.9078 23.3717 68.1453 23.2717 68.4203 23.2717C68.6953 23.2717 68.9328 23.3717 69.1328 23.5717C69.3328 23.7717 69.4328 24.0092 69.4328 24.2842C69.4328 24.5592 69.3328 24.7967 69.1328 24.9967L59.9328 34.1967C59.7328 34.3967 59.4995 34.4967 59.2328 34.4967C58.9662 34.4967 58.7328 34.3967 58.5328 34.1967L54.2328 29.8967C54.0328 29.6967 53.937 29.4592 53.9453 29.1842C53.9537 28.9092 54.0578 28.6717 54.2578 28.4717C54.4578 28.2717 54.6953 28.1717 54.9703 28.1717C55.2453 28.1717 55.4828 28.2717 55.6828 28.4717L59.2328 32.0467Z" fill="white"/>
      </g>
      </svg>
      </div>
  </div>`;
}


/**
 * Generates an HTML string for a subtask item template, including its icon and title.
 * 
 * @param {string} subtaskKey - A unique identifier for the subtask.
 * @param {string} className - CSS class name(s) to apply to the subtask icon.
 * @param {string} src - The source URL of the subtask icon image.
 * @param {{ title: string }} subtask - The subtask object containing at least a title.
 * @returns {string} An HTML string representing the subtask element.
 */
function subtasksTemplate(subtaskKey, className, src, subtask) {
  return `
            <div class="overlay-subtask-template">
                <img class="subtask-icon ${className}" 
                    onclick="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    onmouseover="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    onmouseout="toggleSubtaskIcon(event, this, '${subtaskKey}')" 
                    id="subtaskIcon-${subtaskKey}" 
                    src="${src}">
                <p id="subtaskText-${subtaskKey}">${subtask.title}</p>
            </div>`;
}