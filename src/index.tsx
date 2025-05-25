// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import { GoogleOAuthProvider } from '@react-oauth/google';
import { Auth } from './authentication/auth';


// Replace this with your actual Google Client ID
const GOOGLE_CLIENT_ID = '137868183304-pgl8ueaq6jnpedjjf9sbeerit3fscscm.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Auth>
      <App />
    </Auth>
  </GoogleOAuthProvider>
);
