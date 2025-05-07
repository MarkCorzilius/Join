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
    } catch (error) {
        
    }
}

function setViewSubtask() {
    const user = JSON.stringify({name: 'Guest', email: 'guest@example.com'});
    localStorage.setItem(user);
    showLegalNoticeAndPrivacyPolicy();
}