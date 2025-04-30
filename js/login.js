// Beispiel-Benutzer (später durch echten Authentifizierungs-Code wird in FireBase ersetzt!!!)
// let users = [
//     { email: 'igor@test.de', password: '1234' },
//     { email: 'admin@join.de', password: 'join2024' }
// ];


let users = [
    {
        firstName: "Igor",
        lastName: "Test",
        email: "igor@test.de",
        password: "1234"
    },
    {
        firstName: "Admin",
        lastName: "Join",
        email: "admin@join.de",
        password: "join2024"
    }
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

    // Suche User anhand E-Mail + Passwort
    let existingUser = users.find(user => user.email === email && user.password === password);

    if (existingUser) {
        localStorage.setItem("loggedIn", "true");

        // 🔥 Jetzt vollen Namen speichern
        const fullName = existingUser.firstName + " " + existingUser.lastName;
        // localStorage.setItem("userName", fullName);
        localStorage.setItem("userName", existingUser.firstName + " " + existingUser.lastName);

        console.log("erfolgreich eingeloggt als:", fullName);

        setTimeout(() => {
            window.location.href = "../templates/summary.html";
        }, 300);
        return;
    }

    alert("Benutzer nicht gefunden oder falsches Passwort!");
}



// ::::::::ist abfrage für fireBase ob user eingelogt ist::::::::

// function authCheck() {
//     const loggedIn = localStorage.getItem('loggedIn');
//     if (loggedIn === 'true') {
//         window.location.href = './templates/summary.html';
//     }
// }


window.addEventListener('DOMContentLoaded', () => {
    let header = document.querySelector('.log-in-header');
    let main = document.querySelector('.log-in-main');
    let footer = document.querySelector('.log-in-footer')
    if (header && main && footer) {
        header.classList.add('fade-header');
        main.classList.add('fade-main');
        footer.classList.add('fade-footer');
    }


    let splash = document.querySelector('.splash-logo-container');
    if (splash) {
        splash.style.pointerEvents = 'none';
        splash.style.zIndex = '0';
    }

});


function guestLogin() {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", "Guest");

    console.log("Guest erfolgreich eingeloggt");

    setTimeout(() => {
        window.location.href = "../templates/summary.html";
    }, 300);


    
    // Gast - User darf z.B.keine Kontakte speichern
    // Gast - User darf nur Board lesen, aber nicht bearbeiten
}



function signIn() {
    console.log("Sign In clicked");
}



