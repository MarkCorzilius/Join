function contactsTemplate(name, bg, initial) {
    return `
      <div onclick="styleChosenContact(this, '${initial}', '${bg}', '${name}')" class="option contact-line">
        <div>
          <div class="initial" style="background-image:url('${bg}')" alt="profile icon">${initial}</div>
          <span class="contact-name">${(name)}</span>
        </div>
        <svg class="select-box unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2" />
        </svg>
        <svg class="select-box checked" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15"
            stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M8 12L12 16L20 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    `;
}


function generateBgAndInitialForChosenContactsBox(bg, initial) {
    return `
        <div class="initial" style="background-image:url('${bg}')">
            ${initial}
        </div>
    `;
}