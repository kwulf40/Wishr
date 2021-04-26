/**
 * The background.js file that controls the background scripting of the extension.
 * This script is in charge of passing data between the extension and the Node.js server.
 */

//Variable that can be called to find the current log in status of the user
let signedIn = false;

/**
 * modifyUserStatus is the script function that communicates user input credentials 
 * with the NodeJS server to perform login or logout functions
 * 
 * @param {*} statusBool statusBool determines whether the user is logged in or out of the extension
 * @param {*} userInfo the passed in Username and Password payload sent from loginScript or logoutScript
 * @returns a resolve response, a failure if the login or logout functions fail, or a 'success' resolve to loginScript or logoutScript
 */
function modifyUserStatus(statusBool, userInfo){

    if (statusBool){
        //Retrieve the input credentials from this URL
        return fetch('https://wishr.loca.lt/loginCheck', {
            method: 'GET',
            headers: {
                'AuthToken': 'Input ' + btoa(`${userInfo.username}:${userInfo.password}`)
            }
        })
        //Promise.then, function callback that resolves to failure if an error is encountered, or to success on a successful sign in
        .then(response => {
            return new Promise (resolve => {
                if (response.status !== 200) resolve ('Response Status Failure');

                chrome.storage.local.set({userStatus: statusBool, userInfo}, function(response){
                    if (chrome.runtime.lastError) resolve('Data Storage Failure');

                    signedIn = statusBool;
                    resolve('success');
                });
            })
        })
        .catch(error => console.log(error))
    }
    //If statusBool is false, call this function for logout
    else if (!statusBool){
        return new Promise (resolve => {
            //checks if there is stored login information to ensure there is a logged in account to log out.
            chrome.storage.local.get(['userStatus', 'userInfo'], function (response) {
                if (chrome.runtime.lastError) resolve ('Data Retrieval Failure');

                if (response.userStatus === undefined) resolve ('No currently logged in user failure');

                fetch('https://wishr.loca.lt/logout', {
                    method: 'GET',
                    headers: {
                        'AuthToken' : 'Basic' + btoa(`${response.userInfo.username}:${response.userInfo.password}`)
                    }
                })
                .then (response => {
                    if (response.status !== 200) resolve ('Response Status Failure');

                    chrome.storage.local.set({userStatus: statusBool, userInfo: {} }, function (response){
                        if (chrome.runtime.lastError) resolve ('Data Write Failure');

                        signedIn = statusBool;
                        resolve ('success');
                    })
                })
                .catch(error => console.log(error));
            });
        });
    }
}
/**
 * createUserAccount takes user credentials and passes them to the NodeJS server that is then stored in the User Database
 * 
 * @param {*} userInfo The user credentials that will be stored in the database as the new account credentials
 * @returns a resolve response, success if the account is created or fail if an error is encountered
 */
function createUserAccount(userInfo){
    return fetch('https://wishr.loca.lt/createAcc', {
            method: 'GET',
            headers: {
                'AuthToken': 'Create ' + btoa(`${userInfo.username}:${userInfo.password}`)
            },
        })
        .then(response => {
            return new Promise (resolve => {
                if (response.status !== 200) resolve ('fail');
                else resolve('success');
            });
        })
        .catch(error => console.log(error));
}

function getWishlist(userInfo, sendResponse){
    url = 'https://wishr.loca.lt/wishlist/' + userInfo.username
    console.log(url)
    var wishXML = new XMLHttpRequest()
    wishXML.onreadystatechange = function(){
        if(wishXML.readyState === 4) {

            sendResponse(wishXML.responseXML);
        }
    }

    wishXML.open("GET", url);
    wishXML.send(userInfo.username);
}

/**
 * Background listener that receives messages from loginScript, logoutScript, or createAccount
 * to transmit data between the extension and the Node.Js server.
 * 
 * Functions are called and data is communicated based on the messages sent from the various extension scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'login'){
        modifyUserStatus(true, request.payload)
            .then(response => sendResponse(response))
            .catch(error => console.log(error));
        
        return true;
    }
    else if (request.message === 'getWishlist'){
        getWishlist(request.payload, sendResponse)
        return true;
    }
    else if (request.message === 'logout'){
        modifyUserStatus(false, null)
            .then(response => sendResponse(response))
            .catch(error => console.log(error));
        
        return true;
    }
    else if (request.message === 'createAccount'){
        createUserAccount(request.payload)
        .then(response => sendResponse(response))
        .catch(error => console.log(error));

        return true;
    }
    else if (request.message === 'userStatus'){
        sendResponse(signedIn);
        return true;
    }

});