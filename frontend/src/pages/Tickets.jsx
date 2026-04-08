import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiMessageSquare, FiAlertCircle, FiPaperclip } from 'react-icons/fi';
import './Tickets.css';

const Tickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tickets')
            .then(res => setTickets(res.data))
            .catch(err => {
                const mock = [
                    { id: 1, category: 'Equipment', location: 'IT Store Room', priority: 'HIGH', status: 'IN_PROGRESS', description: 'Projector starts flickering after 10 mins of usage', createdAt: new Date().toISOString(), comments: 2 },
                    { id: 2, category: 'Network', location: 'Building 1 - 1st Floor', priority: 'MEDIUM', status: 'OPEN', description: 'No Wi-Fi signal in the right corner', createdAt: new Date(Date.now() - 86400000).toISOString(), comments: 0 }
                ];
                setTickets(mock);
                setLoading(false);
            });
    }, []);

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'CRITICAL': return 'var(--danger)';
            case 'HIGH': return 'var(--warning)';
            default: return 'var(--accent)';
        }
    };

    return (
        <div className="tickets-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Incident Tickets</h1>
                    <p>Report issues and track maintenance progress.</p>
                </div>
                <button className="btn btn-primary">+ Raise Ticket</button>
            </header>

            {loading ? <div className="loading-state">Loading...</div> : (
                <div className="tickets-grid">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="glass-panel ticket-card" style={{borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`}}>
                            <div className="ticket-header">
                                <span className="ticket-category">{ticket.category}</span>
                                <span className="ticket-id">#{ticket.id}</span>
                            </div>
                            
                            <h4><FiAlertCircle style={{color: getPriorityColor(ticket.priority)}}/> {ticket.location}</h4>
                            <p className="ticket-desc">{ticket.description}</p>
                            
                            <div className="ticket-footer">
                                <div className="ticket-stats">
                                    <span title="Comments"><FiMessageSquare /> {ticket.comments || 0}</span>
                                    <span title="Attachments"><FiPaperclip /> {ticket.id === 1 ? 1 : 0}</span>
                                </div>
                                <span className={`badge ${ticket.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-pending'}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tickets;
