// src/components/GoogleLoginButton.tsx
import React from 'react';

const baseUrl = 'http://localhost:8080';

const GoogleLoginButton: React.FC = () => {
  const onLoginClick = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/google/client-id`);
      if (!res.ok) throw new Error('Failed to fetch client ID');
      const clientId = await res.text();

      const redirectUri = encodeURIComponent("http://localhost:3000/google/callback");
      
      const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/user.organization.read');

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent`;

      window.location.href = authUrl;
    } catch (err) {
      alert('클라이언트 ID를 불러오지 못했습니다.');
      console.error(err);
    }
  };

  return <button onClick={onLoginClick}>구글 로그인 시작</button>;
};

export default GoogleLoginButton;
