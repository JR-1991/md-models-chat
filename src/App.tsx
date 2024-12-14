import { useEffect } from "react";
import Dashboard from "./app/page";
import PasswordModal from "./components/password-modal";
import { setJWTCookie } from "./utils/requests";

function App() {
  useEffect(() => {
    setJWTCookie().then(() => console.log("JWT cookie set"));
  }, []);

  return (
    <>
      {import.meta.env.VITE_USE_PASSWORD === "true" && <PasswordModal />}
      <Dashboard />
    </>
  );
}

export default App;
