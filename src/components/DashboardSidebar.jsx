import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const BRAND_DARK = "#00313c";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminSessionExpiresAt");
    navigate("/admin-login", { replace: true });
  };

  const linkBase =
    "block w-full rounded-xl px-4 py-3 font-semibold transition cursor-pointer text-sm md:text-base";
  const linkInactive = "text-white hover:bg-white/10";
  const linkActiveStyle = { backgroundColor: "#ffffff", color: BRAND_DARK };

  const closeMobileMenu = () => setOpen(false);

  const navItems = [
    { to: "/admin-dashboard", label: "Booking Overview" },
    { to: "/admin-participants", label: "Participants" },
    { to: "/admin-report", label: "Booking Verification Report" },
    { to: "/admin-history", label: "History Log" },
  ];

  return (
    <>
      <div
        className="md:hidden flex items-center justify-between text-white p-4"
        style={{ backgroundColor: BRAND_DARK }}
      >
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <button onClick={() => setOpen(!open)} className="text-3xl">
          ☰
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      <div
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64 md:w-60 shrink-0
          p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ backgroundColor: BRAND_DARK }}
      >
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-8 md:mb-10">
          Admin Panel
        </h2>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "" : linkInactive}`
              }
              style={({ isActive }) => (isActive ? linkActiveStyle : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition"
        >
          LOGOUT
        </button>
      </div>
    </>
  );
}
