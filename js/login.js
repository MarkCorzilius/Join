window.addEventListener('DOMContentLoaded', () => {
    applyFadeEffectsToLoginSections();
    disableSplashInteraction();
});

function applyFadeEffectsToLoginSections() {
    const header = document.querySelector('.log-in-header');
    const main = document.querySelector('.log-in-main');
    const footer = document.querySelector('.log-in-footer');

    if (header && main && footer) {
        header.classList.add('fade-header');
        main.classList.add('fade-main');
        footer.classList.add('fade-footer');
    }
}

function disableSplashInteraction() {
    const splash = document.querySelector('.splash-logo-container');

    if (splash) {
        splash.style.pointerEvents = 'none';
        splash.style.zIndex = '0';
    }
}

function guestLogin() {
    const guest = 'Guest' ;
    localStorage.setItem('user', JSON.stringify({name: guest, email: 'guest@example.com'}));
    
    setTimeout(() => {
        window.location.href = "./templates/summary.html";
    }, 300);

}

function storeLogInData() {
    const inputEmail = document.getElementById('loginEmail').value.trim();
    const inputPassword = document.getElementById('loginPassword').value.trim();
    return {inputEmail, inputPassword};
}

async function logIn(ev) {
    ev.preventDefault();
    const {inputEmail, inputPassword} = storeLogInData();
    if (!inputEmail || !inputPassword) {
        showFailureAlert();
        return;
    }
    const contact = await searchingForAccount({inputEmail, inputPassword});
    document.getElementById('logedInUser').innerText = contact.name;
    showLoginTransition();
    updateGreeting();
    localStorage.setItem('user', JSON.stringify({name: contact.name, email: contact.email}));
}

async function searchingForAccount({inputEmail, inputPassword}) {
    const contacts = await getData('contacts/');
    for (const contact of Object.values(contacts)) {
        if (contact.email === inputEmail || contact.password === inputPassword) {
            console.log('Match found:', contact.name);
            return contact;
        }
    }

    alert('Wrong email or password!');
    return;
}

function showFailureAlert() {
    const container = document.getElementById('wrongDataAlert');
    container.style.display = 'block';
}

function showLoginTransition() {
    const overlay = document.getElementById('greetingOverlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = './templates/summary.html';
        }, 1000);
    }, 1000);
}

async function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours());
    return hours;
  }
  
  
  async function updateGreeting() {
    const hour = await getCurrentTime();
    showCurrentGreeting(hour);
  }

  
  function showCurrentGreeting(hour) {
    const container = document.getElementById('logedInGreeting');
    let greeting;
    if (hour >= 5 && hour <= 11) {
      greeting = "Good morning,";
    } else if (hour >= 12 && hour <= 16) {
      greeting = "Good afternoon,";
    } else if (hour >= 17 && hour <= 20) {
      greeting = "Good evening,";
    } else {
      greeting = "Hello,";
    }
    container.innerText = greeting;
  }


  function setViewerStateLocalStorage() {
    const viewer = 'Viewer' ;
    localStorage.setItem('user', JSON.stringify({name: viewer, email: 'viewer@example.com'}));
}