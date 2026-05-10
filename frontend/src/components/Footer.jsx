import React from "react"
import { useTheme } from "../context/ThemeContext"

const Footer = () => {
  const { isDark } = useTheme()

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "border-t border-blue-500/20 bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 text-white"
          : "border-t border-slate-200 bg-linear-to-br from-white via-blue-50 to-white text-slate-900"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div
          className={`flex items-center justify-center text-xs sm:text-sm ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          
        </div>
      </div>
    </footer>
  )
}

export default Footer

/* ---------- COLUMN ---------- */
const FooterCol = ({ title, links, isDark }) => (
  <div>
    <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
      {title}
    </h4>

    <ul className="space-y-3 text-sm">
      {links.map((l, i) => (
        <li key={i}>
          {l.to ? (
            <Link
              to={l.to}
              className={`transition ${
                isDark
                  ? "text-gray-300 hover:text-blue-300"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {l.label}
            </Link>
          ) : (
            <span className={isDark ? "text-gray-300" : "text-slate-600"}>
              {l.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
)

/* ---------- LINK ---------- */
const FooterLink = ({ to, label, isDark }) => (
  <Link
    to={to}
    className={`transition ${
      isDark
        ? "hover:text-blue-300"
        : "hover:text-blue-600"
    }`}
  >
    {label}
  </Link>
)

/* ---------- SOCIAL ---------- */
const Social = ({ icon, isDark }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border ${
      isDark
        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        : "bg-white border-slate-200 text-blue-600 hover:bg-blue-50"
    }`}
  >
    {icon}
  </div>
)