const addToListButton = document.getElementById("AddToWishlist");

addToListButton.addEventListener('click', () =>{
    chrome.windows.getCurrent(function(currentTab) {
        chrome.tabs.getSelected(currentTab.id,
        function(response) {
            pageURL = response.url
            //console.log(response.document)
            console.log(response.url)
            pageString = new XMLSerializer().serializeToString(response)
            console.log(pageString)

            var urlList = ["Amazon.com", "Walmart.com", "Target.com", "Walmart", ".com"];
            var htmlText = response.document.getElementsByTagName('title')[0].text;
            var cleanTextArray = []

            if(htmlText)
            {
                cleanTextArray = cleanURL(urlList, htmlText);
                if (cleanTextArray){
                    for(var i = 0; i < cleanTextArray.length; i++){
                    //alert(cleanTextArray[i]);
                    console.log(cleanTextArray[i]);
                    console.log("test" + i);
                    }
                }
            }

        });
    })
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