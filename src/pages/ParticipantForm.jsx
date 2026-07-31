// import { useState } from "react";
// import api from "../services/api";
// import MessageModal from "../components/MessageModal";
// import { SEX_OPTIONS } from "../utils/bookingOptions"; // wherever SEX_OPTIONS lives

// export default function ParticipantForm() {
//   const [form, setForm] = useState({
//     name: "",
//     organization: "",
//     phone: "",
//     sex: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [modal, setModal] = useState({
//     open: false,
//     title: "",
//     message: "",
//     type: "info",
//   });

//   const showModal = (title, message, type = "info") =>
//     setModal({ open: true, title, message, type });

//   const submit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (
//       !form.name.trim() ||
//       !form.organization.trim() ||
//       !form.phone.trim() ||
//       !form.sex
//     ) {
//       showModal("ማስጠንቀቂያ", "እባክዎ ሁሉንም መስኮች ይሙሉ።", "error");
//       return;
//     }
//     try {
//       setLoading(true);
//       await api.post("/participants", form);
//       showModal("ተሳክቷል", "መረጃዎ በተሳካ ሁኔታ ተልኳል።", "success");
//       setForm({ name: "", organization: "", phone: "", sex: "" });
//     } catch (err) {
//       showModal(
//         "ማስጠንቀቂያ",
//         err.response?.data?.message || "ላክ አልተሳካም።",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-8">
//       <form
//         onSubmit={submit}
//         className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center text-emerald-700">
//           የተሳታፊ መረጃ | Participant Info
//         </h2>
//         <input
//           placeholder="ሙሉ ስም | Full Name"
//           className="border p-3 w-full rounded"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <input
//           placeholder="ድርጅት | Organization"
//           className="border p-3 w-full rounded"
//           value={form.organization}
//           onChange={(e) => setForm({ ...form, organization: e.target.value })}
//         />
//         <input
//           placeholder="ስልክ | Phone"
//           className="border p-3 w-full rounded"
//           value={form.phone}
//           onChange={(e) => setForm({ ...form, phone: e.target.value })}
//         />
//         <select
//           className="border p-3 w-full rounded"
//           value={form.sex}
//           onChange={(e) => setForm({ ...form, sex: e.target.value })}
//         >
//           <option value="">ጾታ | Sex</option>
//           {SEX_OPTIONS.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <button
//           disabled={loading}
//           className="bg-emerald-500 text-white w-full py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
//         >
//           {loading ? "በመላክ ላይ..." : "ላክ | Submit"}
//         </button>
//       </form>
//       <MessageModal
//         open={modal.open}
//         title={modal.title}
//         message={modal.message}
//         type={modal.type}
//         onClose={() => setModal((m) => ({ ...m, open: false }))}
//       />
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";
import MessageModal from "../components/MessageModal";
import { upsertTrackedBooking } from "../utils/trackedBookings";
import { ORGANIZATIONS, SEX_OPTIONS } from "../utils/bookingOptions";

const ALPHABETIC_REGEX = /^[A-Za-z\u1200-\u137F\s]*$/;
const PHONE_REGEX = /^09\d{8}$/;

function normalizeSpaces(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isAlphabeticText(value) {
  return (
    !!normalizeSpaces(value) && ALPHABETIC_REGEX.test(normalizeSpaces(value))
  );
}

export default function BookingForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    organization: "",
    phone: "",
    sex: "",
  });
  const [submitting, setSubmitting] = useState(false);

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

  const setFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameInput = (value, fieldLabel = "ሙሉ ስም") => {
    if (!ALPHABETIC_REGEX.test(value)) {
      showModal("ማስጠንቀቂያ", `${fieldLabel} ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።`, "error");
      return null;
    }
    return value;
  };

  const handlePhoneInput = (value, label = "ስልክ ቁጥር") => {
    const digits = String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);
    if (String(value || "") !== digits) {
      showModal(
        "ማስጠንቀቂያ",
        `${label} ቁጥር ብቻ መሆን አለበት፣ ከ10 ዲጂት በላይ አይፈቀድም።`,
        "error",
      );
    }
    return digits;
  };

  const validate = () => {
    if (!isAlphabeticText(form.name)) return "እባክዎ ሙሉ ስምዎትን ያስገቡ።";
    if (!normalizeSpaces(form.organization))
      return "እባክዎ የቤተሰብ ስም (ድርጅት)ን ይምረጡ።";
    if (!PHONE_REGEX.test(normalizeSpaces(form.phone))) {
      return "እባክዎ ስልክ ቁጥርን በ09 የሚጀምር 10 ዲጂት መሆን አለበት።";
    }
    if (!normalizeSpaces(form.sex)) return "እባክዎ ፆታዎን ይምረጡ።";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      showModal("ማስጠንቀቂያ", validationError, "error");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: normalizeSpaces(form.name),
        organization: normalizeSpaces(form.organization),
        phone: normalizeSpaces(form.phone),
        sex: normalizeSpaces(form.sex),
      };

      const res = await api.post("/bookings", payload);

      const booking = res.data?.booking || res.data;
      showModal(
        "ይጠብቁ",
        "መረጃዎትን በተሳካ ሁኔታ ለመላክ ተዘጋጅቷል። እሺ የሚለውን ይንኩ።",
        "success",
      );
      upsertTrackedBooking({
        bookingId: booking._id,
        name: booking.name,
        message:
          "Your official registration details have been received. Waiting for coordinator review.",
        updatedAt:
          booking.updatedAt || booking.createdAt || new Date().toISOString(),
        unread: false,
      });

      setTimeout(() => {
        navigate("/thank-you");
      }, 1200);
    } catch (submitError) {
      console.error(submitError.response?.data || submitError.message);
      showModal(
        "ማስጠንቀቂያ",
        submitError.response?.data?.message ||
          "የኢንተርኔት ወይም የሰርቨር መቋረጥ ተከስቷል። እባክዎ ደግመው ይሞክሩ።",
        "error",
      );
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
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition max-w-full"
            onClick={() => navigate("/")}
          >
            <img src={back} alt="back" className="w-5 h-5" />
            መመለስ
          </button>
        </div>

        <form
          onSubmit={submit}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center text-emerald-700">
            ለጉባኤ ቤተሰብ ለብሥራት ተሳትፎ የምዝገባ ቅጽ
          </h2>

          <p className="text-center text-gray-500 mb-6">
            እባክዎ መረጃዎትን በትክክል ይሙሉ፣ ለጉባኤው የተሳካ መሆን ቅድመ ዝግጅት ቁጥራዊ መረጃ ለመሰብሰብ ብቻ
            የተዘጋጀ ነው።
          </p>

          <input
            placeholder="ሙሉ ስም / Full Name"
            className="border p-3 mb-3 w-full rounded-xl"
            value={form.name}
            onChange={(e) => {
              const nextValue = handleNameInput(e.target.value);
              if (nextValue !== null) setFormField("name", nextValue);
            }}
          />

          <select
            className="border p-3 mb-3 w-full rounded-xl bg-white"
            value={form.organization}
            onChange={(e) => setFormField("organization", e.target.value)}
          >
            <option value="">የቤተሰብ ስም (ድርጅት) ይምረጡ / Select Organization</option>
            {ORGANIZATIONS.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="tel"
              placeholder="ስልክ ቁጥር / Phone Number"
              className="border p-3 w-full rounded-xl"
              value={form.phone}
              onChange={(e) =>
                setFormField("phone", handlePhoneInput(e.target.value))
              }
            />

            <select
              className="border p-3 w-full rounded-xl bg-white"
              value={form.sex}
              onChange={(e) => setFormField("sex", e.target.value)}
            >
              <option value="">ፆታ / Sex</option>
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={submitting}
            className="bg-emerald-500 text-white w-full py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {submitting ? "ይጠብቁ በመላክ ላይ ነው..." : "መረጃ ያስገቡ / Submit"}
          </button>

          <div className="text-sm text-gray-500 mt-4">
            * እባክዎ የሞሉት መረጃ ትክክለኛ መሆኑን ያረጋግጡ። ይህ ገጽ የይለፍ ቃል፣ የካርድ ቁጥር ወይም
            የመተግበሪያ ማውረጃ አይጠይቅም። የሰርቨር ወይም የኢንተርኔት ችግር ከተፈጠረ የማስጠንቀቂያ መልእክት
            ይታያል።
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
    </div>
  );
}
