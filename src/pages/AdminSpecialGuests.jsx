import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import api from "../services/api";
import AdminMenu from "../components/AdminMenu";
import MessageModal from "../components/MessageModal";
import { ORGANIZATIONS, SEX_OPTIONS } from "../utils/bookingOptions";

const BRAND_DARK = "#00313c";
const BRAND_DARKER = "#022e38";
const empty = { name: "", organization: "", phone: "", sex: "" };

export default function AdminSpecialGuests() {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [lastGuest, setLastGuest] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));
  const show = (title, message, type = "info") =>
    setModal({ open: true, title, message, type });

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (
      !form.name.trim() ||
      !form.organization ||
      !/^09\d{8}$/.test(form.phone) ||
      !form.sex
    ) {
      show("መረጃ አልተሟላም", "እባክዎ ስም፣ ድርጅት፣ 09XXXXXXXX ስልክ እና ፆታ ያስገቡ።", "error");
      return;
    }
    try {
      setBusy(true);
      const r = await api.post("/bookings/special-guests", form);
      setLastGuest(r.data?.booking || null);
      setForm(empty);
      show(
        "ተመዝግቧል / PRESENT",
        `የልዩ እንግዳው ተመዝግቧል።\n\n${r.data?.booking?.name || "Participant"}\n${r.data?.booking?.organization || ""}\n\nሁኔታ፦ PRESENT\nQR መቃኘት አያስፈልግም።`,
        "success",
      );
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminSessionExpiresAt");
        navigate("/admin-login", { replace: true });
        return;
      }
      show(
        err.response?.status === 409 ? "Already Registered" : "ስህተት",
        err.response?.data?.message || "ልዩ እንግዳውን መመዝገብ አልተቻለም።",
        "error",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 overflow-x-hidden">
      <AdminMenu activeId="special-guests" />
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black bg-amber-100 text-amber-800 mb-3">
                <ShieldCheck size={15} /> ADMIN ONLY
              </div>
              <h1
                className="text-3xl md:text-4xl font-black"
                style={{ color: BRAND_DARK }}
              >
                Non-registered Participant Registration
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                ለልዩ እንግዶች እና መጀመሪያ በሊንክ ያልተመዘገቡ አባልት መመዝገቢያ ብቻ። Public
                registration is closed, but authorized staff can add
                Non-registered by link here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin-participants")}
              className="rounded-xl px-4 py-3 bg-white border border-slate-200 font-bold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
              style={{ color: BRAND_DARK }}
            >
              ← Participants Dashboard
            </button>
          </div>
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
            <form
              onSubmit={submit}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg,${BRAND_DARK},#0b6b68)`,
                  }}
                >
                  <UserPlus size={25} />
                </div>
                <div>
                  <h2
                    className="text-xl font-black"
                    style={{ color: BRAND_DARK }}
                  >
                    Add Non-registered Participant & Mark PRESENT
                  </h2>
                  <p className="text-sm text-slate-500">
                    The Non-registered and guest will be marked PRESENT
                    immediately.
                  </p>
                </div>
              </div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                ሙሉ ስም / Full Name
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="የእንግዳው ሙሉ ስም"
                />
              </label>
              <label className="block text-sm font-bold text-slate-700 mt-4 mb-2">
                ድርጅት / Organization
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                  value={form.organization}
                  onChange={(e) => set("organization", e.target.value)}
                >
                  <option value="">Select organization</option>
                  {ORGANIZATIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <label className="block text-sm font-bold text-slate-700">
                  ስልክ / Phone
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                    value={form.phone}
                    onChange={(e) =>
                      set(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="09XXXXXXXX"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  ፆታ / Sex
                  <select
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                    value={form.sex}
                    onChange={(e) => set("sex", e.target.value)}
                  >
                    <option value="">Select sex</option>
                    {SEX_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="mt-6 w-full rounded-xl py-3.5 text-white font-black shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg,${BRAND_DARKER},#08746a)`,
                }}
              >
                {busy ? "በመመዝገብ ላይ…" : "Register Guest & Mark PRESENT"}
              </button>
            </form>
            <aside
              className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg,${BRAND_DARKER},#075c5a)`,
              }}
            >
              <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-white/10" />
              <div className="relative">
                <p className="text-amber-300 font-black tracking-wider text-xs">
                  ATTENDANCE RULE
                </p>
                <h2 className="text-2xl font-black mt-2">
                  No QR scan required
                </h2>
                <p className="text-white/75 mt-3 leading-7">
                  This page does not reopen public registration. The existing
                  Booking/Attendance system records the guest as present
                  immediately.
                </p>
                <div className="mt-7 space-y-3">
                  {[
                    "Public registration remains closed",
                    "Admin authentication is required",
                    "Guest is counted as PRESENT immediately",
                    "Live screen and ticker update automatically",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex gap-3 items-start rounded-xl bg-white/10 p-3"
                    >
                      <CheckCircle2
                        size={19}
                        className="text-amber-300 shrink-0 mt-0.5"
                      />
                      <span className="text-sm font-semibold">{t}</span>
                    </div>
                  ))}
                </div>
                {lastGuest && (
                  <div className="mt-7 rounded-2xl bg-white/10 border border-white/15 p-4">
                    <p className="text-xs text-white/60 font-bold">
                      LAST ADDED
                    </p>
                    <p className="font-black text-lg mt-1">{lastGuest.name}</p>
                    <p className="text-sm text-white/75">
                      {lastGuest.organization}
                    </p>
                    <p className="mt-2 text-emerald-200 font-black">
                      ✓ PRESENT
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <MessageModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal((v) => ({ ...v, open: false }))}
      />
    </div>
  );
}
