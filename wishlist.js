
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
                    var html = '<table class=\"WishlistTable\"><tbody>';
                    var headers = '<tr><th style="padding-left: 100px; padding-right: 100px;">Item</th><th style="padding-left: 15px; text-align:center;">Retailer</th><th style="padding-left: 40px; text-align:right;">Price</th></tr>'
                    html += headers;
                    for (i = 0; i < listItems.length; i++) { 
                        // build the HTML for the image and name text
                        console.log(listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue)
                        html += `<tr><td class="item"><a href = "${listItems[i].getElementsByTagName('itemURL')[0].childNodes[0].nodeValue}" target="_blank">${listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue}</a></td>`;
                        html += "<td class=\"retailer\">"  + listItems[i].getElementsByTagName('mainRetailer')[0].childNodes[0].nodeValue + "</td>";
                        html += "<td class=\"price\">" + listItems[i].getElementsByTagName('mainPrice')[0].childNodes[0].nodeValue + "</td></tr>";
                        //html += "<div class=\"button\"><span class=\"close\">&times;</span></div>"
                    }
                    html += "</tbody></table>"
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