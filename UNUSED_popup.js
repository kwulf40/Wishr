document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('WishButton').addEventListener('click', addToList, false)

    function addToList () {
        chrome.tabs.query({currentWindow: true, active: true},
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, 'Added to Wishlist!')
            })
    }
}, false)