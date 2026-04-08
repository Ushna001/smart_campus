import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiFilter, FiMapPin, FiUsers } from 'react-icons/fi';
import './Resources.css';

const Resources = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [bookingModal, setBookingModal] = useState(null); // stores the resource being booked
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        // Attempt to fetch from API, fallback to mock if backend not running
        api.get('/resources')
            .then(res => {
                setResources(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Using mock data for Resources (backend might be down)", err);
                setResources([
                    { id: 1, name: 'Lab A', type: 'Lab', capacity: 30, location: 'Building 1', status: 'ACTIVE', availabilityWindows: 'Mon-Fri 08:00-18:00' },
                    { id: 2, name: 'Lecture Hall B', type: 'Lecture Hall', capacity: 150, location: 'Building 2', status: 'ACTIVE', availabilityWindows: 'Mon-Fri 08:00-20:00' },
                    { id: 3, name: '4K Projector', type: 'Equipment', capacity: null, location: 'Store Room', status: 'ACTIVE', availabilityWindows: '24/7' },
                    { id: 4, name: 'Meeting Rm C', type: 'Meeting Room', capacity: 10, location: 'Building 1', status: 'OUT_OF_SERVICE', availabilityWindows: 'Mon-Fri' }
                ]);
                setLoading(false);
            });
    }, []);

    const filtered = resources.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType ? r.type === filterType : true;
        const matchesLocation = filterLocation ? r.location.includes(filterLocation) : true;
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleBookNow = (e, resource) => {
        e.preventDefault();
        setBookingModal(resource);
    };

    const submitBooking = (e) => {
        e.preventDefault();
        
        const startRaw = e.target[0].value;
        const endRaw = e.target[1].value;
        const purpose = e.target[2].value;
        
        const start = new Date(startRaw).getTime();
        const end = new Date(endRaw).getTime();

        if (start >= end) {
            setToastMessage("Error: End time must be after start time!");
            setTimeout(() => setToastMessage(''), 4000);
            return;
        }

        // Overlap Detection Mock
        const allBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const hasConflict = allBookings.some(b => {
             // Only blocks pending or approved
             if (b.resource.id === bookingModal.id && (b.status === 'APPROVED' || b.status === 'PENDING')) {
                 const bStart = new Date(b.startDateTime).getTime();
                 const bEnd = new Date(b.endDateTime).getTime();
                 // Overlap arithmetic: (start < bEnd && end > bStart)
                 return (start < bEnd && end > bStart);
             }
             return false;
        });

        if (hasConflict) {
             setToastMessage("Warning: Another user has already requested this time slot!");
             setTimeout(() => setToastMessage(''), 4000);
             return;
        }

        // Simulate successful insert
        const newBooking = {
             id: Date.now(),
             userId: user.id,
             resource: { id: bookingModal.id, name: bookingModal.name },
             startDateTime: startRaw,
             endDateTime: endRaw,
             purpose: purpose,
             status: 'PENDING',
             expectedAttendees: 0
        };
        
        allBookings.push(newBooking);
        localStorage.setItem('mockBookings', JSON.stringify(allBookings));

        // Notify Admin
        const storedNotifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        storedNotifs.unshift({
            id: Date.now() + 1,
            targetUserId: 'ADMIN',
            message: `New booking request for ${bookingModal.name} by ${user.name}.`,
            isRead: false
        });
        localStorage.setItem('mockNotifications', JSON.stringify(storedNotifs));

        setToastMessage(`Booking created for ${bookingModal.name}. Admin notified!`);
        setBookingModal(null);
        setTimeout(() => setToastMessage(''), 4000);
    };

    return (
        <div className="resources-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Facilities & Assets</h1>
                    <p>Browse and locate campus resources.</p>
                </div>
                <div className="action-bar flex-wrap">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="input-field"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <select className="input-field select-filter" value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="Lab">Lab</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Equipment">Equipment</option>
                    </select>

                    <select className="input-field select-filter" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                        <option value="">All Locations</option>
                        <option value="Building 1">Building 1</option>
                        <option value="Building 2">Building 2</option>
                        <option value="Store Room">Store Room</option>
                    </select>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">Loading resources...</div>
            ) : (
                <div className="resource-grid">
                    {filtered.map(resource => (
                        <div key={resource.id} className="glass-panel resource-card">
                            <div className="card-top">
                                <span className={`badge ${resource.status === 'ACTIVE' ? 'badge-active' : 'badge-danger'}`}>
                                    {resource.status.replace('_', ' ')}
                                </span>
                                <h3>{resource.name}</h3>
                                <p className="resource-type">{resource.type}</p>
                            </div>
                            
                            <div className="card-details">
                                <div className="detail-item">
                                    <FiMapPin /> {resource.location}
                                </div>
                                {resource.capacity && (
                                    <div className="detail-item">
                                        <FiUsers /> Up to {resource.capacity} people
                                    </div>
                                )}
                            </div>
                            
                            <div className="card-footer">
                                <p className="availability">{resource.availabilityWindows}</p>
                                {/* Only show Book Now button to basic users, Admin manages behind the scenes */}
                                {user?.role !== 'ADMIN' && (
                                    <button 
                                        className="btn btn-primary" 
                                        disabled={resource.status !== 'ACTIVE'}
                                        onClick={(e) => handleBookNow(e, resource)}
                                    >
                                        Book Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Booking Modal */}
            {bookingModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content animate-fade-in">
                        <h3>Book {bookingModal.name}</h3>
                        <form onSubmit={submitBooking} className="booking-form">
                            <div className="input-group">
                                <label className="input-label">Date & Time Start</label>
                                <input type="datetime-local" className="input-field" required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Date & Time End</label>
                                <input type="datetime-local" className="input-field" required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Purpose</label>
                                <input type="text" placeholder="E.g., Group Study" className="input-field" required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setBookingModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div className="toast-notification animate-fade-in">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default Resources;
