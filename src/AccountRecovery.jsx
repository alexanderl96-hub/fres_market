
import React, { useState } from 'react';
import { apiRequest } from './services/api';

export default function AccountRecovery({ onBack, initialMode = 'password' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const isPassword = mode === 'password';

      const data = await apiRequest(
        isPassword
          ? '/api/auth/forgot-password'
          : '/api/auth/recover-account-email',
        {
          method: 'POST',
          body: JSON.stringify(
            isPassword
              ? { email }
              : { recoveryEmail }
          ),
        }
      );

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <h1>Recover your account</h1>

      <div className="recovery-tabs">
        <button
          type="button"
          onClick={() => {
            setMode('password');
            setMessage('');
            setError('');
          }}
          aria-pressed={mode === 'password'}
        >
          Reset password
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('email');
            setMessage('');
            setError('');
          }}
          aria-pressed={mode === 'email'}
        >
          Forgot email
        </button>
      </div>

      <form onSubmit={submit}>
        {mode === 'password' ? (
          <>
            <p>
              Enter your account email. If an account matches,
              we will send you a reset link.
            </p>

            <label>
              Account email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
          </>
        ) : (
          <>
            <p>
              Enter the alternate email you previously verified
              in your account settings.
            </p>

            <label>
              Verified recovery email
              <input
                type="email"
                autoComplete="email"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                required
              />
            </label>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? 'Please wait...'
            : mode === 'password'
              ? 'Send reset link'
              : 'Recover login email'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      <p role="status">{message}</p>

      <button type="button" onClick={onBack}>
        Back to login
      </button>
    </main>
  );
}