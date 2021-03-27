document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password){
        chrome.runtime.sendMessage({message: 'login', payload: {username, password}}, function (response){
            if (response === 'success') console.log('Login Successful');
            else {
                console.log("fail");
            }
        });
        
    }
    else{
        console.log("test2");
    }
})