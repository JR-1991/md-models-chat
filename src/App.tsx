import { useEffect } from "react";
import Dashboard from "./app/page";
import PasswordModal from "./components/password-modal";
import { setJWTCookie } from "./utils/requests";

function App() {
  useEffect(() => {
    setJWTCookie().then(() => console.log("JWT cookie set"));
  }, []);

  console.log("Environment Variables:", import.meta.env);

  return (
    <>
      {import.meta.env.VITE_PUBLIC_USE_PASSWORD === "true" && <PasswordModal />}
      <Dashboard />
    </>
  );
}

export default App;
