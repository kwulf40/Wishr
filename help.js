/**
 * help.js is a simple script to show the help box in wishlist.html
 */

var helpButton = document.getElementById('getHelp');
var helpModal = document.getElementById('helpDialog')

helpButton.addEventListener('click', () => {
    helpModal.showModal();
})