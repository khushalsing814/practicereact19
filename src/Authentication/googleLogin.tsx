// googleLogin.tsx
import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLogin: React.FC = () => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '137868183304-pgl8ueaq6jnpedjjf9sbeerit3fscscm.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log('Google Credential:', response.credential);
    // You can send this token to your backend or decode it here
  };

  return <div id="googleButton"></div>;
};

export default GoogleLogin;
