const PUSH_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec";

export default (async function updateFirebase() {
  return fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "action=republish"
  })
    .then(response => response.text())
    .then(responseText => {
      alert(responseText);
    })
    .catch(error => {
      console.error(error);
    });
});
