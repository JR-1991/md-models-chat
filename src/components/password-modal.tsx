import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { checkPassword } from "@/utils/requests";

export default function PasswordModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = "hidden";
      body.style.height = "100vh";
    } else {
      body.style.overflow = "";
      body.style.height = "";
    }

    return () => {
      body.style.overflow = "";
      body.style.height = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await checkPassword(password)) {
      setIsOpen(false);
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117]/80 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-[#161b22] border border-[#30363d] text-left align-middle shadow-xl transition-all">
            <div className="px-6 py-5 border-b border-[#30363d]">
              <h3
                className="text-lg font-semibold leading-6 text-white"
                id="modal-title"
              >
                Authentication required
              </h3>
              <p className="mt-2 text-sm text-[#7d8590]">
                Please enter your password to continue
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#c9d1d9]"
                >
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-[#30363d] bg-[#0d1117] shadow-sm focus:border-[#2f81f7] focus:ring focus:ring-[#2f81f7] focus:ring-opacity-50 sm:text-sm text-white"
                    placeholder="Enter password"
                    required
                  />
                </div>
                {error && (
                  <div className="mt-2 flex items-center text-sm text-[#f85149]">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-[#161b22] border-t border-[#30363d]">
                <Button
                  type="submit"
                  className="w-full justify-center rounded-md border border-transparent bg-[#238636] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-[#2f81f7] focus:ring-offset-2"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
