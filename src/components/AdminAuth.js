import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui";
import { BUTTON_VARIANTS } from "../constants";

const AdminAuth = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // In production, this would be environment variables or secure config
  const ADMIN_PASSWORD =
    process.env.REACT_APP_ADMIN_PASSWORD || "exposr-admin-2025";

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError("");

    // Simulate network delay for security
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      // Store authentication in sessionStorage (expires when tab closes)
      sessionStorage.setItem("exposr_admin_auth", "authenticated");
      sessionStorage.setItem(
        "exposr_admin_timestamp",
        new Date().getTime().toString()
      );
      onAuthenticated();
    } else {
      setError("Invalid password. Access denied.");
      // Clear password on failed attempt
      setPassword("");
    }

    setIsAuthenticating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Access Required
            </h1>
            <p className="text-gray-600">
              Enter the admin password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isAuthenticating}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
              disabled={isAuthenticating || !password.trim()}
              loading={isAuthenticating}
            >
              {isAuthenticating ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="text-sm text-blue-600 hover:text-blue-700 underline bg-transparent border-none cursor-pointer"
              >
                ← Back to Exposr
              </button>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                🔒 This admin area is protected. Access attempts are logged for
                security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
