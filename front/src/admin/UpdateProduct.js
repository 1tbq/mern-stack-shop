import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Layout from '../core/Layout';

import { isAuthenticated } from '../auth';
import { createProduct, getProduct, getCategories, updateProduct } from './apiAdmin';
import { Redirect } from 'react-router-dom';


const validationSchema = Yup.object().shape({
    photo: Yup.mixed().label('Photo'),
    name: Yup.string().label("Name"),
    description: Yup.string().label("Description"),
    price: Yup.number().min(1).max(1000).label("Price"),
    category: Yup.string().label("Category"),
    shipping: Yup.number().label("Shipping"),
    quantity: Yup.number().label("Quantity"),
});


const UpdateProduct = ({ match }) => {
    const [categories, setCategories] = useState();
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [error, setError] = useState('');
    const [formValues, setFormValues] = useState({
        _name: '',
        _description: '',
        _price: '',
        _category: '',
        _shipping: '',
        _quantity: '',
        _photo: '',
    });

    const [createdProduct, setCreatedProduct] = useState('');
    const { user, token } = isAuthenticated();
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>  {error} </div>
    );
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h4>Product {`${createdProduct}`} has been updated.</h4>
        </div>
    );

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const initCategories = () => {
        getCategories().then(data => {
            // console.log(data);
            setCategories(data);
        });
    }
    const init = (productId) => {
        getProduct(productId).then(data => {
            if (data.error) {
                setError(error)
            } else {
                initCategories();
                setFormValues({
                    _name: data.name,
                    _description: data.description,
                    _price: data.price,
                    _category: data.category,
                    _shipping: data.shipping,
                    _quantity: data.quantity
                })

            }
        })
    }
    const redirectUser = (params) => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/" />
            }
        }
    }

    return (
        <Layout
            title="Add New Product"
            description={`G'day ${user.name}! ready to make a new product`}
            className="container"
        >

            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showError()}
                    {showSuccess()}
                    {redirectUser()}
                    <Formik
                        enableReinitialize
                        initialValues={{
                            name: formValues._name,
                            description: formValues._description,
                            price: formValues._price,
                            category: formValues._category,
                            shipping: formValues._shipping,
                            quantity: formValues._quantity,
                            photo: formValues._photo,
                        }}
                        onSubmit={(values, { resetForm, }) => {
                            const formData = new FormData();
                            formData.append('name', values.name);
                            formData.append('description', values.description);
                            formData.append('price', values.price);
                            formData.append('category', values.category);
                            formData.append('shipping', values.shipping);
                            formData.append('quantity', values.quantity);
                            formData.append('photo', values.photo);
                            updateProduct(match.params.productId, user._id, token, formData)
                                .then(data => {
                                    if (data.error) {
                                        setError(data.error)
                                    } else {
                                        setCreatedProduct(data.name);
                                        setError('');
                                    }
                                    setRedirectToProfile(true);
                                })

                        }}
                        validationSchema={validationSchema}
                    >
                        {(formProps) => (
                            <Form>
                                <h4>Post Photo</h4>

                                <div className="form-group">
                                    <label htmlFor="photo" className="btn btn-secondary">
                                        <input
                                            onChange={(event) => { formProps.setFieldValue("photo", event.currentTarget.files[0]) }}
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            onBlur={() => formProps.setFieldTouched('photo')}
                                        />
                                    </label>
                                    {formProps.touched.photo && (<div className="alert-danger">{formProps.errors.photo}</div>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name" >Name</label>
                                    <input

                                        type="text"
                                        name="name"
                                        className="form-control"
                                        onChange={formProps.handleChange("name")}
                                        value={formProps.values.name}
                                        onBlur={() => formProps.setFieldTouched('name')}
                                    />
                                    {formProps.touched.name && (<div className="alert-danger">{formProps.errors.name}</div>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" >Description</label>
                                    <textarea
                                        type="text"
                                        name="description"
                                        className="form-control"
                                        onChange={formProps.handleChange("description")}
                                        value={formProps.values.description}
                                        onBlur={() => formProps.setFieldTouched('description')}
                                    />
                                    {formProps.touched.description && (<div className="alert-danger">{formProps.errors.description}</div>)}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="price" >Price</label>
                                    <input

                                        type="number"
                                        name="price"
                                        className="form-control"
                                        onChange={formProps.handleChange("price")}
                                        value={formProps.values.price}
                                        onBlur={() => formProps.setFieldTouched('price')}
                                    />
                                    {formProps.touched.price && (<div className="alert-danger">{formProps.errors.price}</div>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="categroy" >Category</label>
                                    <select
                                        name="category"
                                        className="form-control"
                                        onChange={formProps.handleChange("category")}
                                        value={formProps.values.category}
                                        onBlur={() => formProps.setFieldTouched('category')}
                                    >
                                        <option>Please Select</option>
                                        {categories &&
                                            categories.map((c, i) =>
                                                (<option key={i} value={c._id}>{c.name}</option>))
                                        }
                                    </select>
                                    {formProps.touched.category && (<div className="alert-danger">{formProps.errors.category}</div>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shipping" >Shipping</label>
                                    <select
                                        className="form-control"
                                        onChange={formProps.handleChange("shipping")}
                                        value={formProps.values.shipping}
                                        onBlur={() => formProps.setFieldTouched('shipping')}
                                    >
                                        <option>Please Select</option>
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                    {formProps.touched.shipping && (<div className="alert-danger">{formProps.errors.shipping}</div>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-control"
                                        value={formProps.values.quantity}
                                        onChange={formProps.handleChange("quantity")}
                                        onBlur={() => formProps.setFieldTouched('quantity')}
                                    />
                                    {formProps.touched.quantity && (<div className="alert-danger">{formProps.errors.quantity}</div>)}

                                </div>
                                <button type="submit" onSubmit={formProps.handleSubmit} className="btn btn-outline-primary">Update Product</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout >
    );
}
export default UpdateProduct;



