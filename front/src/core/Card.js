import React, { useState } from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import { addItem, removeItem, updateItem } from './cartHelpers';
import cartContext from '../context/cart-context';

const Card = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = f => f, // default value of function
    run = undefined // default value of undefined
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const addToCart = (params) => {
        addItem(product, () => {
            setRedirect(true)
        });
    }
    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to='/cart' />
        }
    }
    const AddToCartButton = (params) => {
        return (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">Add to Cart</button>
        )
    }
    const showStock = (quantity) => {
        return quantity > 0
            ? <span className="badge badge-primary badge-pill">In Stock</span>
            : <span className="badge badge-primary badge-pill" >Out of Stock</span>
    }

    const handleChange = (productId) => (event) => {
        setRun(!run); // run useEffect in parent Cart
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value)
        }
    }

    const removeButton = () => (
        <button className="btn btn-outline-danger mt-2 mb-2"
            onClick={() => {
                removeItem(product._id); setRun(!run); /**
             *  run useEffect in parent Cart
             */ }}
        >
            Remove Product
        </button>
    );


    const showCartUpdateOptions = () => (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">Adjust Quantity</span>
                <input
                    type="number"
                    className="form-control"
                    value={count}
                    onChange={handleChange(product._id)}
                />
            </div>
        </div>
    )


    return (
        <cartContext.Consumer>
            {(context) => (
                <div className="card" >
                    {/* {JSON.stringify(context)} */}
                    <div className="card-header name">{product.name}</div>
                    <div className="card-body">
                        {shouldRedirect(redirect)}
                        <ShowImage item={product} url="product" />
                        <p className='lead mt-2'>{product.description.substring(0, 100)}</p>
                        <p className='black-10'>${product.price}</p>
                        <p className="black-9">Category: {product.category && product.category.name}</p>
                        <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>
                        {showViewProductButton && <Link to={`/product/${product._id}`}><button className="btn-primary mt-2 mb-2">View Product</button> </Link>}
                        {showStock(product.quantity)}
                        <br />
                        {showAddToCartButton && AddToCartButton()}
                        {showRemoveProductButton && removeButton()}
                        {cartUpdate && showCartUpdateOptions()}
                    </div>
                </div >
            )}
        </cartContext.Consumer>
    )
}

export default Card;

