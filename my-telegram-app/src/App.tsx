import { useEffect, useState } from 'react';
import axios from 'axios';

const TELEGRAM_CONFIG = {
  apiUrl: 'https://your-backend-api-url.com',  // Replace this with your backend URL when ready
};

const TelegramAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const app = window.Telegram.WebApp;
        app.ready();

        if (app.initDataUnsafe.user) {
          setUser(app.initDataUnsafe.user);

          const initData = app.initData;
          if (!initData) {
            throw new Error('No init data available');
          }

          const response = await axios.get(`${TELEGRAM_CONFIG.apiUrl}/api/auth/verify`, {
            params: { init_data: initData },
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          if (response.status === 200) {
            console.log('User verified and saved successfully');
          } else {
            throw new Error('Failed to verify user');
          }
        }

        app.ready();
      } catch (err: unknown) {
        const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.first_name}</h1>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default TelegramAuth;
