const BASE_URL = "https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/";

async function addContact(data) {
  // 1️⃣ Check if the contact already exists
  let existingContacts = await fetch(BASE_URL + "/contacts.json");
  let contacts = await existingContacts.json();

  // 2️⃣ Prevent duplicates (check by email)
  for (let id in contacts) {
    if (contacts[id].email === data.email) {
      console.log("❌ Contact already exists:", data.fullName);
      return;
    }
  }

  // 3️⃣ Add the new contact
  let response = await fetch(BASE_URL + "/contacts.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let result = await response.json();
  console.log("✅ Contact added:", result);
}

// 🔹 Example usage:
function onloadFunc() {
  addContact({
    fullName: "Mark Corzilius",
    email: "mark@example.com",
    phone: "+123456789",
    userId: "user_123",
  });

  addContact({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+987654321",
    userId: "user_456",
  });
}

// 🔥 Call this when the page loads
onloadFunc();
