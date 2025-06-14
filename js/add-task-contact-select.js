/**
 * Toggles the visual selection state of a contact element when clicked.
 * Updates the UI based on whether the contact is selected or not.
 * 
 * @param {HTMLDivElement} element – The clicked contact's container element.
 * @param {string} initial – The initial of the contact's name.
 * @param {string} bg – The background color or image identifier for the contact icon.
 * @param {string} name – The name of the clicked contact.
 * @param {string} contactId – The unique ID of the clicked contact.
 * @returns {void} 
 */
function styleChosenContact(element, initial, bg, name, contactId) {
    element.classList.toggle("selected-contact");
    const checked = element.querySelector(".checked");
    const unchecked = element.querySelector(".unchecked");
    if (element.classList.contains("selected-contact")) {
      runIfSelected(checked, unchecked, initial, bg, name, contactId);
    } else {
      runIfNotSelected(checked, unchecked, initial, bg, name);
    }
  }
  
  
  /**
   * Handles styling and logic when a contact is selected.
   * Displays the checked icon, hides the unchecked icon, adds the contact to the selected array,
   * and updates the chosen contacts UI.
   * 
   * @param {SVGElement} checked – The SVG icon representing the "checked" state.
   * @param {SVGElement} unchecked – The SVG icon representing the "unchecked" state.
   * @param {string} initial – The initial of the contact's name.
   * @param {string} bg – The background color or image identifier for the contact icon.
   * @param {string} name – The name of the clicked contact.
   * @param {string} contactId – The unique ID of the clicked contact.
   */
  function runIfSelected(checked, unchecked, initial, bg, name, contactId) {
    checked.style.display = "inline";
    unchecked.style.display = "none";
    addContactToArray(initial, bg, name, contactId);
    visualizeChosenContacts();
  }
  
  
  /**
   * Handles UI and logic when a contact is unselected.
   * Hides the checked icon, shows the unchecked icon, removes the contact from the selection array,
   * and updates the chosen contacts UI.
   * 
   * 
   * @param {SVGElement} checked – The SVG icon representing the "checked" state.
   * @param {SVGElement} unchecked – The SVG icon representing the "unchecked" state.
   * @param {string} initial – The initial of the contact's name.
   * @param {string} bg – The background color or image identifier for the contact icon.
   * @param {string} name – The name of the clicked contact.
   * @returns {void}
   */
  function runIfNotSelected(checked, unchecked, initial, bg, name) {
    checked.style.display = "none";
    unchecked.style.display = "inline";
    deleteContactFromArray(initial, bg, name);
    visualizeChosenContacts();
  }
  
  
  /**
   * Renders all currently selected contacts into the chosen contacts UI box.
   * Displays each contact’s icon with background and initial, and shows the bubble indicator.
   * 
   * @returns {void}
   */
  function visualizeChosenContacts() {
    const container = document.getElementById("chosenContactsBox");
    container.innerHTML = "";
    const end = Math.min(startIndex + offsetIndex, chosenContacts.length);
    for (let i = 0; i < end; i++) {
      const contact = chosenContacts[i];
      container.innerHTML += generateBgAndInitialForChosenContactsBox(contact.bg, contact.initial);
    }
    showBubble();
  }
  
  
  /**
   * Displays a bubble showing how many more contacts are selected beyond the currently visible ones.
   * If the bubble already exists, it is removed and re-rendered based on the updated selection.
   * 
   * @returns {void}
   */
  function showBubble() {
    const container = document.getElementById('chosenContactsBox');
    const remainingContacts = chosenContacts.length - (startIndex + offsetIndex);
    const remainingCount = Math.max(remainingContacts, 0);
    const existingBubble = document.getElementById('moreContactsBubble');
    if (existingBubble) {
      existingBubble.remove();
    }
    if (remainingCount > 0) {
      container.insertAdjacentHTML('beforeend', generateMoreContactsBubble(remainingCount, 'add-task-bubble'));
    }
  }


/**
 * Updates the visible portion of chosen contacts by advancing the start index.
 * Renders the next chunk of contacts and scrolls the container to the end.
 * 
 * @returns {void}
 */
function showMoreChosenContacts() {
    const container = document.getElementById('chosenContactsBox');
    startIndex += offsetIndex;
    visualizeChosenContacts();
    container.scrollTo({left: container.scrollWidth, behavior: 'smooth'})
  }