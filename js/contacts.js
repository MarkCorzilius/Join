

let contactsArray = [
    { name: "Anja Schulz", email: "schulz@hotmail.com", phone: "+49 170 1234567" },
    { name: "Anton Greber", email: "greber@hotmail.com", phone: "+49 171 2345678" },
    { name: "Stafanie Weimer", email: "stefanie@gmail.com", phone: "+49 172 3456789" },
    { name: "Benedikt Ziegler", email: "benedikt@gmail.com", phone: "+49 173 4567890" },
    { name: "Igor Boger", email: "igor@gmail.com", phone: "+49 174 5678901" },
    { name: "Alex Müller", email: "alex@gmail.com", phone: "+49 175 6789012" },
    { name: "Gerd Fischter", email: "gerd@gmail.com", phone: "+49 176 7890123" },
    { name: "Eva Fischer", email: "fischer@gmail.com", phone: "+49 177 8901234" },
    { name: "Margrid Sieger", email: "margrid@gmail.com", phone: "+49 178 9012345" }
];



const bgImages = [
    '/img/variante1.png',
    '/img/variante2.png',
    '/img/variante3.png',

    '/img/variante4.png',
    '/img/variante5.png',
    '/img/variante6.png',

    '/img/variante7.png',
    '/img/variante8.png',
    '/img/variante9.png',

    '/img/variante10.png',
    '/img/variante11.png',
    '/img/variante12.png',

    '/img/variante13.png',
    '/img/variante14.png',
    '/img/variante15.png',
];


function renderContacts() {
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    const container = document.querySelector('.contacts-list');
    if (!container) return;

    const groups = {};
    contactsArray.forEach(c => {
        const letter = c.name[0].toUpperCase();
        (groups[letter] = groups[letter] || []).push(c);
    });

    container.innerHTML = Object.keys(groups).sort().map(letter => {
        let html = `<h2>${letter}</h2>`;
        groups[letter].forEach(c => {
            const vars = getContactVars(c);
            html += generateContactHTML(c, vars);
        });
        return html;
    }).join("");
}


function getInitials(name) {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


function getContactVars(c) {
    return {
        initials: getInitials(c.name),
        bg: getBackgroundForName(c.name)
    };
}


function generateContactHTML(c, vars) {
    return `<div class="contact-item" onclick="openContactItem('${c.name}', '${c.email}', '${c.phone}'); contactItemClicked(this)">
    <div class="contact-initials" style="background-image:url('${vars.bg}'); background-size:cover; background-position:center;">
            ${vars.initials}
        </div>
        <div class="contact-details">
            <p class="contact-name">${c.name}</p>
            <p class="contact-email">${c.email}</p>
        </div>
    </div>`;
}


function getBackgroundForName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    const index = sum % bgImages.length;
    return bgImages[index];
}


function openContactItem(name, email, phone) {
    const initials = getInitials(name);
    const bg = getBackgroundForName(name);
    let contactDetailView = document.getElementById("contactDetailView");
    contactDetailView.classList.remove("d-none");
    contactDetailView.innerHTML = '';
    contactDetailView.innerHTML = generateContactDetails(bg, initials, name, email, phone);
    slideEfekt();
}


function slideEfekt() {
    let contactDetailView = document.getElementById("contactDetailView");
    contactDetailView.classList.remove("slide-in");
    contactDetailView.classList.remove("d-none");
    setTimeout(() => {
        contactDetailView.classList.add("slide-in");
    }, 10);
}


function generateContactDetails(bg, initials, name, email, phone) {
    return `
      <div class="detail-avatar-name">
        <div class="contact-detail-avatar" id="detailAvatar" style="background-image: url('${bg}'); background-size: cover; background-position: center;">
          ${initials}
        </div>
        <div class="edit-delete">
          <h2 id="detailName">${name}</h2>
          <img src="/img/edit_contacts.png" alt="">
          <img src="/img/delete-contact.png" alt="">
        </div>
      </div>
      <div class="email-phone">
        <p>Contact Information</p>
        <b>Email</b>
        <p class="email" id="detailEmail">${email}</p>
        <b>Phone</b>
        <p class="phone" id="detailPhone">${phone}</p>
      </div>
    `;
}


function contactItemClicked(itemElement) {
    document.querySelectorAll(".contact-item").forEach(item =>
        item.classList.remove("clicked-color")
    );
    itemElement.classList.add("clicked-color");

    document.querySelectorAll(".contact-name").forEach(name =>
        name.classList.remove("color-white")
    );
    const nameElement = itemElement.querySelector(".contact-name");
    if (nameElement) {
        nameElement.classList.add("color-white");
    }
}


function openAddContactOverlay() {
    const overlay = document.getElementById('addContactOverlay');
    overlay.classList.remove("d-none");
    setTimeout(() => overlay.classList.add("show"), 10);
    const overlayContent = overlay.querySelector(".overlay-content");
    setTimeout(() => overlayContent.classList.add("slide-in"), 10);
}


function closeAddContactOverlay() {
    const overlay = document.getElementById('addContactOverlay');
    const overlayContent = overlay.querySelector(".overlay-content");
    overlayContent.classList.remove("slide-in");
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("d-none"), 300);
}


document.getElementById("addContactOverlay").addEventListener("click", function (e) {
    if (e.target === this) {
        closeAddContactOverlay();
    }
});


function saveNewContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (!name || !email) {
        alert("Bitte Name und E-Mail angeben!");
        return;
    }
    const newContact = { name, email, phone };
    contactsArray.push(newContact);
    renderContacts();
    closeAddContactOverlay();
    deleteValue();
}


function deleteValue() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

