const BASE_URL = 'https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/';

async function putContacts(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function postContacts(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

function sanitizeEmail(email) {
    return email.replace(/[@.]/g, "_");
}

async function isDuplicateEmail(path='') {
    const response = await fetch(BASE_URL + path + ".json");
    const data = await response.json();
    return data !== null;
}

async function saveBasicContacts() {
    for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i];
        const safeKey = sanitizeEmail(contact.email);
        const path = 'contacts/' + safeKey;

        const exists = await isDuplicateEmail(path);
        if (!exists) {
            await putContacts(path, contact);
        } else {
            continue;
        }
    }
}


async function getNewContactData() {
    const nameInput = document.getElementById('contactName');
    const nameValue = nameInput.value;
    const emailInput = document.getElementById('contactEmail');
    const emailValue = emailInput.value;
    const phoneInput = document.getElementById('contactPhone');
    const phoneValue = phoneInput.value;

    return {nameValue, emailValue, phoneValue};
}

async function saveNewContactToDataBase() {
    const {nameValue, emailValue, phoneValue} = await getNewContactData();
    const filled = inputsFilledOut({nameValue, emailValue, phoneValue});
    const safeKey = sanitizeEmail(emailValue);
    const path = 'contacts/' + safeKey;
    if (!filled) return;

    const exists = await doesContactExists({emailValue});
    if (exists) {
        alert("contact already exists");
        return;
    }
    putContacts(path, {nameValue, emailValue, phoneValue});

}

function inputsFilledOut({nameValue, emailValue, phoneValue}) {
    if (nameValue == "" || emailValue == "" || phoneValue == "") {
        return false;
    } else {
        return true;
    }
}

async function doesContactExists({emailValue}) {
    const response = await fetch(BASE_URL + 'contacts/' + '.json');
    const data = await response.json();
    const sanitizedEmailValue = sanitizeEmail(emailValue);

    for (const key in data) {
        if (data[key].email === sanitizedEmailValue) {
            return true;
        }
    }
    return false;
    }


    async function editContactInFireBase() {
        
    }