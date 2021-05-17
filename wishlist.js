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
                    var headers = '<tr><th style="padding-left: 5px">Image</th><th style="padding-left: 10px; padding-right: 10px;">Item</th><th style="padding-left: 15px; text-align:center;">Retailer</th><th style="padding-left: 20px; text-align:right;">Price</th><th style="padding-left: 20px;"></th></tr>'
                    html += headers;
                    listNum = 1;
                    for (i = 0; i < listItems.length; i++) { 
                        // build the HTML for the image and name text
                        console.log(listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue)
                        html += "<tr><td class=\"itemImage\"><img class=\"listImage\" src = " +listItems[i].getElementsByTagName('imageURL')[0].childNodes[0].nodeValue +"></img></td>";
                        html += `<td class="item"><a href = "${listItems[i].getElementsByTagName('itemURL')[0].childNodes[0].nodeValue}" target="_blank">${listItems[i].getElementsByTagName('itemName')[0].childNodes[0].nodeValue}</a></td>`;
                        html += "<td class=\"retailer\">"  + listItems[i].getElementsByTagName('mainRetailer')[0].childNodes[0].nodeValue + "</td>";
                        html += "<td class=\"price\">" + listItems[i].getElementsByTagName('mainPrice')[0].childNodes[0].nodeValue + "</td>";
                        html += "<td><button class=\"deleteButton\" id=\"Item" + listNum + "\">&times;</button></td></tr>"
                        listNum += 1;
                    }
                    html += "</tbody></table>"
                    document.getElementById("items").innerHTML = html;

                    //setting up the delete item script
                    delButtons = document.getElementsByClassName("deleteButton")
                    var j;
                    for (j = 0; j < (listNum - 1); j++){
                        delButtons[j].addEventListener("click", deleteItem, false)
                    }
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

function deleteItem(){
    event.preventDefault();

    iosCheck = iOS();
    if (iosCheck === false){
        var delCheck = window.confirm("Delete this item?")
    }
    else{
        var delCheck = window.confirm2("Delete this item?")
    }

    console.log(delCheck)
    if(delCheck === true){
        console.log("Delete: " + this.id);
        var delNum = this.id.replace(/\D/g, "");
        chrome.storage.local.get('username', function (response) {
            username = response.username
            chrome.runtime.sendMessage({message: 'deleteItem', payload: {username, delNum}}, function (response){
                if (response === 'success'){
                    console.log('Delete Successful');
                    alert("Item Deleted!");
                    document.location.reload(true);
                }
                else {
                    console.log("Delete Failed");
                }
            })
        })
    }
}

function iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

window.confirm2 = function (message) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var alertFrame = window.frames[0];
    var result = alertFrame.window.confirm(message);
    iframe.parentNode.removeChild(iframe);
    return result;
};