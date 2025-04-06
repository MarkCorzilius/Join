
// // Funktion, die ein Template von einer URL lädt und in das Element mit dem angegebenen Selector einfügt.
// async function loadTemplate(selector, url) {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error("Fehler beim Laden von " + url);
//         }
//         const html = await response.text();
//         document.querySelector(selector).innerHTML = html;
//     } catch (error) {
//         console.error(error);
//     }
// }

// // Beim DOMContentLoaded werden Header und Sidebar geladen,
// // bevor weitere JS-Funktionen oder Inhalte sichtbar werden.
// document.addEventListener("DOMContentLoaded", async () => {
//     await loadTemplate("#headerContainer", "/templates/header.html");
//     await loadTemplate("#sidebarContainer", "/templates/sidebar.html");
// });