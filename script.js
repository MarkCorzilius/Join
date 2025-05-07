document.addEventListener("DOMContentLoaded", function () {
    window.dispatchEvent(new Event("resize"));
});

async function showLegalNoticeAndPrivacyPolicy() {

    w3.includeHTML();

    const waitForInclude = () => new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('#sidebar')) {
            clearInterval(checkExist);
            resolve();
          }
        }, 50);
      });
    try {
        await waitForInclude();
        adjustSideBar();
        markCurrentPage();
    } catch (error) {
        
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
    console.log("Current path:", window.location.pathname);
    const buttons = document.querySelectorAll('.nav-button');
    paths.forEach((path, index) => {
        if (window.location.pathname.includes(path)) {
            if (buttons[index]) {
                buttons.forEach(btn => {
                    btn.classList.remove('activeBtn');
                });
            buttons[index].classList.add('activeBtn');
            console.log('found: ', buttons[index]);
            }
        }
    });
}