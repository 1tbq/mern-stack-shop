import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import { isAuthenticated } from '../auth';
import { createOrder, getBraintreeClientToken, processPayment } from './apiCore';
import { emptyCart } from './cartHelpers';
import cartContext from '../context/cart-context';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    useEffect(() => {
        getToken(userId, token)
    }, [])
    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setData({ ...data, error: data.error })
            } else {
                setData({ clientToken: data.clientToken })
            }
        })
    }
    const getTotal = () => {
        return products.reduce((accumulator, p) => {
            return accumulator + p.count * p.price;
        }, 0)
    };
    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
                <Link to='signin'>
                    <button className='btn btn-primary'>
                        Sign in to checkout
            </button>
                </Link>
            )
    }

    const buy = () => {
        setData({ loading: true });
        //send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(nonceData => {
                nonce = nonceData.nonce;
                //once we have nonce (card type, card number) send nonce as 'PaymentMethodNonce'
                //also total to be charged
                // console.log('send nonce and total to procees', nonce, getTotal(products))
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }
                processPayment(userId, token, paymentData)
                    .then(response => {

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: data.address
                        }

                        createOrder(userId, token, createOrderData);


                        setData({ ...data, success: response.success });
                        emptyCart(() => {
                            setRun(!run); // run useEffect in parent Cart
                            console.log('payment success and empty cart');
                            setData({
                                loading: false,
                                success: true
                            });
                        })
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => {
                // console.log('dropin error', error);
                setData({
                    ...data,
                    error: error.message,
                    loading: false,
                });
            })
    };
    const handleAddress = event => {
        setData({ ...data, address: event.target.value })
    }
    const showDropIn = () => (
        /**
         * on blur means when you click any where on the page
         * here it clears the error message 
         */
        <div onBlur={() => setData({ ...data, error: '', })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery Address</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type you delivery address here"
                        ></textarea>
                    </div>


                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: 'vault'
                            }
                        }}
                        onInstance={(instance) => (data.instance = instance)}
                    />
                    <button onClick={buy} className={'btn btn-success btn-block'} >Checkout</button>
                </div>
            ) : null}
        </div>
    );
    const showError = (error) => (
        <div className="alert alert-danger"
            style={{ display: error ? '' : 'none' }}
        >
            {error}
        </div>
    );
    const showSuccess = (success) => (
        <div className="alert alert-info"
            style={{ display: success ? '' : 'none' }}
        >
            <p>Your payment has processed successfuly</p>
        </div>
    );
    const showLoading = (loading) => (
        loading && <h2>Loading...</h2>
    )

    return (
        <cartContext.Consumer >
            {(context) => (
                <div>
                    {/* {JSON.stringify(context)} */}
                    <h2>Total: ${getTotal()}</h2>
                    {showLoading(data.loading)}
                    {showSuccess(data.success)}
                    {showError(data.error)}
                    {showCheckout()}
                </div>
            )}
        </cartContext.Consumer>
    )
}

export default Checkout;