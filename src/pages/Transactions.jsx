import React, { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Transactions() {
  const { darkMode, isArabic } = useTheme();

  const [filter, setFilter] = useState("all"); // 'all', '7days', '30days', 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Translations dictionary for English and Arabic
  const t = {
    yourWallet: isArabic ? "محفظتك" : "Your Wallet",
    history: isArabic ? "السجل" : "History",
    allTime: isArabic ? "كل الأوقات" : "All time",
    last7Days: isArabic ? "آخر 7 أيام" : "Last 7 days",
    last30Days: isArabic ? "آخر 30 يومًا" : "Last 30 days",
    customRange: isArabic ? "نطاق مخصص" : "Custom Range",
    customDateRange: isArabic ? "نطاق تاريخ مخصص" : "Custom date range",
    startDate: isArabic ? "تاريخ البدء" : "START DATE",
    endDate: isArabic ? "تاريخ الانتهاء" : "END DATE",
    applyFilter: isArabic ? "تطبيق التصفية" : "Apply Filter",
    totalSpent: isArabic ? "إجمالي المنفق" : "Total Spent",
    energyUsed: isArabic ? "الطاقة المستهلكة" : "Energy Used",
    charger: isArabic ? "الشاحن" : "Charger",
    dateTime: isArabic ? "التاريخ والوقت" : "Date & Time",
    cost: isArabic ? "التكلفة" : "Cost",
    energy: isArabic ? "الطاقة" : "Energy",
    aed: isArabic ? "د.إ" : "AED",
    kwh: isArabic ? "كيلوواط/ساعة" : "kWh",
    noTransactions: isArabic 
      ? "لم يتم العثور على معاملات للفترة الزمنية المحددة." 
      : "No transactions found for the selected timeframe.",
    home: isArabic ? "الرئيسية" : "Home",
    transactions: isArabic ? "المعاملات" : "Transactions",
    profile: isArabic ? "الملف الشخصي" : "Profile",
    today: isArabic ? "اليوم، 10:42 صباحًا" : "Today, 10:42 AM",
    yesterday: isArabic ? "أمس، 6:18 مساءً" : "Yesterday, 6:18 PM",
  };

  // Sample transactions data with ISO dates for accurate filtering
  const allTransactions = [
    {
      id: 1,
      chargerId: "CHG-2048",
      location: isArabic ? "وسط المدينة" : "Downtown Hub",
      dateStr: t.today,
      isoDate: new Date().toISOString().split("T")[0], // Today
      cost: 42.8,
      energy: 28.5,
    },
    {
      id: 2,
      chargerId: "CHG-1982",
      location: isArabic ? "مارينا مول" : "Marina Mall",
      dateStr: t.yesterday,
      isoDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
      cost: 31.25,
      energy: 20.8,
    },
    {
      id: 3,
      chargerId: "CHG-1876",
      location: isArabic ? "محطة القوز" : "Al Quoz Station",
      dateStr: isArabic ? "24 سبتمبر 2024، 8:05 صباحًا" : "24 Sep 2024, 8:05 AM",
      isoDate: "2024-09-24",
      cost: 54.6,
      energy: 36.4,
    },
    {
      id: 4,
      chargerId: "CHG-1811",
      location: isArabic ? "سيتي ووك" : "City Walk",
      dateStr: isArabic ? "21 سبتمبر 2024، 7:34 مساءً" : "21 Sep 2024, 7:34 PM",
      isoDate: "2024-09-21",
      cost: 26.4,
      energy: 17.6,
    },
  ];

  // Filter transactions based on date range selection
  const filteredTransactions = useMemo(() => {
    const today = new Date();

    return allTransactions.filter((tx) => {
      const txDate = new Date(tx.isoDate);

      if (filter === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return txDate >= sevenDaysAgo;
      }

      if (filter === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return txDate >= thirtyDaysAgo;
      }

      if (filter === "custom" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return txDate >= start && txDate <= end;
      }

      return true; // 'all'
    });
  }, [filter, startDate, endDate, isArabic]);

  // Dynamically compute summary stats for filtered list
  const totalSpent = useMemo(
    () => filteredTransactions.reduce((acc, tx) => acc + tx.cost, 0),
    [filteredTransactions]
  );

  const totalEnergy = useMemo(
    () => filteredTransactions.reduce((acc, tx) => acc + tx.energy, 0),
    [filteredTransactions]
  );

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex justify-center px-6 py-10 pb-28 font-sans transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-neutral-100 text-neutral-900"
      }`}
    >
      {/* Matches the max-w-md container width */}
      <div className="w-full max-w-md">
        
        {/* Top Header */}
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
        </header>

        {/* Title & Filter Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className={`text-xs font-semibold tracking-[0.25em] uppercase mb-1 ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.yourWallet}
            </p>
            <h1
              className={`text-4xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              {t.history}
            </h1>
          </div>

          {/* Date Filter Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition ${
                darkMode
                  ? "bg-emerald-950/80 text-[#4ade80] border-emerald-900 hover:bg-emerald-900/60"
                  : "bg-emerald-50 text-[#125833] border-emerald-100 hover:bg-emerald-100/60"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="capitalize">
                {filter === "all"
                  ? t.allTime
                  : filter === "7days"
                  ? t.last7Days
                  : filter === "30days"
                  ? t.last30Days
                  : t.customRange}
              </span>
            </button>

            {/* Filter Selection Card */}
            {showDatePicker && (
              <div
                className={`absolute ${
                  isArabic ? "left-0" : "right-0"
                } mt-2 w-64 rounded-2xl shadow-xl border p-3 z-50 text-xs transition-colors ${
                  darkMode
                    ? "bg-neutral-900 border-neutral-800 text-white"
                    : "bg-white border-neutral-200/80 text-neutral-900"
                }`}
              >
                <div className="space-y-1 mb-3">
                  {[
                    { key: "all", label: t.allTime },
                    { key: "7days", label: t.last7Days },
                    { key: "30days", label: t.last30Days },
                    { key: "custom", label: t.customDateRange },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setFilter(option.key);
                        if (option.key !== "custom") setShowDatePicker(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl font-medium transition ${
                        filter === option.key
                          ? darkMode
                            ? "bg-[#22c55e] text-black font-bold"
                            : "bg-[#125833] text-white"
                          : darkMode
                          ? "text-neutral-300 hover:bg-neutral-800"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Inputs */}
                {filter === "custom" && (
                  <div
                    className={`pt-2 border-t space-y-2 ${
                      darkMode ? "border-neutral-800" : "border-neutral-100"
                    }`}
                  >
                    <div>
                      <label
                        className={`block text-[10px] mb-1 font-semibold ${
                          darkMode ? "text-neutral-400" : "text-neutral-400"
                        }`}
                      >
                        {t.startDate}
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded-lg outline-none text-xs transition ${
                          darkMode
                            ? "bg-neutral-800 border-neutral-700 text-white focus:border-[#4ade80]"
                            : "bg-white border-neutral-300 text-neutral-800 focus:border-[#125833]"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-[10px] mb-1 font-semibold ${
                          darkMode ? "text-neutral-400" : "text-neutral-400"
                        }`}
                      >
                        {t.endDate}
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded-lg outline-none text-xs transition ${
                          darkMode
                            ? "bg-neutral-800 border-neutral-700 text-white focus:border-[#4ade80]"
                            : "bg-white border-neutral-300 text-neutral-800 focus:border-[#125833]"
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className={`w-full mt-2 py-1.5 rounded-lg font-semibold transition ${
                        darkMode
                          ? "bg-[#22c55e] text-black hover:bg-emerald-400"
                          : "bg-[#125833] text-white hover:bg-emerald-900"
                      }`}
                    >
                      {t.applyFilter}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary Container */}
        <div
          className={`rounded-3xl p-5 mb-6 flex justify-between items-center shadow-sm border transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-[#E8F2EC] border-emerald-100"
          }`}
        >
          <div>
            <p
              className={`text-[11px] font-bold tracking-wider uppercase mb-1 ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.totalSpent}
            </p>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              {t.aed} {totalSpent.toFixed(2)}
            </div>
          </div>

          <div>
            <p
              className={`text-[11px] font-bold tracking-wider uppercase mb-1 ${
                darkMode ? "text-[#4ade80]" : "text-[#125833]"
              }`}
            >
              {t.energyUsed}
            </p>
            <div
              className={`text-2xl font-bold flex items-baseline gap-1 ${
                darkMode ? "text-white" : "text-neutral-900"
              }`}
            >
              <span>{totalEnergy.toFixed(1)}</span>
              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {t.kwh}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions Table Container */}
        <div
          className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${
            darkMode
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-200/60"
          }`}
        >
          {/* Table Header */}
          <div
            className={`px-4 py-3 border-b grid grid-cols-12 text-[10px] font-bold tracking-wider uppercase transition-colors ${
              darkMode
                ? "bg-neutral-950 text-neutral-500 border-neutral-800"
                : "bg-[#F4F7F4] text-neutral-400 border-neutral-200/60"
            }`}
          >
            <span className="col-span-4">{t.charger}</span>
            <span className="col-span-4">{t.dateTime}</span>
            <span className="col-span-2 text-end">{t.cost}</span>
            <span className="col-span-2 text-end">{t.energy}</span>
          </div>

          {/* Table Rows */}
          {filteredTransactions.length > 0 ? (
            <div
              className={`divide-y ${
                darkMode ? "divide-neutral-800" : "divide-neutral-100"
              }`}
            >
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`px-4 py-4 grid grid-cols-12 items-center text-xs transition ${
                    darkMode
                      ? "hover:bg-neutral-800/50"
                      : "hover:bg-neutral-50/60"
                  }`}
                >
                  {/* Charger Info */}
                  <div className="col-span-4">
                    <p
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {tx.chargerId}
                    </p>
                    <p
                      className={`text-[11px] ${
                        darkMode ? "text-neutral-400" : "text-neutral-400"
                      }`}
                    >
                      {tx.location}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div
                    className={`col-span-4 font-medium ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {tx.dateStr}
                  </div>

                  {/* Cost */}
                  <div
                    className={`col-span-2 text-end font-bold ${
                      darkMode ? "text-[#4ade80]" : "text-[#125833]"
                    }`}
                  >
                    {t.aed} {tx.cost.toFixed(2)}
                  </div>

                  {/* Energy */}
                  <div
                    className={`col-span-2 text-end font-medium ${
                      darkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {tx.energy} {t.kwh}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-8 text-center text-xs ${
                darkMode ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              {t.noTransactions}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}