// components/Signup.tsx
import React, { useState } from 'react';
import { useAuth } from './auth';

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const success = signup({ email, password });
    setMessage(success ? 'Signed up!' : 'Signup failed.');
  };

  return (
    <div className="container mt-4">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-success">Signup</button>
      </form>
      {message && <div className="alert alert-info mt-2">{message}</div>}
    </div>
  );
};

export default Signup;
