import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FiHome, FiBox, FiCalendar, FiTool, FiLogOut, FiBell, FiCheck } from 'react-icons/fi';
import './Layout.css';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        
        // Sync with mock LocalStorage or API
        const loadNotifications = () => {
             const stored = localStorage.getItem('mockNotifications');
             if (stored) {
                 const parsed = JSON.parse(stored);
                 // Filter logic: If Admin, show admin target notifs. Else show user target notifs.
                 setNotifications(parsed.filter(n => n.targetUserId === user.id || (user.role === 'ADMIN' && n.targetUserId === 'ADMIN')));
             } else {
                 api.get(`/notifications/user/${user.id}`)
                    .then(res => setNotifications(res.data))
                    .catch(() => {
                        const initialMock = [
                            { id: 1, targetUserId: 2, message: 'Your booking request for Lab A has been Rejected.', isRead: true },
                            { id: 2, targetUserId: 2, message: 'Your booking request for Group Study has been Approved.', isRead: false },
                            { id: 3, targetUserId: 'ADMIN', message: 'New booking request submitted for 4K Projector by User 2.', isRead: false }
                        ];
                        localStorage.setItem('mockNotifications', JSON.stringify(initialMock));
                        setNotifications(initialMock.filter(n => n.targetUserId === user.id || (user.role === 'ADMIN' && n.targetUserId === 'ADMIN')));
                    });
             }
        };

        loadNotifications();
        
        // Simulating real-time updates when toggling views
        window.addEventListener('storage', loadNotifications);
        return () => window.removeEventListener('storage', loadNotifications);
    }, [user, showNotifications]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        try { api.patch(`/notifications/${id}/read`); } catch(e) {}
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const navLinks = [
        { path: '/', label: 'Overview', icon: <FiHome /> },
        { path: '/resources', label: 'Facilities', icon: <FiBox /> },
        { path: '/bookings', label: 'Bookings', icon: <FiCalendar /> },
        { path: '/tickets', label: 'Tickets', icon: <FiTool /> },
    ];

    return (
        <div className="layout-root">
            <nav className="glass-navbar">
                <div className="nav-brand">
                    <h2>SmartCampus</h2>
                </div>
                <div className="nav-links">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </div>
                <div className="nav-actions">
                    <div className="notification-bell" ref={notifRef}>
                        <div className="bell-icon" onClick={() => setShowNotifications(!showNotifications)}>
                            <FiBell size={20} />
                            {unreadCount > 0 && <span className="badge-indicator">{unreadCount}</span>}
                        </div>
                        
                        {showNotifications && (
                            <div className="notifications-dropdown glass-panel animate-fade-in">
                                <h3>Notifications</h3>
                                <div className="notifications-list">
                                    {notifications.length === 0 ? (
                                        <p className="no-notifs">You have no notifications.</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                                                <p>{notif.message}</p>
                                                {!notif.isRead && (
                                                    <button onClick={() => markAsRead(notif.id)} className="mark-read-btn" title="Mark as Read">
                                                        <FiCheck size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="user-profile">
                        <span className="user-name">{user?.name} ({user?.role})</span>
                        <button onClick={logout} className="btn btn-outline" style={{padding: '0.4rem 0.8rem'}}>
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="page-container animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
