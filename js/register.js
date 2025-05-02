function signIn() {
    let loginTemplates = document.getElementById("loginTemplates");
    loginTemplates.classList.add("d-none");

    let registerTemplates = document.getElementById("registerTemplates");
    registerTemplates.classList.remove("d-none");
  }

  function getRegisterData() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword1').value;
    const confirmPassword = document.getElementById('registerPassword2').value;
    

    return {name, email, password, confirmPassword};
  }

  function areAllFieldsFilled({name, email, password, confirmPassword}) {
    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      return false;
    } else {
      return true;
    }
  }

  function isPasswordMatch({name, email, password, confirmPassword}) {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  function isPrivacyPolicyAccepted() {
    const alert = document.getElementById('privacyDiscard');
    const privacy = document.getElementById('acceptPrivacy');
    if (privacy.classList.contains('accepted')) {
      return true;
    } else {
      alert.style.display = 'block';
      return false;
    }
  }

  async function isExistingContact({name, email, password, confirmPassword}) {
    const contacts = await getData('contacts/');
    for (const contact of Object.values(contacts)) {
      if (contact.email === email) {
        return true;
      } else {
        return false;
      }
    }
  }

  function signUp() {
    const {name, email, password, confirmPassword} = getRegisterData({name, email, password, confirmPassword});
     if (isExistingContact({name, email, password, confirmPassword})) {
      alert('contact with this email is already registered');
      return;
     }
     if (!areAllFieldsFilled({name, email, password, confirmPassword})) return;
     if (!isPasswordMatch({name, email, password, confirmPassword})) return;
     if (!isPrivacyPolicyAccepted()) return;
  }

  //