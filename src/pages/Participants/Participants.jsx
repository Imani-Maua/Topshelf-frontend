import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { participantService } from '../../services/participantService';
import ParticipantDetail from '../../components/ParticipantDetail/ParticipantDetail';
import './Participants.css';

const Participants = () => {
    const location = useLocation();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentParticipant, setCurrentParticipant] = useState({ firstname: '', lastname: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Fetch participants on mount
    useEffect(() => {
        loadParticipants();
    }, []);

    useEffect(() => {
        if (location.state?.openModal){
            setShowModal(true);
        }
    }, [location]);

    const loadParticipants = async () => {
        try {
            setLoading(true);
            const participants = await participantService.getParticipants();
            setParticipants(participants.data || []);
        } catch (err) {
            setError('Failed to load participants. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredParticipants = participants.filter(participant =>
        `${participant.firstname} ${participant.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (participant = { firstname: '', lastname: '' }) => {
        setCurrentParticipant(participant);
        setIsEditing(!!participant.id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentParticipant({ firstname: '', lastname: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await participantService.updateParticipant(currentParticipant.id, currentParticipant);
            } else {
                await participantService.createParticipant(currentParticipant);
            }
            loadParticipants();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this participant?')) {
            try {
                await participantService.deleteParticipant(id);
                loadParticipants();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete');
            }
        }
    };

    const handleViewDetails = async (participant) => {
        try {
            setDetailLoading(true);
            const res = await participantService.getParticipantById(participant.id);
            setSelectedParticipant(res.data);
        } catch (err) {
            alert('Failed to load participant details');
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading && participants.length === 0) {
        return (
            <div className="participants-container">
                <div className="loading-state">
                    <p>Gathering team intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="participants-container">
            {/* Header */}
            <div className="participants-header">
                <div className="participants-title">
                    <h2>Participants</h2>
                    <p>Manage your restaurant's high-performers.</p>
                </div>
                <div className="participants-controls">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn-add" onClick={() => openModal()}>
                        <span>➕</span> Add Participant
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="participants-stats">
                <div className="stat-card">
                    <span className="stat-label">Total Team</span>
                    <span className="stat-value">{participants.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Active This Month</span>
                    <span className="stat-value">{participants.length > 0 ? participants.length : 0}</span>
                </div>
            </div>

            {/* Table Area */}
            <div className="participants-table-container">
                {filteredParticipants.length > 0 ? (
                    <table className="participants-table">
                        <thead>
                            <tr>
                                <th>Participant Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.map(participant => (
                                <tr key={participant.id}>
                                    <td>
                                        <div
                                            className="participant-name-cell"
                                            onClick={() => handleViewDetails(participant)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="avatar">
                                                {participant.firstname[0]}{participant.lastname[0]}
                                            </div>
                                            <span className="name-main">{participant.firstname} {participant.lastname}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: '#34A853', fontWeight: 600 }}>Active</span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" title="Edit Participant" onClick={() => openModal(participant)}>
                                                ✏️
                                            </button>
                                            <button className="action-btn delete" title="Delete Participant" onClick={() => handleDelete(participant.id)}>
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <h3>No participants found</h3>
                        <p>{searchQuery ? 'Try adjusting your search query.' : "Let's start by adding your first restaurant superstar!"}</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Participant' : 'Add New Participant'}</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentParticipant.firstname}
                                    onChange={(e) => setCurrentParticipant({ ...currentParticipant, firstname: e.target.value })}
                                    placeholder="e.g. John"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentParticipant.lastname}
                                    onChange={(e) => setCurrentParticipant({ ...currentParticipant, lastname: e.target.value })}
                                    placeholder="e.g. Doe"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? 'Save Changes' : 'Hire Participant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Participant Detail Panel */}
            {selectedParticipant && (
                <ParticipantDetail
                    participant={selectedParticipant}
                    onClose={() => setSelectedParticipant(null)}
                />
            )}
        </div>
    );
};

export default Participants;
