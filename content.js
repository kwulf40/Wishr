chrome.runtime.onMessage.addListener(function (request) {
    var htmlText = document.getElementsByTagName('title')[0].text;

	if(htmlText)
	{
		alert(htmlText)
        console.log(htmlText)
	}
})