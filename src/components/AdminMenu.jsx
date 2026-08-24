import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MENU = [
  {
    id: "dashboard",
    // label: "Bookingkk Overview",
    path: "",
    toolTips: "Disabled for now",
  },
  // /admin-dashboard" },
  { id: "participants", label: "Participants", path: "/admin-participants" },
  {
    id: "special-guests",
    label: "⭐ Non-registered Participants ",
    path: "/admin-special-guests",
  },
  {
    id: "report",
    label: "",
    // Booking Verification Report",
    path: "",
    toolTips: "Disabled for now",
  },
  // /admin-report" },
  {
    id: "history",
    // label: "History Log",
    path: "",
    toolTips: "Disabled for now",
  },
  // /admin-history" },
  { id: "logout", label: "LOGOUT", action: "logout" },
];

export default function AdminMenu({ activeId }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const handleMenu = (item) => {
    setSidebarOpen(false);
    if (item.action === "logout") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminSessionExpiresAt");
      navigate("/admin-login");
      return;
    }
    if (item.path) navigate(item.path);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-emerald-700 text-white w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute left-0 top-1 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "rotate-45 top-3" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-3 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-5 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "-rotate-45 top-3" : ""
            }`}
          />
        </div>
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky md:top-0 self-start z-40 h-screen w-64 bg-emerald-950 text-white pt-16 md:pt-6 p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <ul className="space-y-4">
          {MENU.map((item) => (
            <li
              key={item.id}
              onClick={() => handleMenu(item)}
              className={`cursor-pointer p-3 rounded-xl transition-all duration-300 ${
                item.id === activeId
                  ? "bg-white text-emerald-950 font-bold shadow"
                  : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
