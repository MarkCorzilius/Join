async function helpOnLoad() {
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
        ifGuestShowDropdownHelp();
        adjustInitialAfterLogin();
        ifHelpPageNoHelpIcon();
        adjustHelpForMobile(); 
        window.addEventListener('resize', adjustHelpForMobile);
    } catch (error) {
        console.log('error in helpOnLoad()')
    }
}


function hideHelpIcon() {
    document.getElementById('helpIcon').classList.add('d-none');
}

function showHelpIcon() {
    document.getElementById('helpIcon').classList.remove('d-none');
}