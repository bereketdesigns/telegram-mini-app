import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Ensure Telegram WebApp is available
        if (window.Telegram && window.Telegram.WebApp) {
          const app = window.Telegram.WebApp;

          // Wait for the WebApp to be ready
          app.ready();

          // Get user data and init data
          if (app.initDataUnsafe.user) {
            setUser(app.initDataUnsafe.user);

            const initData = app.initData;
            if (!initData) {
              throw new Error('No init data available');
            }

            // Send the raw init data string to the backend or use directly
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
              params: { init_data: initData },
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.status === 200) {
              console.log('User verified successfully');
            } else {
              throw new Error('Failed to verify user');
            }
          }
        } else {
          throw new Error('Telegram WebApp not found');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      }
    };

    initializeApp();
  }, []);

  return (
    <div>
      <h1>Welcome to My Telegram WebApp</h1>
      {error && <p>{error}</p>}
      {user && (
        <div>
          <p>User Info:</p>
          <p>First Name: {user.first_name}</p>
          <p>Username: {user.username}</p>
          <p>Last Name: {user.last_name}</p>
        </div>
      )}
    </div>
  );
};

export default App;
