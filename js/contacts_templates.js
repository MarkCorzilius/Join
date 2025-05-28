function generateContactHTML(c, vars) {
    return `<div class="contact-item" onclick="openContactItem('${c.name}', '${c.email}', '${c.phone}'); contactItemClicked(this)">
    <div class="contact-initials" style="background-image:url('${vars.bg}'); background-size:cover; background-position:center;">
            ${vars.initials}
        </div>
        <div class="contact-details">
            <p class="contact-name">${c.name}</p>
            <p class="contact-email">${c.email}</p>
        </div>
    </div>`;
}


function generateContactDetails(bg, initials, name, email, phone) {
    return `
      <div class="detail-avatar-name">
        <div class="contact-detail-avatar" id="detailAvatar" style="background-image: url('${bg}'); background-size: cover; background-position: center;">
          ${initials}
        </div>
        <div class="contact-edit">
          <h2 id="detailName">${name}</h2>
          <div class="edit-or-delete">
            <button class="edit-btn" type="button" onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}')">
              <span class="edit-icon-wrapper icon-left">
                <img class="edit-icon default" src="/img/edit.png" alt="">
                <img class="edit-icon hover" src="/img/edit_hovered.png" alt="">
              </span>
              <p>Edit</p>
            </button>
  
            <button class="delete-btn" type="button" onclick="deleteContact('${email}')">
              <span class="delete-icon-wrapper icon-left">
                <img class="delete-icon default" src="/img/delete.png" alt="">
                <img class="delete-icon hover" src="/img/delete_hovered.png" alt="">
              </span>
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
      <div class="email-phone">
        <p>Contact Information</p>
        <b>Email</b>
        <p class="email" id="detailEmail">${email}</p>
        <b>Phone</b>
        <p class="phone" id="detailPhone">${phone}</p>
      </div>
  
      <div class="mobile-more-container">
        <button class="mobile-more-btn" onclick="toggleMobileActions('${bg}', '${initials}', '${name}', '${email}', '${phone}')">
          <img src="../img/mobile_more_btn.png" alt="Mehr Optionen">
        </button>
        <div id="mobileActionsMenu" class="mobile-actions d-none">
        </div>
      </div>
    `;
}


function generateToggleMobileHTML(bg, initials, name, email, phone) {
    return `
      <button onclick="editContact('${name}', '${email}', '${phone}', '${initials}', '${bg}')">
        <img class="edit" src="../img/edit.png" alt="Edit">
        <p>Edit</p>
      </button>
  
      <button onclick="deleteContact('${email}')">
        <img class="delete" src="../img/delete.png" alt="Delete">
        <p>Delete</p>
      </button>
    `;
}