chrome.runtime.onMessage.addListener(function (request) {
    var urlList = ["Amazon.com", "Walmart.com", "Target.com", "Walmart", ".com"];
    var htmlText = document.getElementsByTagName('title')[0].text;

	if(htmlText)
	{
        htmlText = cleanURL(urlList, htmlText);
        console.log("test")
        if (htmlText){
		    alert(htmlText)
            console.log(htmlText)
            console.log("test2")
        }
	}

    function cleanURL(urlListIn, inText){
        var cleanString = inText;
        for (var i = 0; i < urlListIn.length; i++){
            cleanString = cleanString.replace(urlListIn[i], "");
        }
        return cleanString;
    }
})