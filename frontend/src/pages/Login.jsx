import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiShield, FiUser } from 'react-icons/fi';
import './Login.css';

const Login = () => {
    const { login } = useContext(AuthContext);

    return (
        <div className="login-container">
            <div className="glass-panel login-card animate-fade-in">
                <div className="login-header">
                    <div className="brand-logo">SC</div>
                    <h2>SmartCampus Hub</h2>
                    <p>Welcome back! Select a mock role to sign in.</p>
                </div>

                <div className="login-actions">
                    <button onClick={() => login('USER')} className="btn btn-outline login-btn">
                        <FiUser size={20} />
                        Sign in as Student (User)
                    </button>
                    
                    <button onClick={() => login('ADMIN')} className="btn btn-primary login-btn">
                        <FiShield size={20} />
                        Sign in as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
