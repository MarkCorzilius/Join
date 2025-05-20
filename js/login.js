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
    showLoginTransition();
    updateGreeting();
    localStorage.setItem('user', JSON.stringify({name: contact.name, email: contact.email}));
}

async function searchingForAccount({inputEmail, inputPassword}) {
    const contacts = await getData('ourUsers/');
    for (const contact of Object.values(contacts)) {
        if (contact.email === inputEmail || contact.password === inputPassword) {
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
        setTimeout(() => {
            window.location.href = './templates/summary.html';
        }, 500);
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
      greeting = "Good Night,";
    }
    container.innerText = greeting;
    checkIfGuest('greetingUser', 'theUser');
    checkIfGuest('logedInGreeting', 'logedInUser');
  }


  function setViewerStateLocalStorage() {
    const viewer = 'Viewer' ;
    localStorage.setItem('user', JSON.stringify({name: viewer, email: 'viewer@example.com'}));
}

function checkReffererPage() {
    const created = localStorage.getItem('createContact');
    if (!created === 'false') return;
    if (created === 'true' && document.referrer.includes('register')) {
        showLoginToast();
    }
}

function showLoginToast() {
      const toast = document.getElementById("loginBanner");
      toast.style.display = 'block'
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
  }