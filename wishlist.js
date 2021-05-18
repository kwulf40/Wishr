/**
 * wishlist.js
 * wishlist.js runs on the page load of wishlist.html.
 * This function sends a message to the server to retrieve a users wishlist, 
 * parses the incoming XML to a string, then adds HTML headers, delete buttons, and listners.
 * This HTML forms the user's wishlist that is appended to the id="items" in wishlist.html.
 * Prints an error message if the wishlist fails to be retrieved.
 * 
 * The function called by an item's delete button in the wishlist, deleteItem() shows 
 * a confirmation screen, and on confirmation from the user, binds the item's index value to the onClose()
 * function that runs when confirmation modal is closed.
 * 
 * onClose() checks that the user confirmed the deletion, and if so, sends the item index number to the server
 * to be deleted in the database. On success, an additional modal will be shown for successful deletion acknowledgment,
 * and the wishlist is refreshed after the acknowledgment is closed.
 * On fail, a message is logged to the console.
 */
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
    itemID = this.id;
    console.log(itemID);
    var delDialog = document.getElementById('deleteDialog');

    delDialog.showModal();

    delDialog.addEventListener('close', onClose.bind(this));
}

function onClose(){
    var delDialog = document.getElementById('deleteDialog');
    var delConfirmDialog = document.getElementById('delConfirmDialog');
    console.log(this)
    if(delDialog.returnValue == "true"){
        console.log("Delete: " + itemID);
        var delNum = itemID.replace(/\D/g, "");
        chrome.storage.local.get('username', function (response) {
            username = response.username
            chrome.runtime.sendMessage({message: 'deleteItem', payload: {username, delNum}}, function (response){
                if (response === 'success'){
                    console.log('Delete Successful');
                    delConfirmDialog.showModal();
                    delConfirmDialog.addEventListener('close', function onAddedClose(){
                        document.location.reload(true);
                    });
                }
                else {
                    console.log("Delete Failed");
                }
            })
        })
    }
}