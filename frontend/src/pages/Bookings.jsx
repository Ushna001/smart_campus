import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiCalendar, FiClock, FiCheck, FiX, FiFilter } from 'react-icons/fi';
import './Bookings.css';

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        // Read from localStorage to persist mock state
        const storedBookings = localStorage.getItem('mockBookings');
        if (storedBookings) {
            let parsed = JSON.parse(storedBookings);
            setBookings(user.role === 'ADMIN' ? parsed : parsed.filter(b => b.userId === user.id));
            setLoading(false);
        } else {
            api.get(`/bookings/user/${user.id}`)
                .then(res => {
                    setBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    const mock = [
                        { id: 1, userId: 2, resource: { id: 1, name: 'Lab A' }, startDateTime: '2026-05-10T09:00:00', endDateTime: '2026-05-10T11:00:00', purpose: 'Group Study', status: 'APPROVED', expectedAttendees: 5 },
                        { id: 2, userId: 2, resource: { id: 4, name: 'Meeting Rm C' }, startDateTime: '2026-05-12T14:00:00', endDateTime: '2026-05-12T16:00:00', purpose: 'Society Meeting', status: 'PENDING', expectedAttendees: 8 },
                        { id: 3, userId: 2, resource: { id: 2, name: 'Lecture Hall B' }, startDateTime: '2026-05-11T10:00:00', endDateTime: '2026-05-11T12:00:00', purpose: 'Lab Experiment', status: 'REJECTED', reviewReason: 'Maintenance scheduled' },
                        { id: 4, userId: 3, resource: { id: 3, name: '4K Projector' }, startDateTime: '2026-05-15T09:00:00', endDateTime: '2026-05-15T12:00:00', purpose: 'Guest Lecture', status: 'PENDING', expectedAttendees: 15 }
                    ];
                    localStorage.setItem('mockBookings', JSON.stringify(mock));
                    setBookings(user.role === 'ADMIN' ? mock : mock.filter(b => b.userId === user.id));
                    setLoading(false);
                });
        }
    }, [user]);

    const handleAction = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updated);
        
        // Save back to local storage to mimic backend state preservation
        const allStored = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const globallyUpdated = allStored.map(b => b.id === id ? { ...b, status: newStatus } : b);
        localStorage.setItem('mockBookings', JSON.stringify(globallyUpdated));

        // Create Admin verification notification for the User
        const storedNotifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const targetBooking = globallyUpdated.find(b => b.id === id);
        storedNotifs.unshift({
            id: Date.now(),
            targetUserId: targetBooking.userId,
            message: `Your booking request for ${targetBooking.resource.name} has been ${newStatus}.`,
            isRead: false
        });
        localStorage.setItem('mockNotifications', JSON.stringify(storedNotifs));
    };

    const displayedBookings = bookings.filter(b => filterStatus === 'ALL' || b.status === filterStatus);

    const getStatusClass = (status) => {
        switch(status) {
            case 'APPROVED': return 'badge-active';
            case 'PENDING': return 'badge-pending';
            case 'REJECTED': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    return (
        <div className="bookings-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>{user?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings'}</h1>
                    <p>Track and manage {user?.role === 'ADMIN' ? 'all' : 'your'} resource reservations.</p>
                </div>
                
                <div className="status-tabs">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                        <button 
                            key={status}
                            className={`tab-btn ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? <div className="loading-state">Loading...</div> : (
                <div className="bookings-list">
                    {displayedBookings.length === 0 ? (
                        <div className="glass-panel" style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                            No bookings found for this filter.
                        </div>
                    ) : displayedBookings.map(booking => (
                        <div key={booking.id} className="glass-panel booking-card">
                            <div className="booking-info">
                                <h3>{booking.resource.name}</h3>
                                <p className="purpose">{booking.purpose}</p>
                                
                                <div className="booking-meta">
                                    <span className="meta-item"><FiCalendar /> {new Date(booking.startDateTime).toLocaleDateString()}</span>
                                    <span className="meta-item"><FiClock /> {new Date(booking.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                {booking.reviewReason && <p className="review-reason">Reason: {booking.reviewReason}</p>}
                            </div>
                            
                            <div className="booking-status-actions">
                                <span className={`badge ${getStatusClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                                
                                {user?.role === 'ADMIN' && booking.status === 'PENDING' && (
                                    <div className="admin-actions">
                                        <button onClick={() => handleAction(booking.id, 'APPROVED')} className="icon-btn approve" title="Approve"><FiCheck /></button>
                                        <button onClick={() => handleAction(booking.id, 'REJECTED')} className="icon-btn reject" title="Reject"><FiX /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
