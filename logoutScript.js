/**
 * logoutScript
 * When this script is called by the clicking of a logout button,
 * a logout message is sent to background.js to log the user out.
 * 
 * NOT CURRENTLY TESTED UNDER NEWEST STRUCTURE CHANGES
 */
const logoutButton = document.getElementById("Logout");

logoutButton.addEventListener('click', () =>{
    chrome.runtime.sendMessage({message: 'logout'}, function (response){
        if (response === 'success') console.log('Logout Successful');
    });
});