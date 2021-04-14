/**
 * createAccount script
 * When this script is called on a "submit" event, the script will retrieve the
 * input username and password, and pass the credentials to background.js to be passed to the 
 * server.
 * 
 * The data is then stored in the database, a new account is creaated, and a success message 
 * is passed back to this script.
 */
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password){
        chrome.runtime.sendMessage({message: 'createAccount', payload: {username, password}}, function (response){
            if (response === 'success') console.log('New Account Created');
            else {
                console.log("Account Creation failed");
            }
        });
    }
});