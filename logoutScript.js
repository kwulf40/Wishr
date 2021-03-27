const logoutButton = document.getElementById("Logout");

logoutButton.addEventListener('click', () =>{
    chrome.runtime.sendMessage({message: 'logout'}, function (response){
        if (response === 'success') console.log('Logout Successful');
    });
});