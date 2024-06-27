// src/components/LoginForm.js

import React from "react";

const LoginForm = ({
  accountSid,
  authToken,
  setAccountSid,
  setAuthToken,
  handleLogin,
}) => (
  <div className="card">
    <div className="card-body">
      <h2 className="card-title">Login to Twilio</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Account SID"
        value={accountSid}
        onChange={(e) => setAccountSid(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Auth Token"
        value={authToken}
        onChange={(e) => setAuthToken(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  </div>
);

export default LoginForm;
