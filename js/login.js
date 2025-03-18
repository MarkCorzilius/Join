

let users = [  // Das kommt später in FireBase!!!
    {'email': 'igor@test.de', 'password': '1234'}
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
    
    // Prüfen, ob der Benutzer bereits existiert (basierend auf der E-Mail)
    let existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Dieser Benutzer existiert bereits!");
        return;
    }
    
    // Falls der Benutzer noch nicht existiert, füge ihn hinzu
    users.push({ email: email, password: password });
    console.log(users);
}

