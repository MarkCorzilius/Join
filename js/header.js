function toggleInitialDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('d-none');
}

function logout() {
    window.location.href = '../index.html';
    localStorage.removeItem('user');
}

function ifGuestShowDropdownHelp() {
    const user = JSON.parse(localStorage.getItem('user'));
    const btn = document.querySelector('.dropdown-help');
    if (user.name === 'Guest') {
        btn.classList.remove('d-none');
    }
}

async function adjustInitialAfterLogin() {
    const container = document.getElementById('userInitial');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.name === 'Guest') {
        container.innerText = 'G';
        return;
    } else {
        const initial = await searchForContactInitial(user.email);
        container.innerText = initial;
    }  
}

async function searchForContactInitial(email) {
    const rawContacts = await getData('contacts/');
    const contacts = Object.values(rawContacts);

    const match = contacts.find(contact => contact.email === email);
    return match?.icon?.initial;

}

function ifHelpPageNoHelpIcon() {
    const icon = document.querySelector('.help-icon');
    if (window.location.pathname.includes('help')) {
        icon.classList.add('d-none');
    }
}