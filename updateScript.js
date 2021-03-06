/**
 * updateScript.js
 * updateScript.js is activated by the star button on the Wishr wishlist.html UI.
 * 
 * On button click, the script first executes the dataRetrieve.js script in the webpage open behind the extension.
 * Once data has been retrieved from the page, the item name is first stripped of extra information to just the Item name.
 * Then the data is then assembled with the proper XML tags. The script gets the username from local storage,
 * and sends both the newly-formed XML and the user's username to the background script to be sent to the database.
 * 
 * On success, a success message is displayed to the user and wishlist.html is refreshed.
 */

const addToListButton = document.getElementById("AddToWishlist");
addToListButton.addEventListener('click', () =>{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id,{
            file: "/dataRetrieve.js"
        },receiveText);
    });
});

function receiveText(response){
    try{
        console.log(response[0])
        var urlList = ["Amazon.com", "Walmart.com", "Target.com"];
        var htmlText = response[0];
        var cleanTextArray = []

        if(htmlText)
        {
            cleanTextArray = cleanURL(urlList, htmlText);
            if (cleanTextArray){
                for(var i = 0; i < cleanTextArray.length; i++){
                console.log(cleanTextArray[i]);0
                }
            }
        }
        itemName = cleanTextArray[0].substring(0,40).trim();
        itemName = itemName.replace(/(amp;)/g, "and");
        itemName = itemName.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        itemName = itemName.replace(/[^\x00-\x7F]|\&|:|'|"|/g, "");
        let finalItemName = itemName.split(/( {2})+/g);
        console.log(finalItemName[0])
        shortItemName = "<listitem>Item<itemName>"+finalItemName[0]+"..."+"</itemName>"
        itemURL = "<itemURL><![CDATA["+cleanTextArray[1].trim()+"]]></itemURL>"
        console.log(itemURL)
        imageURL = "<imageURL><![CDATA["+cleanTextArray[2].trim()+"]]></imageURL>" 
        console.log(imageURL)
        retailer = "<mainRetailer>"+cleanTextArray[3].trim()+"</mainRetailer>"
        price = "<mainPrice>"+cleanTextArray[4].trim()+"</mainPrice></listitem>"

        newItemXML = shortItemName + itemURL + imageURL + retailer + price
        console.log(newItemXML)

        console.log("Sending To Wishlist...");
        chrome.storage.local.get('username', function (response) {
            username = response.username
        
            chrome.runtime.sendMessage({message: 'updateWish', payload: {username, newItemXML}}, function (response){
                var addedDialog = document.getElementById('itemAddedDialog');
                if (response === 'success'){
                    console.log('Update Successful');
                    addedDialog.showModal();
                    addedDialog.addEventListener('close', function onAddedClose(){
                        document.location.reload(true);
                    });

                }
                else {
                    var failDialog = document.getElementById('failConfirmDialog');
                    failDialog.showModal();
                    console.log("Update Failed: Something on the webpage you're adding is causing an issue, please forward the url to the extenstion group.");
                }
            })
        })
    }
    catch {
        var failDialog = document.getElementById('failConfirmDialog');
        failDialog.showModal();
        console.log("Update Failed: Something on the webpage you're adding is causing an issue, please forward the url to the extenstion group.");
    }
}

function cleanURL(urlListIn, inText){
    var cleanString = inText.split("|");
    
    for (var i = 0; i < cleanString.length; i++){
        for (var j = 0; j < urlListIn.length; j++){
            cleanString[i] = cleanString[i].replace(urlListIn[j], "");
        }
    }
    return cleanString;
}