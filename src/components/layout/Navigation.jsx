import React from "react";
import { NavLink } from "react-router-dom";
import { Zap, History, User } from "lucide-react";

export default function Navigation({ darkMode = false, isArabic = false }) {
  const t = {
    home: isArabic ? "الرئيسية" : "Home",
    transactions: isArabic ? "المعاملات" : "Transactions",
    profile: isArabic ? "الملف الشخصي" : "Profile",
  };

  const activeColor = darkMode ? "text-[#22c55e]" : "text-[#125833]";
  const inactiveColor = darkMode
    ? "text-neutral-500 hover:text-neutral-300"
    : "text-slate-400 hover:text-slate-600";

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50">
      <nav
        dir={isArabic ? "rtl" : "ltr"}
        className={`rounded-full px-8 py-3 shadow-lg border flex items-center gap-10 transition-colors ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-slate-200/60"
        }`}
      >
        {/* Home Route */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition ${
              isActive ? activeColor : inactiveColor
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Zap
                className={`w-5 h-5 ${
                  isActive
                    ? darkMode
                      ? "fill-[#22c55e]"
                      : "fill-[#125833]"
                    : ""
                }`}
              />
              <span
                className={`text-[11px] ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {t.home}
              </span>
            </>
          )}
        </NavLink>

        {/* Transactions Route */}
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition ${
              isActive ? activeColor : inactiveColor
            }`
          }
        >
          {({ isActive }) => (
            <>
              <History
                className={`w-5 h-5 ${
                  isActive ? "stroke-[2.5]" : "stroke-[2]"
                }`}
              />
              <span
                className={`text-[11px] ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {t.transactions}
              </span>
            </>
          )}
        </NavLink>

        {/* Profile Route */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition ${
              isActive ? activeColor : inactiveColor
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User
                className={`w-5 h-5 ${
                  isActive ? "stroke-[2.5]" : "stroke-[2]"
                }`}
              />
              <span
                className={`text-[11px] ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {t.profile}
              </span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}