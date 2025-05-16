let currOverlay = 1;

document.addEventListener("DOMContentLoaded", function () {
    window.dispatchEvent(new Event("resize"));
});

async function showLegalNoticeAndPrivacyPolicy() {

    w3.includeHTML();

    const waitForInclude = () => new Promise((resolve) => {
        const checkExist = setInterval(() => {
        const sidebarLoaded = document.querySelector('#sidebar');
        const headerLoaded = document.querySelector('#header');
        if (sidebarLoaded && headerLoaded) {
            clearInterval(checkExist);
            resolve();
          }
        }, 50);
      });
    try {
        await waitForInclude();
        adjustSideBar();
        markCurrentPage();
        ifGuestShowDropdownHelp();
        adjustInitialAfterLogin();

        adjustHelpForMobile(); 
        window.addEventListener('resize', adjustHelpForMobile);
    } catch (error) {
        console.log('error in showLegalNoticeAndPrivacyPolicy()');
    }
}

function setViewSubtask() {
    const user = JSON.stringify({name: 'Guest', email: 'guest@example.com'});
    localStorage.setItem(user);
    showLegalNoticeAndPrivacyPolicy();
}


const paths = [
'summary.',
'add_task',
'board',
'contacts',
'help.html',
'privacy_policy',
'legal_notice',
];


function markCurrentPage() {
    const buttons = document.querySelectorAll('.nav-button');
    paths.forEach((path, index) => {
        if (window.location.pathname.includes(path)) {
            if (buttons[index]) {
                buttons.forEach(btn => {
                    btn.classList.remove('activeBtn');
                });
            buttons[index].classList.add('activeBtn');
            }
        }
    });
}


function adjustHelpForMobile() {
    const help = document.querySelector('.dropdown-help');
    if (window.innerWidth <= 1000) {
        help.classList.remove('d-none');
    } else if (window.innerWidth > 1000) {
        help.classList.add('d-none');
    }
}


function decideCurrentTaskOverlay() {

    switch (currOverlay) {
        case 'boardAddTaskOverlay':
            return 'form-size';
        case 'editOverlay':
            return 'edit-form-size';
        default: 
            return 'basic-size';
    }
}

function togglePasswordVisibility(inputId, element, path) {
    const passwordInputId = document.getElementById(inputId);
    element.classList.toggle('visible');
    if (element.classList.contains('visible')) {
        passwordInputId.type = 'text';
        element.src = `${path}img/password_visible.png`;
    } else {
        passwordInputId.type = 'password';
        element.src = `${path}img/password_not_visible.png`;

    }
}