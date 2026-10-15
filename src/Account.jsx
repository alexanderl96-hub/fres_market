
import React, { useEffect, useState } from 'react';
import { apiRequest } from './services/api';

export default function Account({ onLogout , onBack}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');


const [recoveryEmail, setRecoveryEmail] = useState('');
const [recoveryMessage, setRecoveryMessage] = useState('');
const [recoveryError, setRecoveryError] = useState('');

    async function requestRecoveryEmail(event) {
    event.preventDefault();
    setRecoveryMessage('');
    setRecoveryError('');

    try {
        const data = await apiRequest('/api/auth/recovery-email/request', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail }),
        });

        setRecoveryMessage(data.message);
    } catch (err) {
        setRecoveryError(err.message);
    }
    }

    function handleLogout() {
      localStorage.removeItem('food_store_token');
      onLogout();
    }

  useEffect(() => {
    let active = true;

    apiRequest('/api/auth/me')
      .then(data => {
        if (active) setUser(data.user);
        console.log("user", data.user)
      })
      .catch(err => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  async function changePassword(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const data = await apiRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  }

  function signOut() {
    onLogout?.();
  }

  if (error && !user) {
    return (
      <main className="account-page">
        <p role="alert">{error}</p>
        <button onClick={signOut}>Back to login</button>
      </main>
    );
  }

  if (!user) return <p>Loading your account...</p>;

   console.log("user", user)

  return (
    <main className="account-page">
      <h1>My Account</h1>

      <section className="account-card">
        <h2>Personal information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Account ID:</strong> {user.id}</p>
        <p>
          <strong>Member since:</strong> {user.created}
          {user.created_at
            ?  new Date(user.created_at).toLocaleDateString()
            : 'Not available'}
        </p>
        <button type="button"  onClick={handleLogout}>
            Sign out
         </button>
      </section>

      <section className="account-card">
        <h2>Change password</h2>

        <form onSubmit={changePassword}>
          <label>
            Current password
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Update password</button>
        </form>

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </section>

        <section className="account-card">
        <h2>Email recovery</h2>
        <p>
            Add an alternate email address and verify it so you can
            recover your login email if you forget it.
        </p>

        <form onSubmit={requestRecoveryEmail}>
            <label>
            Alternate email
            <input
                type="email"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                autoComplete="email"
                required
            />
            </label>

            <button type="submit">Send verification email</button>
        </form>

        {recoveryMessage && <p role="status">{recoveryMessage}</p>}
        {recoveryError && <p role="alert">{recoveryError}</p>}
        
        </section>

      <button type="button" onClick={onBack}>
        Back to login
      </button>
    </main>
  );
}