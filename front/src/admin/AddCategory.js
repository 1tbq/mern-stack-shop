import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createCategory } from './apiAdmin';
import { Link } from 'react-router-dom';




const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    //destructure user and token from isAuthenticated();
    const { user, token } = isAuthenticated();

    const handleChange = (e) => {
        setError('');
        setName(e.target.value)
    }
    const clickSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        // make request to api to create category
        createCategory(user._id, token, { name })
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setError('');
                    setSuccess(true);
                }
            });
    };

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label htmlFor="name" className="text-muted">Name</label>
                <input required onChange={handleChange} autoFocus value={name} type="text" className="form-control" />
            </div>
            <button className="btn btn-outline-primary">Create Categroy</button>
        </form>
    );

    const showSuccess = () => {
        if (success) {
            return <h6 className="text-success">Category {name} has been created successfuly</h6>
        }
    };
    const showError = () => {
        if (error) {
            return <h6 className="text-danger">{error}</h6>
        }
    };

    const goBack = () => {
        return <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
        </div>
    }

    return (
        <Layout
            title="Add New Category"
            description={`G'day ${user.name}! ready to make a new category`}
            className="container"
        >

            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>

        </Layout>
    );

}
export default AddCategory;