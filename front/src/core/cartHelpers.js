export const addItem = (item, next) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.push({
            ...item,
            count: 1
        });

        /**
         * Remove duplicates
         * build and Array from new Set and turn it back into array using Array.From
         * so latter we can re-map it 
         * new set will only allow unique values in it
         * so pass the ids of earch object/product
         * if the loop tries to add the same value again, it will get ignored
         * ...with the array of ids we got on when first map() was used
         * run map() on it again and return the actual product from cart
         */


        // Step by Step
        // Grap all the Ids with Ist map
        // Throuh Set remove duplicates id's
        // Make an array of those id's
        // For each Id in array return the product  
        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id)
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        next();
    }
}
export const itemTotal = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')).length;
        }
    }
    return 0;
}
export const getCart = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'));
        }
    }
    return [];
}
export const updateItem = (productId, count) => {
    let cart = [];
    if (typeof window != 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.map((product, i) => {
            cart[i].count = count;
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}
export const removeItem = (productId) => {
    let cart = [];
    if (typeof window != 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.map((product, i) => {
            if (product._id === productId) {
                cart.splice(cart[i], 1)
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart;
}
export const emptyCart = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('cart');
        next()
    }

}
