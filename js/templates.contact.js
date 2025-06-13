/**
 * Generates HTML for a contact list item.
 * @param {{ name: string, email: string, phone: string, id: number }} c - Contact data.
 * @param {{ bg: string, initial: string }} vars - Background and initials for the avatar.
 * @returns {string} HTML string for the contact item.
 */
function generateContactHTML(c, vars) {
  return `<div class="contact-item" onclick="openContactItem('${c.name}', '${c.email}', '${c.phone}', ${c.id}); contactItemClicked(this)">
  <div class="contact-initials" style="background-image:url('${vars.bg}'); background-size:cover; background-position:center;">
          ${vars.initial}
      </div>
      <div class="contact-details">
          <p class="contact-name">${c.name}</p>
          <p class="contact-email">${c.email}</p>
      </div>
  </div>`;
}


/**
 * Generates detailed HTML view for a selected contact.
 * @param {string} bg - Background image URL.
 * @param {string} initial - Initials of the contact.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {number} id - Contact ID.
 * @returns {string} HTML string for the contact details view.
 */
function generateContactDetails(bg, initial, name, email, phone, id) {
  return `
    <div class="detail-avatar-name">
      <div class="contact-detail-avatar" id="detailAvatar" style="background-image: url('${bg}'); background-size: cover; background-position: center;">
        ${initial}
      </div>
      <div class="contact-edit">
        <h2 class="truncate-text" id="detailName">${name}</h2>
        <div class="edit-or-delete">
          <button class="edit-btn" type="button" onclick="editContact('${name}', '${email}', '${phone}', '${initial}', '${bg}', ${id})">
            <span class="edit-icon-wrapper icon-left">
              <img class="edit-icon default" src="../img/edit.png" alt="">
              <img class="edit-icon hover" src="../img/edit_hovered.png" alt="">
            </span>
            <p>Edit</p>
          </button>

          <button class="delete-btn" type="button" onclick="deleteContact(${id})">
            <span class="delete-icon-wrapper icon-left">
              <img class="delete-icon default" src="../img/delete.png" alt="">
              <img class="delete-icon hover" src="../img/delete_hovered.png" alt="">
            </span>
            <p>Delete</p>
          </button>
        </div>
      </div>
    </div>
    <div class="email-phone">
      <p class="fontTwenty">Contact Information</p>
      <b class="fontTwenty">Email</b>
      <p class="email truncate-text" id="detailEmail">${email}</p>
      <b class="fontTwenty">Phone</b>
      <p class="phone" id="detailPhone">${phone}</p>
    </div>

    <div class="mobile-more-container">
      <button class="mobile-more-btn" onclick="toggleMobileActions('${bg}', '${initial}', '${name}', '${email}', '${phone}')">
        <img src="../img/mobile_more_btn.png" alt="Mehr Optionen">
      </button>
      <div id="mobileActionsMenu" class="mobile-actions d-none">
      </div>
    </div>
  `;
}


/**
 * Generates HTML for mobile toggle buttons (edit/delete).
 * @param {string} bg - Background image URL.
 * @param {string} initial - Initials of the contact.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {number} id - Contact ID.
 * @returns {string} HTML string for mobile actions.
 */
function generateToggleMobileHTML(bg, initial, name, email, phone, id) {
  return `
    <button onclick="editContact('${name}', '${email}', '${phone}', '${initial}', '${bg}', ${id})">
      <img class="edit" src="../img/edit_task.png" alt="Edit">
    </button>
    <button onclick="deleteContact(${id})">
      <img class="delete" src="../img/delete_task.png" alt="Delete">
    </button>
  `;
}


/**
 * Returns a message template when no contacts are found.
 * @returns {string} HTML string for the "no contacts" message.
 */
function noContactsMessageTemplate() {
  return `
    <div class="no-contacts-found" id="noContactsFound">
      <p>No contacts existing.</p> 
      <p>You can create some.</p>
    </div>
  `;
}