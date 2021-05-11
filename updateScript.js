const addToListButton = document.getElementById("AddToWishlist");

addToListButton.addEventListener('click', () =>{

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        //console.log(tabs[0]);
        chrome.tabs.executeScript(tabs[0].id,{
            code: 'document.getElementsByTagName(\'title\')[0].text'
        },receiveText);
    });
    
            //pageURL = response.url
            //console.log(response.document)
            //console.log(response.url)
            //pageString = new XMLSerializer().serializeToString(response)
            //console.log(pageString)



        //});
});

function cleanURL(urlListIn, inText){
    var cleanString = inText.split(":");
    
for (var i = 0; i < cleanString.length; i++){
    for (var j = 0; j < urlListIn.length; j++){
        cleanString[i] = cleanString[i].replace(urlListIn[j], "");
    }
}
    return cleanString;
}

function receiveText(response){
    console.log(response[0])
    var urlList = ["Amazon.com", "Walmart.com", "Target.com", "Walmart", ".com"];
    var htmlText = response[0];
    var cleanTextArray = []

    //console.log(htmlText)

    if(htmlText)
    {
        cleanTextArray = cleanURL(urlList, htmlText);
        if (cleanTextArray){
            for(var i = 0; i < cleanTextArray.length; i++){
            //alert(cleanTextArray[i]);
            console.log(cleanTextArray[i]);
            //console.log("test" + i);
            }
        }
    }
    //console.log(resultsArray[0]);
}