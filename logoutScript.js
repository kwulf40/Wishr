/**
 * logoutScript
 * When this script is called by the clicking of a logout button,
 * a logout message is sent to background.js to log the user out,
 * returning them to the login page.
 * 
 */
const logoutButton = document.getElementById("Logout");

logoutButton.addEventListener('click', event => {
    event.preventDefault();
    chrome.runtime.sendMessage({message: 'logout'}, function (response){
        if (response === 'success'){
            console.log('Logout Successful');
            window.location.href = "login.html"
        } 
    });
});