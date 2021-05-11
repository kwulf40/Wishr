if (window.location.href.indexOf("amazon.com") > -1) {
    pageInfo = ""
    pageInfo += document.getElementsByTagName('title')[0].text + " | "
    pageInfo += window.location.href + " | ";
    pageInfo += document.getElementById('landingImage').getAttribute("src") + " | ";
    pageInfo += "Amazon" + " | ";
    pageInfo += document.getElementById('priceblock_ourprice').textContent;
}
