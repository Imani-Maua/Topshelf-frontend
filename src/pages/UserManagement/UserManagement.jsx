import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await authService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await authService.createUser(formData);
            setShowCreateModal(false);
            setFormData({ username: '', email: '', firstname: '', lastname: '', role: 'user' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
        }
    };

    const handleSendInvite = async (userId) => {
        console.log('🔵 handleSendInvite called with userId:', userId);
        setError('');

        try {
            console.log('🔵 Calling authService.sendInvite...');
            const result = await authService.sendInvite(userId);
            console.log('✅ Invite sent successfully!', result);
            alert('Invite sent successfully! Check Mailtrap inbox.');
        } catch (err) {
            console.error('❌ Error sending invite:', err);
            console.error('❌ Error response:', err.response);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to send invite';
            setError(errorMsg);
            alert(`Failed to send invite: ${errorMsg}`);
        }
    };

    const handleDeactivate = async (userId) => {
        if (!confirm('Are you sure you want to deactivate this user?')) return;

        try {
            await authService.deactivateUser(userId);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to deactivate user');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await authService.deleteUser(userId);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="user-management-loading">Loading users...</div>;
    }

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage system users and send invitations</p>
                </div>
                <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
                    <span>+</span> Create New User
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="user-search">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstname} {user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {!user.isActive && (
                                        <button
                                            className="btn-action btn-invite"
                                            onClick={() => handleSendInvite(user.id)}
                                            title="Send Invite"
                                        >
                                            📧
                                        </button>
                                    )}
                                    {user.isActive && (
                                        <button
                                            className="btn-action btn-deactivate"
                                            onClick={() => handleDeactivate(user.id)}
                                            title="Deactivate User"
                                        >
                                            🚫
                                        </button>
                                    )}
                                    <button
                                        className="btn-action btn-delete"
                                        onClick={() => handleDelete(user.id)}
                                        title="Delete User"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New User</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
