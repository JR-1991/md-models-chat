import { useEffect, useState } from "react";
import Dashboard from "./app/page";
import PasswordModal from "./components/password-modal";
import { setJWTCookie } from "./utils/requests";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJWTCookie()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to authenticate');
        console.error('Authentication failed:', err);
      });
  }, []);

  const shouldShowPasswordModal = import.meta.env.VITE_USE_PASSWORD?.toLowerCase() === "true";

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {shouldShowPasswordModal && <PasswordModal />}
      {isAuthenticated ? <Dashboard /> : <div>Loading...</div>}
    </>
  );
}

export default App;