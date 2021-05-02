
window.onload = function() {
    username = ''

    chrome.storage.local.get(['username'], function(response){
        if (chrome.runtime.lastError) return false;
        else {
            username = response.username;
        }

        if (username.length > 0){
            chrome.runtime.sendMessage({message: 'getWishlist', payload: {username}}, function (response){
                if (response.length > 100){
                    console.log('Retrieve Wishlist')
                    parser = new DOMParser();
                    temp = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + response
                    xmlDoc = parser.parseFromString(temp, "text/xml");

                    var i;
                    var listItems = xmlDoc.getElementsByTagName('listitem');
                    var html = '';
                    for (i = 0; i < listItems.length; i++) { 
                        // build the HTML for the image and name text
                        console.log(listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue)
                        html += "<div class=\"item\">" + "    <p>" + listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"PrimeURL\">" + "    <a href =" + "\"" + listItems[i].getElementsByTagName('itemURL')[0].childNodes[0].nodeValue + "\"" + ">" + "Item Url" + "</a>";
                        html += "<div class=\"MainRetailer\">" + "    <p>" + listItems[i].getElementsByTagName('mainRetailer')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"MainPrice\">" + "    <p>" + listItems[i].getElementsByTagName('mainPrice')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"SecondURL\">" + "    <a href =" + "\"" + listItems[i].getElementsByTagName('secondaryURL')[0].childNodes[0].nodeValue + "\"" + ">" + "Item Url" + "</a>";
                        html += "<div class=\"SecondRetailer\">" + "    <p>" + listItems[i].getElementsByTagName('secondaryRetailer')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"SecondPrice\">" + "    <p>" + listItems[i].getElementsByTagName('secondaryPrice')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"ThirdURL\">" + "    <a href =" + "\"" + listItems[i].getElementsByTagName('tertiaryURL')[0].childNodes[0].nodeValue + "\"" + ">" + "Item Url" + "</a>";
                        html += "<div class=\"ThirdRetailer\">" + "    <p>" + listItems[i].getElementsByTagName('tertiaryRetailer')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                        html += "<div class=\"ThirdPrice\">" + "    <p>" + listItems[i].getElementsByTagName('tertiaryPrice')[0].childNodes[0].nodeValue + "</p>" + "</div>";
                    }
                    console.log(html)
                    document.getElementById("items").innerHTML = html;
                    console.log(xmlDoc)
                }
                else{
                    console.log("Wishlist Retrieval Failed")
                    console.log(response)
                    }
            });
        }
    })
}