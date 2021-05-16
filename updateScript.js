const addToListButton = document.getElementById("AddToWishlist");

addToListButton.addEventListener('click', () =>{

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        //console.log(tabs[0]);
        chrome.tabs.executeScript(tabs[0].id,{
            file: "/dataRetrieve.js"
        },receiveText);
    });
});



function receiveText(response){
    
    console.log(response[0])
    var urlList = ["Amazon.com", "Walmart.com", "Target.com"];
    var htmlText = response[0];
    var cleanTextArray = []

    if(htmlText)
    {
        cleanTextArray = cleanURL(urlList, htmlText);
        if (cleanTextArray){
            for(var i = 0; i < cleanTextArray.length; i++){
            console.log(cleanTextArray[i]);
            }
        }
    }
    itemName = cleanTextArray[0].substring(0,47).trim()
    itemName = itemName.replace(/[^\x00-\x7F]|&|:|'|\"|/g, "")
    shortItemName = "<listitem>Item<itemName>"+itemName+"..."+"</itemName>"
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
            if (response === 'success'){
                console.log('Update Successful');
                alert("Added to Wishlist!");
                document.location.reload(true);
            }
            else {
                console.log("Update Failed: Something on the webpage you're adding is causing an issue, please forward the url to the extenstion group.");
            }
        })
    })
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