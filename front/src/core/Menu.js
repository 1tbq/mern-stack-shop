import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';

const isActive = (history, path) => {
    //FYI histroy is already in address bar 
    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    } else {
        return { color: '#ffffff' }
    }
}

const Menu = ({ history }) => {
    return <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" to='/' style={isActive(history, '/')}>Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/shop' style={isActive(history, '/shop')}>Shop</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/cart' style={isActive(history, '/cart')}>Cart
<sup><small className="cart-badge">{itemTotal()}</small></sup>
                </Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                    <Link className="nav-link"
                        to='/user/dashboard'
                        style={isActive(history, '/user/dashboard')}>
                        Dashbaord
                </Link>
                </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link className="nav-link"
                        to='/admin/dashboard'
                        style={isActive(history, '/admin/dashboard')}>
                        Dashbaord
                </Link>
                </li>
            )}
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to='/signin' style={isActive(history, '/signin')}>Signin</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/signup' style={isActive(history, '/signup')}>Signup</Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <li className="nav-item">
                    <span className="nav-link" onClick={() => signout(() => {
                        history.push('/');
                    })} style={{ cursor: 'pointer', color: '#fff' }}>Signout</span>
                </li>
            )}
        </ul>
    </div>
}

export default withRouter(Menu);