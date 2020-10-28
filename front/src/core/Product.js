import React, { useEffect, useState } from 'react'
import Layout from './Layout';
import { listRelated, readProduct } from './apiCore';
import Card from './Card';

const Product = (props) => {
    const [product, setProduct] = useState([]);
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = productId => {
        readProduct(productId).then((data) => {
            if (data.error) {
                setError(data.error)
            } else {
                setProduct(data);
                //fetch related product
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError(data.error)
                    } else {
                        setRelatedProduct(data)
                    }
                })
            }
        })
    }



    useEffect(() => {
        //we get the product id in prams because we are using react-router-dom
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
        //whenever the id in the add changes re run the useEffect
    }, [props])

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0, 100)}
            className='container'
        >
            <div className="row">
                <div className="col-8">
                    {
                        product && product.description &&
                        <Card product={product} showViewProductButton={false} />
                    }
                </div>
                <div className="col-4">
                    <h4>Related Products </h4>
                    {relatedProduct.map((p, i) => (
                        <div key={i} className="mb-3">
                            <Card product={p} />
                        </div>
                    ))}
                </div>

            </div>
        </Layout>
    )
}

export default Product;