import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Plus, 
  Zap, 
  Scan, 
  ChevronRight, 
  History, 
  User, 
  Mail 
} from "lucide-react";

export default function Home({ darkMode = false, isArabic = false }) {
  const navigate = useNavigate();

  // Localization dictionary
  const t = {
    goodMorning: isArabic ? "صباح الخير" : "Good Morning",
    hiBlen: isArabic ? "مرحبًا، بلين" : "Hi, Blen",
    availableBalance: isArabic ? "الرصيد المتاح" : "Available Balance",
    secureWallet: isArabic ? "محفظة آمنة" : "Secure wallet",
    addCredit: isArabic ? "إضافة رصيد" : "Add credit",
    chargingStatus: isArabic ? "حالة الشحن" : "Charging Status",
    notCharging: isArabic ? "لا يتم الشحن حاليًا" : "Not charging",
    nextChargeText: isArabic
      ? "شحنتك القادمة على بعد مسحة واحدة."
      : "Your next charge is just a scan away.",
    scanToCharge: isArabic ? "امسح للشحن" : "Scan to charge",
    tapPhoneText: isArabic
      ? "ضع هاتفك على أي شاحن فولتو"
      : "Tap your phone on any Volto charger",
    recentActivity: isArabic ? "النشاط الحديث" : "Recent activity",
    viewAll: isArabic ? "عرض الكل" : "View all",
    home: isArabic ? "الرئيسية" : "Home",
    transactions: isArabic ? "المعاملات" : "Transactions",
    profile: isArabic ? "الملف الشخصي" : "Profile",
    today: isArabic ? "اليوم، 10:42 صباحًا" : "Today, 10:42 AM",
    yesterday: isArabic ? "أمس، 6:18 مساءً" : "Yesterday, 6:18 PM",
    aed: isArabic ? "د.إ" : "AED",
    kwh: isArabic ? "كيلوواط/ساعة" : "kWh",
  };

  const recentActivities = [
    {
      id: 1,
      location: isArabic ? "وسط المدينة" : "Downtown Hub",
      time: t.today,
      amount: `${t.aed} 42.80`,
      energy: `28.5 ${t.kwh}`,
    },
    {
      id: 2,
      location: isArabic ? "مارينا مول" : "Marina Mall",
      time: t.yesterday,
      amount: `${t.aed} 31.25`,
      energy: `20.8 ${t.kwh}`,
    },
    {
      id: 3,
      location: isArabic ? "محطة القوز" : "Al Quoz Station",
      time: isArabic ? "24 سبتمبر 2024، 8:05 صباحًا" : "24 Sep 2024, 8:05 AM",
      amount: `${t.aed} 54.60`,
      energy: `36.4 ${t.kwh}`,
    },
  ];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex justify-center px-6 py-10 pb-28 font-sans transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Matches the max-w-md width from Signup */}
      <div className="w-full max-w-md">
        
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-sm transition-colors ${
                darkMode
                  ? "bg-[#22c55e] text-black font-bold"
                  : "bg-[#125833] text-white"
              }`}
            >
              ⌁
            </div>
            <span
              className={`font-bold text-xl tracking-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              volto
            </span>
          </div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm transition-colors ${
              darkMode
                ? "bg-[#22c55e] text-black"
                : "bg-[#125833] text-white"
            }`}
          >
            B
          </div>
        </header>

        {/* Greeting Section */}
        <div className="mb-6">
          <p
            className={`text-xs font-semibold tracking-[0.25em] uppercase mb-1 ${
              darkMode ? "text-[#4ade80]" : "text-[#125833]"
            }`}
          >
            {t.goodMorning}
          </p>
          <h1
            className={`text-4xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {t.hiBlen}
          </h1>
        </div>

        {/* Available Balance Card */}
        <div
          className={`rounded-3xl p-6 mb-4 shadow-sm relative overflow-hidden transition-colors ${
            darkMode
              ? "bg-neutral-900 border border-neutral-800 text-white"
              : "bg-[#123E28] text-white"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-xs font-semibold tracking-wider uppercase ${
                darkMode ? "text-[#4ade80]" : "text-emerald-300"
              }`}
            >
              {t.availableBalance}
            </span>
            <button
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                darkMode
                  ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                  : "bg-[#1D4E35] text-emerald-100 hover:bg-[#256143]"
              }`}
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold tracking-tight">
              {t.aed} 3,000
            </span>
            <span
              className={`text-xl font-bold ${
                darkMode ? "text-neutral-400" : "text-emerald-200"
              }`}
            >
              .00
            </span>
          </div>

          <div
            className={`pt-4 border-t flex items-center justify-between text-xs ${
              darkMode ? "border-neutral-800" : "border-emerald-900/60"
            }`}
          >
            <div
              className={`flex items-center gap-1.5 ${
                darkMode ? "text-neutral-400" : "text-emerald-200/90"
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${
                  darkMode ? "text-[#4ade80]" : "text-emerald-300"
                }`}
              />
              <span>{t.secureWallet}</span>
            </div>
            <button className="flex items-center gap-1 text-white font-medium hover:underline">
              <span>{t.addCredit}</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Charging Status Card */}
        <div
          className={`rounded-3xl p-5 mb-4 border shadow-sm flex items-start gap-4 relative transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-slate-200/60"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              darkMode
                ? "bg-emerald-950/80 text-[#4ade80]"
                : "bg-[#E8F2EC] text-[#125833]"
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <p
              className={`text-xs font-semibold tracking-wider uppercase mb-1 ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.chargingStatus}
            </p>
            <h3
              className={`text-base font-semibold mb-1 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {t.notCharging}
            </h3>
            <p
              className={`text-xs ${
                darkMode ? "text-neutral-400" : "text-slate-500"
              }`}
            >
              {t.nextChargeText}
            </p>
          </div>

          <span
            className={`w-2 h-2 rounded-full absolute top-6 ${
              isArabic ? "left-6" : "right-6"
            } ${darkMode ? "bg-neutral-700" : "bg-slate-300"}`}
          />
        </div>

        {/* Scan to Charge Banner */}
        <div
          className={`rounded-3xl p-4 mb-8 shadow-sm flex items-center justify-between cursor-pointer transition ${
            darkMode
              ? "bg-[#22c55e] text-black hover:bg-emerald-400"
              : "bg-[#125833] text-white hover:bg-[#0d4226]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-black text-[#22c55e]" : "bg-white text-[#125833]"
              }`}
            >
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-base leading-snug">
                {t.scanToCharge}
              </h4>
              <p
                className={`text-xs ${
                  darkMode ? "text-neutral-800" : "text-emerald-100/90"
                }`}
              >
                {t.tapPhoneText}
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 ${
              isArabic ? "rotate-180" : ""
            } ${darkMode ? "text-black" : "text-emerald-100"}`}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {t.recentActivity}
            </h2>
            <button
              onClick={() => navigate("/transactions")}
              className={`text-xs font-semibold hover:underline ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.viewAll}
            </button>
          </div>

          {/* Activity List Container */}
          <div
            className={`rounded-3xl border overflow-hidden shadow-sm transition-colors ${
              darkMode
                ? "bg-neutral-900 border-neutral-800 divide-y divide-neutral-800"
                : "bg-white border-slate-200/60 divide-y divide-slate-100"
            }`}
          >
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 flex items-center justify-between transition ${
                  darkMode
                    ? "hover:bg-neutral-800/50"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      darkMode
                        ? "bg-emerald-950/80 text-[#4ade80]"
                        : "bg-[#E8F2EC] text-[#125833]"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5
                      className={`font-semibold text-sm ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {activity.location}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <p
                    className={`font-bold text-sm ${
                      darkMode ? "text-[#4ade80]" : "text-[#125833]"
                    }`}
                  >
                    {activity.amount}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {activity.energy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <nav
          className={`rounded-full px-8 py-3 shadow-lg border flex items-center gap-10 transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-slate-200/60"
          }`}
        >
          <button
            className={`flex flex-col items-center gap-1 ${
              darkMode ? "text-[#22c55e]" : "text-[#125833]"
            }`}
          >
            <Zap
              className={`w-5 h-5 ${
                darkMode ? "fill-[#22c55e]" : "fill-[#125833]"
              }`}
            />
            <span className="text-[11px] font-bold">{t.home}</span>
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className={`flex flex-col items-center gap-1 transition ${
              darkMode
                ? "text-neutral-500 hover:text-neutral-300"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[11px] font-medium">{t.transactions}</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 transition ${
              darkMode
                ? "text-neutral-500 hover:text-neutral-300"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-medium">{t.profile}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}