import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiShield, FiUser } from 'react-icons/fi';
import './Login.css';

const Login = () => {
    const { login, GOOGLE_CLIENT_ID } = useContext(AuthContext);

    useEffect(() => {
        // Render the Google Sign-In button if SDK is loaded and Client ID is configured
        if (window.google && !GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE")) {
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInButton"),
                { theme: "outline", size: "large", width: "400" }
            );
        }
    }, [GOOGLE_CLIENT_ID]);

    return (
        <div className="login-container">
            <div className="glass-panel login-card animate-fade-in">
                <div className="login-header">
                    <div className="brand-logo">SC</div>
                    <h2>SmartCampus Hub</h2>
                    <p>Welcome back! Securely sign in to your campus account.</p>
                </div>

                <div className="login-actions">
                    {/* Real Google Login Button */}
                    <div id="googleSignInButton" className="google-btn-wrapper"></div>
                    
                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <p className="demo-hint text-muted">Demo Mock Roles:</p>
                    <div className="mock-actions">
                        <button onClick={() => login('USER')} className="btn btn-outline login-btn">
                            <FiUser size={18} /> Student
                        </button>
                        
                        <button onClick={() => login('ADMIN')} className="btn btn-primary login-btn">
                            <FiShield size={18} /> Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
