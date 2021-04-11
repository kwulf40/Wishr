let signedIn = false;

function modifyUserStatus(statusBool, userInfo){
    if (statusBool){
        return fetch('https://wishr.loca.lt/loginCheck', {
            method: 'GET',
            headers: {
                'AuthToken': 'Input ' + btoa(`${userInfo.username}:${userInfo.password}`)
            }
        })
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
    else if (!statusBool){
        return new Promise (resolve => {
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

function createUserAccount(userInfo){
    return fetch('https://wishr.loca.lt/createAcc', {
            method: 'GET',
            headers: {
                'AuthToken': 'Create ' + btoa(`${userInfo.username}:${userInfo.password}`)
            }
        })
        .then(response => {
            return new Promise (resolve => {
                if (response.status !== 200) resolve ('fail');
                else resolve('New account created');
            });
        })
        .catch(error => console.log('test3'));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'login'){
        modifyUserStatus(true, request.payload)
            .then(response => sendResponse(response))
            .catch(error => console.log(error));
        
        return true;
    }
    else if (request.message === 'logout'){
        modifyUserStatus(false, null)
            .then(response => sendResponse(response))
            .catch(error => console.log(error));
        
        return true;
    }
    else if (request.message === 'userStatus'){
        //
    }
    else if (request.message === 'createAccount'){
        createUserAccount(request.payload)
        .then(response => sendResponse(response))
        .catch(error => console.log(error));
    }
});