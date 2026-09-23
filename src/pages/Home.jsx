// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Plus, 
  Zap, 
  Scan, 
  ChevronRight, 
  History, 
  User, 
  Mail,
  Activity,
  Gauge,
  CreditCard,
  BatteryCharging
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { darkMode, isArabic } = useTheme();

  // Retrieve current logged-in user dynamically
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userName = currentUser?.name || (isArabic ? "بلين" : "Blen");

  // Simulated live telemetry state matching the screenshot
  const [telemetry, setTelemetry] = useState({
    voltage: 230.4,
    current: 18.2,
    power: 4.19,
    energy: 1.02,
    powerFactor: 0.97,
    currentToCar: 62,
    maxCurrent: 80,
    rfidStatus: "Authorized"
  });

  // History buffer for the live trend graph
  const [trendPoints, setTrendPoints] = useState([3.8, 3.9, 4.0, 4.1, 4.15, 4.19]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const deltaCurrent = (Math.random() - 0.5) * 0.4;
        const current = +(prev.current + deltaCurrent).toFixed(1);
        const voltage = +(230 + (Math.random() - 0.5) * 1.5).toFixed(1);
        const power = +((voltage * current) / 1000).toFixed(2);
        const energy = +(prev.energy + power / 3600).toFixed(2);

        setTrendPoints((pts) => [...pts.slice(-14), power]);

        return {
          ...prev,
          voltage,
          current,
          power,
          energy
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Localization dictionary
  const t = {
    hiBlen: isArabic ? `مرحبًا، ${userName}` : `Hi, ${userName}`,
    availableBalance: isArabic ? "الرصيد المتاح" : "Available Balance",
    secureWallet: isArabic ? "محفظة آمنة" : "Secure wallet",
    addCredit: isArabic ? "إضافة رصيد" : "Add credit",
    chargingStatus: isArabic ? "حالة الشحن" : "Charging Status",
    notCharging: isArabic ? "لا يتم الشحن حاليًا" : "Not charging",
    nextChargeText: isArabic
      ? "شحنتك القادمة على بعد مسحة واحدة."
      : "Your next charge is just a tap away.",
    scanToCharge: isArabic ? "امسح للشحن" : "Tap to charge",
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

    // Telemetry translations
    liveTelemetry: isArabic ? "القياس الحي عن بُعد" : "Live telemetry",
    rfidAuthorized: isArabic ? "بطاقة RFID مصرح بها" : "RFID Authorized",
    voltage: isArabic ? "الجهد الكهربائي" : "Voltage",
    current: isArabic ? "التيار" : "Current",
    power: isArabic ? "القدرة" : "Power",
    energy: isArabic ? "الطاقة" : "Energy",
    powerFactor: isArabic ? "معامل القدرة" : "Power Factor",
    liveTrend: isArabic ? "القدرة (كيلوواط) — الاتجاه المباشر" : "Power (kW) — live trend",
    loadSplit: isArabic ? "توزيع الحمل" : "Load split",
    toCar: isArabic ? "إلى السيارة" : "to car",
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

  const userInitial = userName.charAt(0).toUpperCase();

  // Load split donut calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const splitPct = telemetry.currentToCar / telemetry.maxCurrent;
  const strokeDashoffset = circumference - splitPct * circumference;

  // Trendline SVG path generator
  const trendSvgPoints = trendPoints
    .map((val, idx) => {
      const x = (idx / (trendPoints.length - 1)) * 180 + 10;
      const y = 55 - ((val - 3.5) / 1.5) * 45;
      return `${x},${Math.max(10, Math.min(55, y))}`;
    })
    .join(" ");

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex justify-center px-4 sm:px-6 py-10 pb-28 font-sans transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="w-full max-w-md space-y-4">
        
        {/* Top Header */}
        <header className="flex items-center justify-between mb-4">
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
            {userInitial}
          </div>
        </header>

        {/* Greeting Section */}
        <div className="mb-2">
          <h1
            className={`text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {t.hiBlen}
          </h1>
        </div>

        {/* Available Balance Card */}
        <div
          className={`rounded-3xl p-6 shadow-sm relative overflow-hidden transition-colors ${
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
          className={`rounded-3xl p-5 border shadow-sm flex items-start gap-4 relative transition-colors ${
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
          className={`rounded-3xl p-4 shadow-sm flex items-center justify-between cursor-pointer transition ${
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
        <div>
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

        {/* LIVE TELEMETRY SECTION (Moved to Bottom) */}
        <div className="space-y-3 pt-2">
          {/* Telemetry Header */}
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {t.liveTelemetry}
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>RFID</span>
              <span className="font-bold">{t.rfidAuthorized}</span>
            </div>
          </div>

          {/* 2x2 Telemetry Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Voltage */}
            <div
              className={`rounded-2xl p-4 border shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>{t.voltage}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{telemetry.voltage}</span>
                <span className="text-xs text-neutral-400 font-medium">V</span>
              </div>
            </div>

            {/* Current */}
            <div
              className={`rounded-2xl p-4 border shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{t.current}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{telemetry.current}</span>
                <span className="text-xs text-neutral-400 font-medium">A</span>
              </div>
            </div>

            {/* Power */}
            <div
              className={`rounded-2xl p-4 border shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{t.power}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-500">▲ 0.0%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{telemetry.power}</span>
                <span className="text-xs text-neutral-400 font-medium">kW</span>
              </div>
            </div>

            {/* Energy */}
            <div
              className={`rounded-2xl p-4 border shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mb-1.5">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{t.energy}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{telemetry.energy}</span>
                <span className="text-xs text-neutral-400 font-medium">kWh</span>
              </div>
            </div>
          </div>

          {/* Power Factor Strip */}
          <div
            className={`rounded-2xl px-4 py-3 border flex items-center justify-between shadow-xs transition-colors ${
              darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
            }`}
          >
            <span className="text-xs font-medium text-neutral-500">{t.powerFactor}</span>
            <span className="text-sm font-bold tracking-tight">{telemetry.powerFactor}</span>
          </div>

          {/* Lower Charts Grid */}
          <div className="grid grid-cols-5 gap-3">
            {/* Live Trend Card */}
            <div
              className={`col-span-3 rounded-2xl p-4 border flex flex-col justify-between shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <span className="text-[11px] font-medium text-neutral-500">{t.liveTrend}</span>
              <div className="h-20 w-full flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65">
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendSvgPoints}
                  />
                  <circle
                    cx="190"
                    cy="35"
                    r="4"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            {/* Load Split Donut Card */}
            <div
              className={`col-span-2 rounded-2xl p-3 border flex flex-col items-center justify-between shadow-xs transition-colors ${
                darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200/80"
              }`}
            >
              <span className="text-[11px] font-medium text-neutral-500 self-start">{t.loadSplit}</span>
              
              <div className="relative w-20 h-20 my-1 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    stroke="#16a34a"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold leading-tight">{telemetry.currentToCar}A</span>
                  <span className="text-[9px] text-neutral-400">{t.toCar}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}