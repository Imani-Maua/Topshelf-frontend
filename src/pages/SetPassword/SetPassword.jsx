import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import './SetPassword.css';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteToken = searchParams.get('token');

    const validatePassword = () => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!inviteToken) {
            setError('No invite token provided. Please use the link from your email.');
            return;
        }

        setIsLoading(true);

        try {
            await authService.setPassword(inviteToken, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to set password. Your invite may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="setpassword-container">
                <div className="setpassword-card">
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Password Set Successfully!</h2>
                        <p>Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="setpassword-container">
            <div className="setpassword-card">
                <div className="setpassword-header">
                    <h1>Set Your Password</h1>
                    <p>Create a secure password for your TopShelf account</p>
                </div>

                <form onSubmit={handleSubmit} className="setpassword-form">
                    {error && (
                        <div className="setpassword-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                        <div className="password-requirements">
                            <p>Password must contain:</p>
                            <ul>
                                <li className={password.length >= 8 ? 'valid' : ''}>
                                    At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                                    One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                                    One lowercase letter
                                </li>
                                <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                                    One number
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-setpassword"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
