let signedIn = false;

function modifyUserStatus(statusBool, userInfo){
    if (statusBool){
        return fetch('https://wishr.loca.lt/login', {
            method: 'GET',
            headers: {
                'AuthToken': 'Input ' + btoa(`${userInfo.username}:${userInfo.password}`)
            }
        })
        .then(response => {
            return new Promise (resolve => {
                if (response.status !== 200) resolve ('fail');

                chrome.storage.local.set({userStatus: statusBool, userInfo}, function(response){ /*need to hash password*/
                    if (chrome.runtime.lastError) resolve('fail');

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
                if (chrome.runtime.lastError) resolve ('fail');

                if (response.userStatus === undefined) resolve ('fail');

                fetch('https://wishr.loca.lt/logout', {
                    method: 'GET',
                    headers: {
                        'AuthToken' : 'Basic' + btoa(`${response.userInfo.username}:${response.userInfo.password}`)
                    }
                })
                .then (response => {
                    if (response.status !== 200) resolve ('fail');

                    chrome.storage.local.set({userStatus: statusBool, userInfo: {} }, function (response){
                        if (chrome.runtime.lastError) resolve ('fail');

                        signedIn = statusBool;
                        resolve ('success');
                    })
                })
                .catch(error => console.log(error));
            });
        });
    }
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

    }
});