if (window.location.href.indexOf("amazon.com") > -1) {
        amazonDataRetrieve()
}

function amazonDataRetrieve(){
        pageInfo = ""
        itemName = document.getElementsByTagName('title')[0].text + " | "
        pageInfo += itemName;
        pageInfo += window.location.href + " | ";
        pageInfo += document.getElementById('landingImage').getAttribute("src") + " | ";
        pageInfo += "Amazon" + " | ";
        var itemPrice = document.getElementById('priceblock_ourprice')
        if (typeof(itemPrice) != 'undefined' && itemPrice != null){
            itemPrice = document.getElementById('priceblock_ourprice').innerHTML;
            pageInfo += itemPrice;
        }
        else{
            itemPrice = document.getElementById('priceblock_dealprice').innerHTML;
            pageInfo += itemPrice;
        }
        return pageInfo;
}