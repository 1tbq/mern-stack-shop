import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Layout from '../core/Layout';

import { isAuthenticated } from '../auth';
import { createProduct, getCategories } from './apiAdmin';


const validationSchema = Yup.object().shape({
    photo: Yup.mixed().required().label('Photo'),
    name: Yup.string().required().label("Name"),
    description: Yup.string().required().label("Description"),
    price: Yup.number().required().min(1).max(1000).label("Price"),
    category: Yup.string().required().label("Category"),
    shipping: Yup.number().required().label("Shipping"),
    quantity: Yup.number().required().label("Quantity"),
});

const AddProduct = () => {
    const { user, token } = isAuthenticated();
    useEffect(() => {
        getCategories().then(data => {
            // console.log(data);
            setCategories(data);
        });
    }, []);

    const [categories, setCategories] = useState();
    const [error, setError] = useState('');
    const [createdProduct, setCreatedProduct] = useState('');

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>  {error} </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h4>Product {`${createdProduct}`} has been created.</h4>
        </div>
    );
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
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            price: '',
                            category: '',
                            shipping: '',
                            quantity: '',
                            photo: '',
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

                            createProduct(user._id, token, formData)
                                .then(data => {
                                    if (data.error) {
                                        setError(data.error)
                                    } else {
                                        setCreatedProduct(data.name);
                                        resetForm();
                                        setError('');
                                    }
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
                                <button type="submit" onSubmit={formProps.handleSubmit} className="btn btn-outline-primary">Create Product</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout >
    );
}
export default AddProduct;
