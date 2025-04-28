const BASE_URL = 'https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(path="", data={}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

async function getData(path="") {
  let response = await fetch(BASE_URL + path + '.json');
  return response.json();
}

async function putData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteData(path="") {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "DELETE",
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