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