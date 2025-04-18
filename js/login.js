// Beispiel-Benutzer (später durch echten Authentifizierungs-Code wird in FireBase ersetzt!!!)
let users = [
    { email: 'igor@test.de', password: '1234' }
];

function addUser() {
    let loginEmail = document.getElementById("loginEmail");
    let loginPassword = document.getElementById("loginPassword");
    let email = loginEmail.value;
    let password = loginPassword.value;

    if (!email || !password) {
        alert("Bitte Email und Passwort eingeben!");
        return;
    }

    let existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Dieser Benutzer existiert bereits!");
        return;
    }

    users.push({ email: email, password: password });
    console.log(users);
}


window.addEventListener('DOMContentLoaded', () => {
    let logo = document.getElementById('mainLogo');


    let header = document.querySelector('.header-content');
    let main = document.querySelector('main');
    if (header && main) {
        header.classList.add('page-fade-in');
        main.classList.add('page-fade-in');
    }

    let splash = document.querySelector('.splash-logo-container');
    if (splash) {
        splash.style.pointerEvents = 'none';
        splash.style.zIndex = '0';
    }

});


function signIn() {
    console.log("Sign In clicked");
}



