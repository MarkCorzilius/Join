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
    if (btn) {
        console.log(true)
;    }
    if (user.name === 'Guest') {
        btn.classList.remove('d-none');
    }
}
