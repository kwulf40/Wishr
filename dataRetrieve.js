/**
 * dataRetrieve.js
 * This script is injected by updateScript.js into the currently open primary webpage.
 * This script is responsible for taking a retail item and getting the info needed to store
 * it within a wishlist.
 * 
 * First, the script checks the url of the page, and runs the html scrape script depending on the url.
 * 
 * Then, the corresponding function is called to get the item information based on the layout of the page
 * of the specified retailer.
 * 
 * Finally, this function returns the item information back
 */

if (window.location.href.indexOf("amazon.com") > -1) {
    amazonDataRetrieve()
}
else if (window.location.href.indexOf("walmart.com") > -1){
    walmartDataRetrieve()
}
else if (window.location.href.indexOf("target.com") > -1){
    targetDataRetrieve()
}
else if (window.location.href.indexOf("ebay.com") > -1){
    ebayDataRetrieve()
}

function amazonDataRetrieve(){
    pageInfo = ""
    itemName = document.getElementsByTagName('title')[0].text
    pageInfo += itemName.replace(/\|/g, '&') + " | "
    pageInfo += window.location.href + " | ";
    itemImage = document.getElementById('landingImage');
    itemImage2 = document.getElementById('gc-standard-design-image')
    if (typeof(itemImage) != 'undefined' && itemImage != null){
        finalImage = document.getElementById('landingImage').getAttribute("src") + " | ";
    }
    else if (typeof(itemImage2) != 'undefined' && itemImage2 != null){
        finalImage = document.getElementById('gc-standard-design-image').getAttribute("src") + " | ";
    }
    pageInfo += finalImage;
    pageInfo += "Amazon" + " | ";
    var itemPrice = document.getElementById('priceblock_ourprice')
    var itemPrice2 = document.getElementById('priceblock_dealprice')
    var itemPrice3 = document.getElementById('priceblock_saleprice')
    var itemPrice4 = document.getElementsByClassName('a-color-price a-text-bold')[0]
    if (typeof(itemPrice) != 'undefined' && itemPrice != null){
        finalPrice = document.getElementById('priceblock_ourprice').innerHTML;
    }
    else if (typeof(itemPrice2) != 'undefined' && itemPrice2 != null){
        finalPrice = document.getElementById('priceblock_dealprice').innerHTML;
    }
    else if (typeof(itemPrice3) != 'undefined' && itemPrice3 != null){
        finalPrice = document.getElementById('priceblock_saleprice').innerHTML;
    }
    else if (typeof(itemPrice4) != 'undefined' && itemPrice4 != null){
        finalPrice = document.getElementsByClassName('a-color-price a-text-bold')[0].innerHTML;
    }
    pageInfo += finalPrice;
    return pageInfo;
}

function walmartDataRetrieve(){
    pageInfo = ""
    itemName = document.getElementsByTagName('h1')[0].innerHTML + " | ";
    pageInfo +=  itemName.replace(/\|/g, '&');
    pageInfo += window.location.href + " | ";
    var itemImage = document.getElementsByClassName("hover-zoom-hero-image")[0];
    if (typeof(itemImage) != 'undefined' && itemImage != null){
        itemImage = document.getElementsByClassName("hover-zoom-hero-image")[0].getAttribute('srcset');
    }
    else{
        itemImage = document.getElementsByClassName("prod-hero-image-image")[0].getAttribute('srcset');
    }
    itemImage = itemImage.replace('/', "").replace('/', "").split(" ");
    tempItemImage = itemImage[0].split("?");
    finalItemImage = "http://" + tempItemImage[0]
    pageInfo += finalItemImage + " | ";
    pageInfo += "Walmart" + " | ";
    var itemPrice = "";
    itemPrice += document.getElementsByClassName("price-currency")[0].innerHTML.toString()
    itemPrice += document.getElementsByClassName("price-characteristic")[0].innerHTML.toString()
    itemPrice += document.getElementsByClassName("price-mark")[0].innerHTML.toString()
    itemPrice += document.getElementsByClassName("price-mantissa")[0].innerHTML.toString()
    pageInfo += itemPrice;
    return pageInfo;
}

function targetDataRetrieve(){
    pageInfo = "";
    itemName = document.getElementsByTagName('h1')[0].innerText;
    pageInfo +=  itemName.replace(/\|/g, '&') + " | ";
    pageInfo += window.location.href + " | ";
    itemImage = document.getElementsByClassName("slideDeckPicture")[1]
    itemImage2 = document.getElementsByClassName('ZoomedImage__Zoomed-sc-1j8d1oa-0 dmkiKr')[0]
    itemImage3 = document.getElementsByClassName("slideDeckPicture")[0]
    if (typeof(itemImage) != 'undefined' && itemImage != null){
        /*I want to personally thank Target.com for this incredibly obtuse line of code, 
        this was the way I could acquire the primary product image in the least steps.*/
        finalImage = document.getElementsByClassName("slideDeckPicture")[1].firstElementChild.firstElementChild.firstElementChild.firstElementChild.getAttribute('src') + " | ";
    }
    else if (typeof(itemImage2) != 'undefined' && itemImage2 != null){
        finalImage = document.getElementsByClassName('ZoomedImage__Zoomed-sc-1j8d1oa-0 dmkiKr')[0].previousElementSibling.getAttribute('src') + " | ";
    }
    else if (typeof(itemImage2) != 'undefined' && itemImage2 != null){
        finalImage = document.getElementsByClassName("slideDeckPicture")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.getAttribute('src') + " | ";
    }
    pageInfo += finalImage;
    pageInfo += "Target" + " | ";
    var itemPrice = "";
    var divArray = document.getElementsByTagName('div')
    var i;
    for (i = 0; i < divArray.length; i++){
        findPrice = divArray[i].getAttribute('data-test')
        if (findPrice === "product-price"){
            itemPrice = divArray[i].innerText
        }
    }
    pageInfo += itemPrice;
    return pageInfo;
}

function ebayDataRetrieve(){
    pageInfo = ""
    itemName = document.getElementById("itemTitle").innerText
    itemName = itemName.split('\n');
    fullName = itemName[1].replace(/\|/g, '&');;
    pageInfo += fullName + " | ";
    pageInfo += window.location.href + " | ";
    pageInfo += document.getElementById('icImg').getAttribute('src') + " | ";
    pageInfo += "Ebay" + " | "
    var itemPrice = document.getElementById("prcIsum");
    if (typeof(itemPrice) != 'undefined' && itemPrice != null){
        itemPrice = document.getElementById("prcIsum").innerText
    }
    else {
        itemPrice = document.getElementById('prcIsum_bidPrice').innerText;
    }
    itemPrice = itemPrice.split(' ');
    finalPrice = itemPrice[1];
    pageInfo += finalPrice;
    return pageInfo;
}