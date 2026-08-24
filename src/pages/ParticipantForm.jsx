import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";
import MessageModal from "../components/MessageModal";
import { ORGANIZATIONS } from "../utils/bookingOptions";

const PHONE_REGEX = /^09\d{8}$/;
const BRAND_DARK = "#00313c";
const BRAND_DARKER = "#022e38";
const BRAND_ACCENT = "#f2b134";

function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function sanitizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function safeFileName(name = "participant") {
  return String(name).replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "participant";
}

function downloadQr(dataUrl, name = "participant-qr") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${safeFileName(name)}-qr.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function shareQr(dataUrl, participant) {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], "participant-qr.png", { type: "image/png" });

    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare({ files: [file] }))
    ) {
      await navigator.share({
        title: "Gubae Beteseb Attendance QR",
        text: `${participant.name} - ${participant.organization}`,
        files: [file],
      });
      return;
    }

    downloadQr(dataUrl, participant.name);
  } catch (error) {
    if (error?.name !== "AbortError") downloadQr(dataUrl, participant.name);
  }
}

function saveMatches(matches) {
  if (!matches?.length) return;
  const first = matches[0];
  localStorage.setItem(
    "latestParticipantQr",
    JSON.stringify({
      qrDataUrl: first.qrDataUrl,
      name: first.name || "Participant",
      organization: first.organization || "",
      bookingId: first._id,
    }),
  );
}

export default function ParticipantForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", organization: "" });
  const [submitting, setSubmitting] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const showModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const phone = normalizeSpaces(form.phone);
    const organization = normalizeSpaces(form.organization);

    if (!PHONE_REGEX.test(phone)) {
      showModal(
        "ማስጠንቀቂያ",
        "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ። 09XXXXXXXX መሆን አለበት።",
        "error",
      );
      return;
    }

    if (!organization) {
      showModal(
        "ማስጠንቀቂያ",
        "እባክዎ የቤተሰብ ስም (ድርጅት) ይምረጡ።",
        "error",
      );
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/bookings/recover-by-phone-org", {
        phone,
        organization,
      });

      const found = Array.isArray(response.data?.matches)
        ? response.data.matches
        : [];

      if (!found.length) {
        showModal(
          "Registration Not Found",
          "You are not registered, please contact the support team",
          "warning",
        );
        return;
      }

      setMatches(found);
      saveMatches(found);
      setQrOpen(true);
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 404 && data?.notRegistered) {
        showModal(
          "Registration Not Found",
          "You are not registered, please contact the support team",
          "warning",
        );
      } else {
        showModal(
          "ማስጠንቀቂያ",
          data?.message ||
            "የሰርቨር ወይም የኢንተርኔት ችግር ተከስቷል። እባክዎ ደግመው ይሞክሩ።",
          "error",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-6 md:py-8 overflow-x-hidden">
      <div className="w-full max-w-3xl min-w-0">
        <div className="text-left mb-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
            onClick={() => navigate("/")}
            style={{ color: BRAND_DARKER }}
          >
            <img src={back} alt="back" className="w-5 h-5" />
            መመለስ
          </button>
        </div>

        <form
          onSubmit={submit}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-xl"
        >
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-4 text-center"
            style={{ color: BRAND_DARKER }}
          >
            የእርስዎን የመግቢያ QR Code ለማግኘት
          </h2>

          <p className="text-center text-gray-500 mb-7 leading-relaxed">
            እባክዎ ሲመዘገቡ የተጠቀሙትን ስልክ ቁጥር እና ድርጅት ይምረጡ።
            <br />
            Enter the phone number and organization used during registration.
          </p>

          <label className="block mb-2 font-bold text-gray-700">
            ስልክ ቁጥር / Phone Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="09XXXXXXXX"
            className="border border-gray-200 p-4 mb-5 w-full rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: sanitizePhone(e.target.value) }))
            }
            maxLength={10}
          />

          <label className="block mb-2 font-bold text-gray-700">
            የቤተሰብ ስም / Organization
          </label>
          <select
            className="border border-gray-200 p-4 mb-6 w-full rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            value={form.organization}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, organization: e.target.value }))
            }
          >
            <option value="">
              የቤተሰብ ስም (ድርጅት) ይምረጡ / Select Organization
            </option>
            {ORGANIZATIONS.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-extrabold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: BRAND_DARK }}
          >
            {submitting ? "QR ኮድዎን በመፈለግ ላይ..." : "QR ኮድ ይፈልጉ / Get My QR Code"}
          </button>

          <div className="text-sm text-gray-500 mt-5 text-center">
            ይህ ገጽ አዲስ ምዝገባ አያደርግም። የተመዘገቡ ተሳታፊዎች ብቻ የQR ኮድ ማግኘት ይችላሉ።
          </div>
        </form>
      </div>

      <MessageModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />

      {qrOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div
              className="px-6 py-5 text-white rounded-t-3xl"
              style={{
                background: `linear-gradient(135deg, ${BRAND_DARKER}, ${BRAND_DARK})`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">
                    Registration Found
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold mt-1">
                    የእርስዎ የመግቢያ QR Code
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {matches.length > 1
                      ? `${matches.length} registrations were found for this phone number and organization.`
                      : "Your registered QR code is ready."}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                  QR
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {matches.length > 1 && (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <p className="font-extrabold">
                    ⚠️ ተመሳሳይ ስልክ ቁጥር እና ድርጅት በተለያዩ ስሞች ተመዝግበዋል።
                  </p>
                  <p className="text-sm mt-1">
                    Two or more participants use this same phone number and organization. Each original QR code is shown separately below.
                  </p>
                </div>
              )}

              <div
                className={`grid gap-5 ${matches.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}
              >
                {matches.map((participant, index) => (
                  <div
                    key={participant._id || `${participant.name}-${index}`}
                    className="rounded-2xl border border-emerald-100 bg-white p-4 md:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                  >
                    <div className="mb-3">
                      <div className="text-xs uppercase tracking-wider text-gray-500">
                        Participant {index + 1}
                      </div>
                      <div className="text-xl font-extrabold text-gray-900 mt-1">
                        {participant.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {participant.organization}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                      <img
                        src={participant.qrDataUrl}
                        alt={`${participant.name} QR code`}
                        className="w-full max-w-[320px] aspect-square object-contain mx-auto rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => downloadQr(participant.qrDataUrl, participant.name)}
                        className="rounded-xl py-3 px-4 font-extrabold text-white shadow-md hover:-translate-y-0.5 transition"
                        style={{ backgroundColor: BRAND_DARK }}
                      >
                        Download QR
                      </button>
                      <button
                        type="button"
                        onClick={() => shareQr(participant.qrDataUrl, participant)}
                        className="rounded-xl py-3 px-4 font-extrabold border-2 hover:bg-emerald-50 transition"
                        style={{ borderColor: BRAND_DARK, color: BRAND_DARK }}
                      >
                        Share QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setQrOpen(false)}
                className="mt-6 w-full rounded-xl py-3 px-4 font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Close / ዝጋ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
