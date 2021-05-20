/**
 * createAccount script
 * When this script is called by createAccount.html, the script will retrieve the
 * input username and password, and pass the credentials to background.js to be passed to the 
 * server.
 * 
 * The data is then stored in the database, a new account is creaated, and a success message 
 * is passed back to this script.
 */
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    errorCheck = 0
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    if (username.indexOf("\'") > -1) {
        errorCheck = 1
        console.log("Illegal Char in username");
    }
    if (username && password && errorCheck != 1){
        chrome.runtime.sendMessage({message: 'createAccount', payload: {username, password}}, function (response){
            if (response === 'success') console.log('New Account Created');
            else {
                console.log("Account Creation failed");
            }
        });
    }
});