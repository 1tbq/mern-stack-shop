import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../core/Layout';
import { signup } from '../auth'

const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    //higher order function returning another function
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const { name, email, password, success, error } = values;

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false })
        //here name and values are same so no need to write name:name
        signup({ name, email, password }).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    success: false
                })
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true
                })
            }
        })
    }


    const signupForm = () => (
        <form>
            <div className="form-group">
                <label htmlFor="name" className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>
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
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            <p>New account is created. Please <Link to='/signin'>Signin</Link></p>
        </div>
    )


    return (
        <Layout
            title="Sign up page"
            description="Node React Ecommerce App"
            className="container col-md-8 offset-md-2"
        >   {showSuccess()}
            {showError()}
            {signupForm()}
        </Layout>
    )
}

export default Signup;