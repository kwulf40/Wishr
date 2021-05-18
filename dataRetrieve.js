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

function amazonDataRetrieve(){
    pageInfo = ""
    pageInfo += document.getElementsByTagName('title')[0].text + " | "
    pageInfo += window.location.href + " | ";
    pageInfo += document.getElementById('landingImage').getAttribute("src") + " | ";
    pageInfo += "Amazon" + " | ";
    var itemPrice = document.getElementById('priceblock_ourprice')
    var itemPrice2 = document.getElementById('priceblock_dealprice')
    var itemPrice3 = document.getElementById('priceblock_saleprice')
    if (typeof(itemPrice) != 'undefined' && itemPrice != null){
        itemPrice = document.getElementById('priceblock_ourprice').innerHTML;
        pageInfo += itemPrice;
    }
    else if (typeof(itemPrice2) != 'undefined' && itemPrice2 != null){
        itemPrice = document.getElementById('priceblock_dealprice').innerHTML;
        pageInfo += itemPrice;
    }
    else if (typeof(itemPrice3) != 'undefined' && itemPrice3 != null){
        itemPrice = document.getElementById('priceblock_saleprice').innerHTML;
        pageInfo += itemPrice;
    }
    return pageInfo;
}

function walmartDataRetrieve(){
    pageInfo = ""
    pageInfo += document.getElementsByTagName('h1')[0].innerHTML + " | "
    pageInfo += window.location.href + " | ";
    var itemImage = document.getElementsByClassName("hover-zoom-hero-image")[0];
    if (typeof(itemImage) != 'undefined' && itemImage != null){
        itemImage = document.getElementsByClassName("hover-zoom-hero-image")[0].getAttribute('srcset');
        itemImage = itemImage.replace('/', "").replace('/', "").split(" ");
        tempItemImage = itemImage[0].split("?");
        finalItemImage = "http://" + tempItemImage[0]
        pageInfo += finalItemImage + " | ";
    }
    else{
        itemImage = document.getElementsByClassName("prod-hero-image-image")[0].getAttribute('srcset');
        itemImage = itemImage.replace('/', "").replace('/', "").split(" ");
        tempItemImage = itemImage[0].split("?");
        finalItemImage = "http://" + tempItemImage[0]
        pageInfo += finalItemImage + " | ";
    }
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
    pageInfo = ""
    pageInfo += document.getElementsByTagName('h1')[0].innerText + " | "
    pageInfo += window.location.href + " | ";
    /*I want to personally thank Target.com for this incredibly obtuse line of code, 
    this was the way I could acquire the primary product image in the least steps.*/
    pageInfo += document.getElementsByClassName('ZoomedImage__Zoomed-sc-1j8d1oa-0 dmkiKr')[0].previousElementSibling.getAttribute('src') + " | ";
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