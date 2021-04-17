

/**
 * Create a wishlist which stores items/products(Wishitem)
 */
class Wishlist
{
    /**
     * List to store wishlist items
     */
    productlist = [Wishitem];
    /**
     * 
     * @param {String} name product name
     */
    constructor(name)
    {
        this.name = name;
    }

    /**
     * Create new Wishitem,
     * add to productlist(List of Wishitems)
     * @param {TBD} temp variable is placeholder until we figure out how to pass through the product info
     * 
     */
    addToList(temp)
    {

        itemToAdd = new Wishitem(temp);
        productlist.add(itemToAdd);
    }


}

/**
 * Contains information about the product being added to the wishlist
 */
class Wishitem
{
    /**
     * 
     * @param {String} product name of item
     * @param {TBD} image picture of item 
     * @param {float} price cost of item
     * @param {float} desiredprice desired cost of item
     */
    constructor(product, image, price, desiredprice)
    {
        this.product = product;
        this.image = image;
        this.price = price;
        this.desiredprice;
    }


}
