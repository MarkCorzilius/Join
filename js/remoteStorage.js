const BASE_URL = 'https://join-fce4c-default-rtdb.europe-west1.firebasedatabase.app/';

async function getFirebaseData() {
  let response = await fetch(BASE_URL + '.json');
  console.log(response);
}