import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from '../core/apiUser';
import Layout from '../core/Layout';

const UserProfile = (props) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });
    const { token } = isAuthenticated();

    const { name, email, password, error, success } = values;
    const init = (userId) => {
        read(userId, token)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: true })
                } else {
                    setValues({ ...values, name: data.name, email: data.email, success: true, error: false })
                }
            })
    }
    useEffect(() => {
        init(props.match.params.userId);
    }, [])

    const clickSubmit = (e) => {
        e.preventDefault();
        update(
            props.match.params.userId,
            token,
            { name, email, password }
        ).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        success: true
                    })
                })
            }
        })
    }
    const redirectUser = (success) => {
        if (success) {
            return <Redirect to="cart" />
        }
    }

    const handleChange = name => (e) => {
        setValues({ ...values, error: false, [name]: e.target.value })
    }

    const profileUpdate = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text"
                    onChange={handleChange('name')}
                    className='form-control'
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email"
                    onChange={handleChange('email')}
                    className='form-control'
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password"
                    onChange={handleChange('password')}
                    className='form-control'
                    value={password}
                />
            </div>
            <div onClick={clickSubmit} className="btn btn-primary">Submit</div>
        </form>
    )

    return (
        <Layout
            title="Update Profile"
            description='Update Profile'
            className="container"
        >


            <h5 className='mb-5'>Profile Update</h5>
            <div>{profileUpdate(name, email, password)}</div>


        </Layout>
    )
}

export default UserProfile


