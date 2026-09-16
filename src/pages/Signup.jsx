import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { authenticateUser, allowedUsers } from "../data/users";

function Signup() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, isArabic } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [error, setError] = useState("");

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [signInData, setSignInData] = useState({
    identifier: "", // Accepts either Email or Phone Number
    password: "",
  });

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
    return email.trim().toLowerCase().endsWith("@gmail.com");
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, phoneNumber, password } = signUpData;

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email address must end with @gmail.com");
      return;
    }

    // Check if user already exists
    const existingUser = allowedUsers.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() ||
        u.phoneNumber.replace(/\s+/g, "") === phoneNumber.trim().replace(/\s+/g, "")
    );

    if (existingUser) {
      setError("An account with this email or phone number already exists.");
      return;
    }

    // Create new user object with formatted ID
    const newUser = {
      id: `USR-00${allowedUsers.length + 1}`,
      name: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      password: password,
      vehicle: "Electric Vehicle"
    };

    // Add to allowed users list
    allowedUsers.push(newUser);

    // Save current session
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setError("");
    navigate("/");
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const { identifier, password } = signInData;

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // Authenticate credentials against allowedUsers dataset
    const user = authenticateUser(identifier, password);

    if (!user) {
      setError("Invalid email/phone number or password.");
      return;
    }

    setError("");
    // Store authenticated user session
    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/");
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
                placeholder="Enter your email address (@gmail.com)"
                value={signUpData.email}
                onChange={handleSignUpChange}
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
                placeholder="e.g. +971501234567 or +251911234567"
                value={signUpData.phoneNumber}
                onChange={handleSignUpChange}
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
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full text-center px-5 py-4 rounded-xl bg-[#125833] hover:bg-[#0d4226] text-white font-semibold transition"
            >
              Create my account
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
                htmlFor="signin-identifier"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Email or Phone number
              </label>
              <input
                id="signin-identifier"
                name="identifier"
                type="text"
                placeholder="Enter email (@gmail.com) or phone number"
                value={signInData.identifier}
                onChange={handleSignInChange}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="signin-password"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signInData.password}
                onChange={handleSignInChange}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#125833]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#125833]"
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full text-center px-5 py-4 rounded-xl bg-[#125833] hover:bg-[#0d4226] text-white font-semibold transition"
            >
              Sign in
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
    </div>
  );
}

export default Signup;