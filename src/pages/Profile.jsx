import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  History, 
  User, 
  Car, 
  Globe, 
  Lock, 
  Sliders, 
  ChevronRight, 
  LogOut, 
  Check, 
  X, 
  ShieldCheck 
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Profile() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, isArabic, toggleArabic } = useTheme();

  const [selectedVehicle, setSelectedVehicle] = useState("Tesla Model 3");

  // Logged-in user state
  const [currentUser, setCurrentUser] = useState({
    name: "Blen",
    email: "blen@example.com",
    phoneNumber: "+251911234567"
  });

  // Modals state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Load current user info on mount (adjust based on how you store user session)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (loggedInUser) {
      try {
        const parsed = JSON.parse(loggedInUser);
        setCurrentUser({
          name: parsed.name || "Blen",
          email: parsed.email || "blen@example.com",
          phoneNumber: parsed.phoneNumber || "+251911234567"
        });
        if (parsed.vehicle) {
          setSelectedVehicle(parsed.vehicle);
        }
      } catch (e) {
        // Fallback if it's just stored as plain text email or mock
      }
    }
  }, []);

  const handleLogout = () => {
    // Perform any auth cleanup/logout logic here (e.g., clear tokens)
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/signup"); 
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(isArabic ? "جميع الحقول مطلوبة" : "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(isArabic ? "كلمات المرور الجديدة غير متطابقة" : "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(isArabic ? "يجب أن تكونكلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters long");
      return;
    }

    // Here you can integrate your actual backend/storage password update logic
    setPasswordSuccess(isArabic ? "تم تغيير كلمة المرور بنجاح!" : "Password changed successfully!");
    
    setTimeout(() => {
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("");
    }, 1500);
  };

  // Translations dictionary for English and Arabic
  const t = {
    account: isArabic ? "الحساب" : "Account",
    profile: isArabic ? "الملف الشخصي" : "Profile",
    verified: isArabic ? "حساب موثق" : "Verified account",
    preferences: isArabic ? "التفضيلات" : "Preferences",
    myVehicle: isArabic ? "مركبتي" : "My vehicle",
    language: isArabic ? "اللغة" : "Language",
    security: isArabic ? "الأمان" : "Security",
    changePassword: isArabic ? "تغيير كلمة المرور" : "Change password",
    lastChanged: isArabic ? "آخر تغيير قبل 3 أشهر" : "Last changed 3 months ago",
    appearance: isArabic ? "المظهر" : "Appearance",
    darkMode: isArabic ? "الوضع الداكن" : "Dark mode",
    lightMode: isArabic ? "الوضع الفاتح" : "Light mode",
    logOut: isArabic ? "تسجيل الخروج" : "Log out",
    home: isArabic ? "الرئيسية" : "Home",
    transactions: isArabic ? "المعاملات" : "Transactions",
    selectVehicle: isArabic ? "اختر المركبة الكهربائية" : "Select EV Vehicle",
    selectLanguage: isArabic ? "اختر اللغة" : "Select Language",
    currentPassword: isArabic ? "كلمة المرور الحالية" : "Current Password",
    newPassword: isArabic ? "كلمة المرور الجديدة" : "New Password",
    confirmPassword: isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password",
    saveChanges: isArabic ? "حفظ التغييرات" : "Save Changes",
    cancel: isArabic ? "إلغاء" : "Cancel",
  };

  const evVehicles = [
    { name: "Tesla Model 3", capacity: "75 kWh", range: "438 km" },
    { name: "Tesla Model Y", capacity: "81 kWh", range: "455 km" },
    { name: "Porsche Taycan", capacity: "93.4 kWh", range: "389 km" },
    { name: "Lucid Air", capacity: "112 kWh", range: "650 km" },
    { name: "BMW i4", capacity: "83.9 kWh", range: "483 km" },
    { name: "Audi e-tron GT", capacity: "93.4 kWh", range: "383 km" },
    { name: "BYD Seal", capacity: "82.5 kWh", range: "520 km" },
    { name: "Hyundai Ioniq 5", capacity: "77.4 kWh", range: "418 km" },
  ];

  const languages = [
    { name: "English", native: "English", code: "en" },
    { name: "Arabic", native: "العربية", code: "ar" },
  ];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex justify-center px-6 py-10 pb-28 font-sans transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-neutral-100 text-neutral-900"
      }`}
    >
      <div className="w-full max-w-md">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-sm transition-colors ${
                darkMode ? "bg-[#22c55e] text-black font-bold" : "bg-[#125833] text-white"
              }`}
            >
              ⌁
            </div>
            <span
              className={`font-bold text-xl tracking-tight ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              volto
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition ${
              darkMode
                ? "bg-neutral-900 text-yellow-400 border border-neutral-800 hover:bg-neutral-800"
                : "bg-white text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </header>

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className={`text-xs font-semibold tracking-[0.25em] uppercase mb-1 ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.account}
            </p>
            <h1
              className={`text-4xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              {t.profile}
            </h1>
          </div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
              darkMode ? "bg-neutral-900 text-neutral-300 border border-neutral-800" : "bg-white text-neutral-600"
            }`}
          >
            <User className="w-5 h-5" />
          </div>
        </div>

        {/* User Badge Card */}
        <div
          className={`rounded-3xl p-5 mb-6 border shadow-sm flex items-center gap-4 transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-200/60"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 ${
              darkMode ? "bg-[#125833] text-white" : "bg-[#125833] text-white"
            }`}
          >
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "B"}
          </div>

          <div className="overflow-hidden">
            <h2
              className={`text-lg font-bold truncate ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              {currentUser.name}
            </h2>
            <p
              className={`text-xs truncate ${
                darkMode ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {currentUser.email}
            </p>
            <p
              className={`text-xs mb-1.5 truncate ${
                darkMode ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {currentUser.phoneNumber}
            </p>
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.verified}</span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div
          className={`rounded-3xl border shadow-sm overflow-hidden mb-6 transition-colors ${
            darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/60"
          }`}
        >
          <div
            className={`px-5 py-3 text-[11px] font-bold tracking-wider uppercase border-b transition-colors ${
              darkMode
                ? "bg-neutral-950 text-[#4ade80] border-neutral-800"
                : "bg-[#E8F2EC] text-[#125833] border-neutral-100"
            }`}
          >
            {t.preferences}
          </div>

          <div className={`divide-y ${darkMode ? "divide-neutral-800" : "divide-neutral-100"}`}>
            {/* Vehicle Selection */}
            <button
              onClick={() => setShowVehicleModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    darkMode
                      ? "bg-emerald-950/80 text-[#4ade80]"
                      : "bg-[#E8F2EC] text-[#125833]"
                  }`}
                >
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.myVehicle}
                  </h4>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {selectedVehicle}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isArabic ? "rotate-180" : ""
                } ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}
              />
            </button>

            {/* Language Selection */}
            <button
              onClick={() => setShowLanguageModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    darkMode
                      ? "bg-emerald-950/80 text-[#4ade80]"
                      : "bg-[#E8F2EC] text-[#125833]"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.language}
                  </h4>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {isArabic ? "العربية" : "English"}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isArabic ? "rotate-180" : ""
                } ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}
              />
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div
          className={`rounded-3xl border shadow-sm overflow-hidden mb-6 transition-colors ${
            darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200/60"
          }`}
        >
          <div
            className={`px-5 py-3 text-[11px] font-bold tracking-wider uppercase border-b transition-colors ${
              darkMode
                ? "bg-neutral-950 text-[#4ade80] border-neutral-800"
                : "bg-[#E8F2EC] text-[#125833] border-neutral-100"
            }`}
          >
            {t.security}
          </div>

          <div className={`divide-y ${darkMode ? "divide-neutral-800" : "divide-neutral-100"}`}>
            {/* Change Password */}
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    darkMode
                      ? "bg-emerald-950/80 text-[#4ade80]"
                      : "bg-[#E8F2EC] text-[#125833]"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.changePassword}
                  </h4>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {t.lastChanged}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isArabic ? "rotate-180" : ""
                } ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}
              />
            </button>

            {/* Appearance Toggle Item */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    darkMode
                      ? "bg-emerald-950/80 text-[#4ade80]"
                      : "bg-[#E8F2EC] text-[#125833]"
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.appearance}
                  </h4>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {darkMode ? t.darkMode : t.lightMode}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                  darkMode ? "bg-[#22c55e]" : "bg-neutral-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                    darkMode
                      ? isArabic ? "-translate-x-6" : "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className={`w-full py-4 rounded-2xl border font-semibold flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-500/10 transition ${
            darkMode ? "border-neutral-800 bg-neutral-900" : "border-rose-200/60 bg-white"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logOut}</span>
        </button>

      </div>

      {/* VEHICLE SELECTION MODAL */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t.selectVehicle}</h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {evVehicles.map((vehicle) => (
                <button
                  key={vehicle.name}
                  onClick={() => {
                    setSelectedVehicle(vehicle.name);
                    setShowVehicleModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    selectedVehicle === vehicle.name
                      ? darkMode
                        ? "border-[#22c55e] bg-emerald-950/60 text-white"
                        : "border-[#125833] bg-[#E8F2EC] text-neutral-900"
                      : darkMode
                      ? "border-neutral-800 hover:bg-neutral-800"
                      : "border-neutral-100 hover:bg-neutral-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{vehicle.name}</p>
                    <p className="text-[11px] opacity-60">
                      {vehicle.capacity} • {vehicle.range}
                    </p>
                  </div>
                  {selectedVehicle === vehicle.name && (
                    <Check
                      className={`w-4 h-4 ${
                        darkMode ? "text-[#4ade80]" : "text-[#125833]"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LANGUAGE SELECTION MODAL */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t.selectLanguage}</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {languages.map((lang) => {
                const isSelected = (lang.code === "ar" && isArabic) || (lang.code === "en" && !isArabic);
                return (
                  <button
                    key={lang.name}
                    onClick={() => {
                      if ((lang.code === "ar" && !isArabic) || (lang.code === "en" && isArabic)) {
                        toggleArabic();
                      }
                      setShowLanguageModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? darkMode
                          ? "border-[#22c55e] bg-emerald-950/60 text-white"
                          : "border-[#125833] bg-[#E8F2EC] text-neutral-900"
                        : darkMode
                        ? "border-neutral-800 hover:bg-neutral-800"
                        : "border-neutral-100 hover:bg-neutral-50"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{lang.name}</p>
                      <p className="text-[11px] opacity-60">{lang.native}</p>
                    </div>
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          darkMode ? "text-[#4ade80]" : "text-[#125833]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t.changePassword}</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="p-3 text-xs rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">{t.currentPassword}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                    darkMode 
                      ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                      : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">{t.newPassword}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                    darkMode 
                      ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                      : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">{t.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                    darkMode 
                      ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                      : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition ${
                    darkMode ? "border-neutral-800 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm text-white transition ${
                    darkMode ? "bg-[#22c55e] text-black hover:opacity-90 font-bold" : "bg-[#125833] hover:opacity-90"
                  }`}
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <nav
          className={`rounded-full px-8 py-3 shadow-lg border flex items-center gap-10 transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-200/60"
          }`}
        >
          <button
            className={`flex flex-col items-center gap-1 transition ${
              darkMode ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[11px] font-medium">{t.home}</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 transition ${
              darkMode ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[11px] font-medium">{t.transactions}</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 ${
              darkMode ? "text-[#22c55e]" : "text-[#125833]"
            }`}
          >
            <User
              className={`w-5 h-5 stroke-[2.5] ${
                darkMode ? "text-[#22c55e]" : "text-[#125833]"
              }`}
            />
            <span className="text-[11px] font-bold">{t.profile}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}