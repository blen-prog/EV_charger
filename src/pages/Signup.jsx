import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { signUpUser, signInUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, isArabic } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal UI state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const cachedUser = localStorage.getItem("currentUser");
    if (cachedUser) {
      navigate("/");
    }
  }, [navigate]);  

  const handleSignUpChange = (e) => {
    setError("");
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignInChange = (e) => {
    setError("");
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phoneNumber, password } = signUpData;

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await signUpUser({
        fullName,
        email,
        phoneNumber,
        password,
      });

      if (data?.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = signInData;

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await signInUser({
        email: email.trim(),
        password,
      });

      if (data?.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setForgotSuccess(true);
  };

  const handleTabSwitch = (tab) => {
    setError("");
    setActiveTab(tab);
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex items-center justify-center px-6 py-10 transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="w-full max-w-md">
        {/* Brand Header with Volto */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl bg-[#125833] text-white shadow-sm">
            ⌁
          </div>
          <span
            className={`text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Volto
          </span>
        </div>

        {/* Headings */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#125833] mb-3">
            ELECTRIC, SIMPLIFIED
          </p>

          <h1
            className={`text-5xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Charge forward.
          </h1>

          <p
            className={`mt-4 text-base leading-6 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Your smarter way to power up, wherever the
            <br />
            road takes you.
          </p>
        </div>

        {/* Tabs */}
        <div
          className={`flex mt-8 p-1 rounded-xl ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => handleTabSwitch("signup")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              activeTab === "signup"
                ? darkMode
                  ? "bg-slate-700 text-white shadow"
                  : "bg-white text-slate-900 shadow"
                : darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Create account
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("signin")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              activeTab === "signin"
                ? darkMode
                  ? "bg-slate-700 text-white shadow"
                  : "bg-white text-slate-900 shadow"
                : darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Sign in
          </button>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* SIGN UP */}
        {activeTab === "signup" ? (
          <form onSubmit={handleSignUpSubmit} className="mt-7">
            <div className="mb-5">
              <label
                htmlFor="fullName"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={signUpData.fullName}
                onChange={handleSignUpChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address (e.g., name@example.com)"
                value={signUpData.email}
                onChange={handleSignUpChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="phoneNumber"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Phone number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="e.g. 0501234567 or +971501234567"
                value={signUpData.phoneNumber}
                onChange={handleSignUpChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center px-5 py-4 rounded-xl bg-[#125833] hover:bg-[#0d4226] text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create my account"}
            </button>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`w-full mt-4 text-sm font-medium transition ${
                darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </form>
        ) : (
          /* SIGN IN */
          <form onSubmit={handleSignInSubmit} className="mt-7">
            <div className="mb-5">
              <label
                htmlFor="signin-email"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Email address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={signInData.email}
                onChange={handleSignInChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="signin-password"
                  className={`block text-sm font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotSuccess(false);
                    setForgotEmail("");
                  }}
                  className="text-xs font-semibold text-[#125833] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signInData.password}
                onChange={handleSignInChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center px-5 py-4 rounded-xl bg-[#125833] hover:bg-[#0d4226] text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`w-full mt-4 text-sm font-medium transition ${
                darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </form>
        )}

        {/* Terms */}
        <p
          className={`text-center text-xs mt-7 leading-5 ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          By continuing, you agree to our Terms and
          <br />
          Privacy Policy.
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-8">
          <div
            className={`flex items-center gap-2 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span className="text-[#125833] text-xl">ϟ</span>
            <span>One wallet. Every charge.</span>
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
              darkMode
                ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal (UI mockup) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-100 text-slate-900"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold">Reset password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Enter your email address to receive password reset instructions.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 focus:border-[#125833]"
                      : "bg-slate-50 border-slate-200 focus:border-[#125833]"
                  }`}
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#125833] hover:bg-[#0d4226] text-white font-semibold rounded-xl text-sm transition"
                >
                  Send reset link
                </button>
              </form>
            ) : (
              <div className="text-center py-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold mb-1">Check your inbox</h4>
                <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  We sent a reset link to <span className="font-semibold text-[#125833]">{forgotEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                    darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;