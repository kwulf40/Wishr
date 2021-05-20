/**
 * loginScript
 * This script first checks if the user has already logged in, and takes them to wishlist.html if they have.
 *
 * If not, this script is called on a "submit" event andthe script will retrieve the
 * input username and password, and pass the credentials to background.js to be authenticated by the 
 * server.
 * 
 * If the data is authenticated successfully, send a login successful message to console and the user is 
 * taken to wishlist.html
 */
chrome.runtime.sendMessage({message: 'userStatus'}, function (response){
    if (response === true){
        window.location.href = "wishlist.html";
    }
})

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
        chrome.runtime.sendMessage({message: 'login', payload: {username, password}}, function (response){
            if (response === 'success'){
                console.log('Login Successful');
                window.location.href = "wishlist.html";
            }
            else {
                console.log("Login Failed");
            }
        });
    }
    else{
        console.log("Please Enter a Username and Password");
    }
})