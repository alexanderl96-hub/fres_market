
import React, { useEffect, useState } from 'react';
import { apiRequest } from './services/api';

export default function VerifyRecoveryEmail({ onBack }) {
  const [message, setMessage] = useState('Verifying email...');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const token = new URLSearchParams(window.location.search)
      .get('token');

    if (!token) {
      setMessage('');
      setError('The verification link is missing its token.');
      return;
    }

    apiRequest('/api/auth/recovery-email/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(data => {
        if (active) setMessage(data.message);
      })
      .catch(err => {
        if (active) {
          setMessage('');
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="account-page">
      <h1>Recovery email verification</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <button onClick={onBack}>Continue to the store</button>
    </main>
  );
}