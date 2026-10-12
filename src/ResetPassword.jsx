
import { useState } from 'react';
import { apiRequest } from './services/api';

export default function ResetPassword({ onBack }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = new URLSearchParams(window.location.search)
    .get('token');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('This reset link is missing its token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });

      setMessage(data.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <h1>Reset your password</h1>

      <form onSubmit={submit}>
        <label>
          New password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Set new password'}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {message && (
        <button type="button" onClick={onBack}>
          Return to login
        </button>
      )}
    </main>
  );
}