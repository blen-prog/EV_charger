import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Car, 
  Globe, 
  Lock, 
  Sliders, 
  ChevronRight, 
  LogOut, 
  Check, 
  X, 
  ShieldCheck,
  CreditCard,
  Radio,
  AlertTriangle
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { signOutUser, reauthenticateAndDelete, changeUserPassword, updateUserVehicle } from "../services/authService";

export default function Profile() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, isArabic, toggleArabic } = useTheme();

  const [selectedVehicle, setSelectedVehicle] = useState("Electric Vehicle");

  // Logged-in user state
  const [currentUser, setCurrentUser] = useState({
    name: "User",
    email: "",
    phoneNumber: "",
    rfidUid: "A3:5C:89:1F",
    passwordUpdatedAt: null
  });

  // Modals state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Wallet form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [walletSuccess, setWalletSuccess] = useState("");

  // Delete account state
  const [deleteStep, setDeleteStep] = useState(1); // 1 = Confirm, 2 = Password
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Helper function for dynamic "last changed" relative time
  const formatTimeAgo = (dateString, isAr) => {
    if (!dateString) {
      return isAr ? "لم يتغير بعد" : "Never changed";
    }
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000); // difference in seconds

    if (diff < 60) return isAr ? "الآن" : "Just now";
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return isAr ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return isAr ? `منذ ${days} يوم` : `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return isAr ? `منذ ${months} شهر` : `${months}mo ago`;
    const years = Math.floor(days / 365);
    return isAr ? `منذ ${years} سنة` : `${years}y ago`;
  };

  // Load current user info on mount
  useEffect(() => {
    const rawUserData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (rawUserData) {
      try {
        const parsed = JSON.parse(rawUserData);

        const name = 
          parsed.user_metadata?.full_name || 
          parsed.name || 
          parsed.email?.split("@")[0] || 
          "User";

        const email = parsed.email || "";

        const phoneNumber = 
          parsed.user_metadata?.phone || 
          parsed.user_metadata?.phone_number || 
          parsed.phoneNumber || 
          "";

        const vehicle = 
          parsed.user_metadata?.vehicle || 
          parsed.vehicle || 
          "Electric Vehicle";

        const rfidUid = 
          parsed.user_metadata?.rfid_uid || 
          parsed.rfidUid || 
          "A3:5C:89:1F";

        const passwordUpdatedAt = 
          parsed.password_updated_at || 
          parsed.user_metadata?.password_updated_at || 
          parsed.created_at || 
          null;

        setCurrentUser({ name, email, phoneNumber, rfidUid, passwordUpdatedAt });
        setSelectedVehicle(vehicle);
      } catch {
        // Leave defaults if JSON parsing fails
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // Proceed with local cleanup regardless of network status
    }
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/signup"); 
  };

  const handleSelectVehicle = async (vehicleName) => {
    setSelectedVehicle(vehicleName);
    setShowVehicleModal(false);

    try {
      await updateUserVehicle(vehicleName);
    } catch (err) {
      console.error("Failed to update vehicle:", err.message);
    }
  };

  const handlePasswordChange = async (e) => {
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
      setPasswordError(isArabic ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      
      const now = new Date().toISOString();
      setCurrentUser(prev => ({ ...prev, passwordUpdatedAt: now }));
      setPasswordSuccess(isArabic ? "تم تغيير كلمة المرور بنجاح!" : "Password changed successfully!");
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || (isArabic ? "فشل تغيير كلمة المرور" : "Failed to change password."));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleWalletSave = (e) => {
    e.preventDefault();
    setWalletSuccess(isArabic ? "تم حفظ بطاقة الدفع بنجاح!" : "Card saved successfully!");
    
    setTimeout(() => {
      setShowWalletModal(false);
      setWalletSuccess("");
    }, 1500);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deletePassword.trim()) {
      setDeleteError(isArabic ? "يرجى إدخال كلمة المرور" : "Please enter your password.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await reauthenticateAndDelete(deletePassword);
      setShowDeleteModal(false);
      navigate("/signup");
    } catch (err) {
      setDeleteError(err.message || (isArabic ? "فشل حذف الحساب" : "Failed to delete account."));
    } finally {
      setDeleteLoading(false);
    }
  };

  // Translations dictionary
  const t = {
    account: isArabic ? "الحساب" : "Account",
    profile: isArabic ? "الملف الشخصي" : "Profile",
    verified: isArabic ? "حساب موثق" : "Verified account",
    virtualRfid: isArabic ? "مفتاح الشحن الرقمي" : "Virtual RFID Key",
    rfidSubtitle: isArabic ? "معرف بطاقة المحطة" : "Station Pass UID",
    rfidActive: isArabic ? "نشط" : "Active",
    rfidDescription: isArabic 
      ? "استخدم هذا المعرف في محطات الشحن أو قم بربط بطاقة فعلية لاحقاً." 
      : "Tap or enter this digital UID at Volto charging stations.",
    preferences: isArabic ? "التفضيلات" : "Preferences",
    myVehicle: isArabic ? "مركبتي" : "My vehicle",
    language: isArabic ? "اللغة" : "Language",
    security: isArabic ? "الأمان" : "Security",
    wallet: isArabic ? "المحفظة" : "Wallet",
    walletSubtitle: isArabic ? "إدارة بطاقات الائتمان وطرق الدفع" : "Manage payment methods",
    changePassword: isArabic ? "تغيير كلمة المرور" : "Change password",
    lastChangedPrefix: isArabic ? "آخر تغيير: " : "Last changed ",
    appearance: isArabic ? "المظهر" : "Appearance",
    darkMode: isArabic ? "الوضع الداكن" : "Dark mode",
    lightMode: isArabic ? "الوضع الفاتح" : "Light mode",
    logOut: isArabic ? "تسجيل الخروج" : "Log out",
    deleteAccount: isArabic ? "حذف الحساب" : "Delete account",
    selectVehicle: isArabic ? "اختر المركبة الكهربائية" : "Select EV Vehicle",
    selectLanguage: isArabic ? "اختر اللغة" : "Select Language",
    currentPassword: isArabic ? "كلمة المرور الحالية" : "Current Password",
    newPassword: isArabic ? "كلمة المرور الجديدة" : "New Password",
    confirmPassword: isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password",
    saveChanges: isArabic ? "حفظ التغييرات" : "Save Changes",
    saving: isArabic ? "جاري الحفظ..." : "Saving...",
    cancel: isArabic ? "إلغاء" : "Cancel",
    cardHolder: isArabic ? "اسم حامل البطاقة" : "Cardholder Name",
    cardNumber: isArabic ? "رقم البطاقة" : "Card Number",
    expiryDate: isArabic ? "تاريخ الانتهاء" : "Expiry Date",
    cvv: isArabic ? "رمز الأمان (CVV)" : "CVV",
    deleteConfirmTitle: isArabic ? "حذف الحساب نهائياً" : "Delete Account",
    deleteWarningText: isArabic 
      ? "هل أنت متأكد أنك تريد حذف حسابك؟ سيتم إزالة جميع سجلات الشحن والبيانات والمفتاح الرقمي نهائياً." 
      : "Are you sure you want to delete your account? All your charging history and virtual RFID key will be permanently removed.",
    noKeepIt: isArabic ? "لا، الاحتفاظ بالحساب" : "No, keep it",
    yesContinue: isArabic ? "نعم، متابعة" : "Yes, continue",
    deletePasswordPrompt: isArabic ? "لأمانك، يرجى إدخال كلمة المرور للتأكيد." : "For your security, please enter your password to confirm permanent deletion.",
    confirmDelete: isArabic ? "تأكيد الحذف" : "Confirm Delete",
    deleting: isArabic ? "جاري الحذف..." : "Deleting...",
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

  const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";

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
          className={`rounded-3xl p-5 mb-4 border shadow-sm flex items-center gap-4 transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-200/60"
          }`}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 bg-[#125833] text-white"
          >
            {userInitial}
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
            {currentUser.phoneNumber && (
              <p
                className={`text-xs mb-1.5 truncate ${
                  darkMode ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {currentUser.phoneNumber}
              </p>
            )}
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

        {/* Virtual RFID Key Card */}
        <div
          className={`rounded-3xl p-5 mb-6 border shadow-sm transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-[#E8F2EC] border-emerald-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio
                className={`w-4 h-4 ${
                  darkMode ? "text-[#4ade80]" : "text-[#125833]"
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-[#4ade80]" : "text-[#125833]"
                }`}
              >
                {t.virtualRfid}
              </span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {t.rfidActive}
            </span>
          </div>

          <div
            className={`font-mono text-base font-bold tracking-widest px-3 py-2 rounded-xl mb-2 ${
              darkMode ? "bg-black/50 text-white" : "bg-white text-neutral-800"
            }`}
          >
            {currentUser.rfidUid}
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            {t.rfidDescription}
          </p>
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
            {/* Wallet Option */}
            <button 
              onClick={() => setShowWalletModal(true)}
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
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.wallet}
                  </h4>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {t.walletSubtitle}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isArabic ? "rotate-180" : ""
                } ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}
              />
            </button>

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
                    {t.lastChangedPrefix}{formatTimeAgo(currentUser.passwordUpdatedAt, isArabic)}
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

        {/* Action Buttons: Log Out & Delete Account */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className={`w-full py-4 rounded-2xl border font-semibold flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-500/10 transition ${
              darkMode ? "border-neutral-800 bg-neutral-900" : "border-rose-200/60 bg-white"
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logOut}</span>
          </button>

          <button
            onClick={() => {
              setDeleteStep(1);
              setDeletePassword("");
              setDeleteError("");
              setShowDeleteModal(true);
            }}
            className={`w-full py-3.5 rounded-2xl border font-semibold flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition text-sm ${
              darkMode ? "border-neutral-800/80 bg-neutral-900/50" : "border-red-200/40 bg-white"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t.deleteAccount}</span>
          </button>
        </div>

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
                  onClick={() => handleSelectVehicle(vehicle.name)}
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

      {/* WALLET / CREDIT CARD MODAL */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t.wallet}</h3>
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setWalletSuccess("");
                }}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalletSave} className="space-y-4">
              {walletSuccess && (
                <div className="p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {walletSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">{t.cardHolder}</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                    darkMode 
                      ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                      : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                  }`}
                  placeholder={currentUser.name || "Cardholder Name"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">{t.cardNumber}</label>
                <input
                  type="text"
                  required
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                    darkMode 
                      ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                      : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                  }`}
                  placeholder="4532 •••• •••• 3482"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">{t.expiryDate}</label>
                  <input
                    type="text"
                    required
                    maxLength="5"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                      darkMode 
                        ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                        : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                    }`}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">{t.cvv}</label>
                  <input
                    type="password"
                    required
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition ${
                      darkMode 
                        ? "bg-neutral-950 border-neutral-800 focus:border-[#22c55e]" 
                        : "bg-neutral-50 border-neutral-200 focus:border-[#125833]"
                    }`}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalletModal(false)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition ${
                    darkMode ? "border-neutral-800 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition ${
                    darkMode ? "bg-[#22c55e] text-black hover:opacity-90 font-bold" : "bg-[#125833] text-white hover:opacity-90"
                  }`}
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
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
                  disabled={passwordLoading}
                  value={currentPassword}
                  onChange={(e) => {
                    setPasswordError("");
                    setCurrentPassword(e.target.value);
                  }}
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
                  disabled={passwordLoading}
                  value={newPassword}
                  onChange={(e) => {
                    setPasswordError("");
                    setNewPassword(e.target.value);
                  }}
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
                  disabled={passwordLoading}
                  value={confirmPassword}
                  onChange={(e) => {
                    setPasswordError("");
                    setConfirmPassword(e.target.value);
                  }}
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
                  disabled={passwordLoading}
                  onClick={() => setShowPasswordModal(false)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition ${
                    darkMode ? "border-neutral-800 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${
                    darkMode ? "bg-[#22c55e] text-black hover:opacity-90 font-bold" : "bg-[#125833] text-white hover:opacity-90"
                  }`}
                >
                  {passwordLoading ? t.saving : t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT TWO-STEP MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold">{t.deleteConfirmTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-full hover:bg-neutral-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Confirmation Warning */}
            {deleteStep === 1 && (
              <div className="space-y-4">
                <p className={`text-sm ${darkMode ? "text-neutral-300" : "text-neutral-600"}`}>
                  {t.deleteWarningText}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                      darkMode
                        ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {t.noKeepIt}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
                  >
                    {t.yesContinue}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Password Challenge */}
            {deleteStep === 2 && (
              <form onSubmit={handleDeleteSubmit} className="space-y-4">
                <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                  {t.deletePasswordPrompt}
                </p>

                {deleteError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center">
                    {deleteError}
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    placeholder={t.currentPassword}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeleteError("");
                      setDeletePassword(e.target.value);
                    }}
                    disabled={deleteLoading}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition ${
                      darkMode
                        ? "bg-neutral-950 border-neutral-800 text-white focus:border-red-500"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-red-500"
                    }`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                      darkMode
                        ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                  >
                    {deleteLoading ? t.deleting : t.confirmDelete}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}