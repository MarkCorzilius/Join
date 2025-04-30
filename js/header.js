function setupHeader() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const helpIcon = document.querySelector(".help-icon");
    const userInitials = document.querySelector(".user-initials");
    if (loggedIn) {
        helpIcon?.classList.remove('d-none');
        userInitials?.classList.remove('d-none');
        const userName = localStorage.getItem("userName");
        if (userName && userInitials) {
            const parts = userName.trim().split(' ').filter(Boolean);
            let initials = '';
            if (parts.length >= 2) {
                initials = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
            } else if (parts.length === 1) {
                initials = parts[0].charAt(0).toUpperCase();
            } else {
                initials = '??';
            }
            userInitials.innerText = initials;
        }
    } else {
        helpIcon?.classList.add('d-none');
        userInitials?.classList.add('d-none');
    }
    if (typeof setupDropdownMenu === "function") setupDropdownMenu();
}



function setupDropdownMenu() {
    const initials = document.querySelector('.user-initials');
    const dropdown = document.getElementById('userDropdown');
    if (initials && dropdown) {
        initials.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                initials.style.cursor = 'pointer';
            } else {
                dropdown.classList.add('show');
                initials.style.cursor = 'default';
            }
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== initials) {
                dropdown.classList.remove('show');
                initials.style.cursor = 'pointer';
            }
        });
    }
}



function logout() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    setTimeout(() => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        window.location.href = "../index.html";
    }, 300);
}


