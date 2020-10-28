import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth'

const Signin = () => {
    const { user } = isAuthenticated();

    const [values, setValues] = useState({
        email: 'taric@google.com',
        password: '123456',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    //higher order function returning another function
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const { email, password, loading, error, redirectToReferrer } = values;

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true })
        //here name and values are same so no need to write name:name
        signin({ email, password }).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false
                })
            } else {
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    });
                });
            }
        });
    }


    const signupForm = () => (
        <form>
            <div className="form-group">
                <label htmlFor="email" className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    );

    const showError = () => (
        //if there is an error display otherwise display none
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )
    const showLoading = () => (
        loading && (<div className="alert alert-info"><h2>Loading ...</h2></div>)
    );

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/user/dashboard" />
        }
    }


    return (
        <Layout
            title="Sign in page"
            description="Node React Ecommerce App"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}
            {showError()}
            {signupForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signin;