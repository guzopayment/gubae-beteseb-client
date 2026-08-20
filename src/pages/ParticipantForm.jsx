// // import { useState } from "react";
// // import api from "../services/api";
// // import MessageModal from "../components/MessageModal";
// // import { SEX_OPTIONS } from "../utils/bookingOptions"; // wherever SEX_OPTIONS lives

// // export default function ParticipantForm() {
// //   const [form, setForm] = useState({
// //     name: "",
// //     organization: "",
// //     phone: "",
// //     sex: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [modal, setModal] = useState({
// //     open: false,
// //     title: "",
// //     message: "",
// //     type: "info",
// //   });

// //   const showModal = (title, message, type = "info") =>
// //     setModal({ open: true, title, message, type });

// //   const recoverDuplicateQr = async (bookingOverride = null, payloadOverride = null) => {
// //     e.preventDefault();
// //     if (loading) return;
// //     if (
// //       !form.name.trim() ||
// //       !form.organization.trim() ||
// //       !form.phone.trim() ||
// //       !form.sex
// //     ) {
// //       showModal("ማስጠንቀቂያ", "እባክዎ ሁሉንም መስኮች ይሙሉ።", "error");
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       await api.post("/participants", form);
// //       showModal("ተሳክቷል", "መረጃዎ በተሳካ ሁኔታ ተልኳል።", "success");
// //       setForm({ name: "", organization: "", phone: "", sex: "" });
// //     } catch (err) {
// //       showModal(
// //         "ማስጠንቀቂያ",
// //         err.response?.data?.message || "ላክ አልተሳካም።",
// //         "error",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-8">
// //       <form
// //         onSubmit={submit}
// //         className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
// //       >
// //         <h2 className="text-2xl font-bold text-center text-emerald-700">
// //           የተሳታፊ መረጃ | Participant Info
// //         </h2>
// //         <input
// //           placeholder="ሙሉ ስም | Full Name"
// //           className="border p-3 w-full rounded"
// //           value={form.name}
// //           onChange={(e) => setForm({ ...form, name: e.target.value })}
// //         />
// //         <input
// //           placeholder="ድርጅት | Organization"
// //           className="border p-3 w-full rounded"
// //           value={form.organization}
// //           onChange={(e) => setForm({ ...form, organization: e.target.value })}
// //         />
// //         <input
// //           placeholder="ስልክ | Phone"
// //           className="border p-3 w-full rounded"
// //           value={form.phone}
// //           onChange={(e) => setForm({ ...form, phone: e.target.value })}
// //         />
// //         <select
// //           className="border p-3 w-full rounded"
// //           value={form.sex}
// //           onChange={(e) => setForm({ ...form, sex: e.target.value })}
// //         >
// //           <option value="">ጾታ | Sex</option>
// //           {SEX_OPTIONS.map((s) => (
// //             <option key={s} value={s}>
// //               {s}
// //             </option>
// //           ))}
// //         </select>
// //         <button
// //           disabled={loading}
// //           className="bg-emerald-500 text-white w-full py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
// //         >
// //           {loading ? "በመላክ ላይ..." : "ላክ | Submit"}
// //         </button>
// //       </form>
// //       <MessageModal
// //         open={modal.open}
// //         title={modal.title}
// //         message={modal.message}
// //         type={modal.type}
// //         onClose={() => setModal((m) => ({ ...m, open: false }))}
// //       />
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import back from "../assets/home.png";
// import MessageModal from "../components/MessageModal";
// import { upsertTrackedBooking } from "../utils/trackedBookings";
// import { ORGANIZATIONS, SEX_OPTIONS } from "../utils/bookingOptions";
// // import Participant from "../../../../shared-server-updated/shared-server-updated/models/Participant";

// const ALPHABETIC_REGEX = /^[A-Za-z\u1200-\u137F\s]*$/;
// const PHONE_REGEX = /^09\d{8}$/;

// function normalizeSpaces(value) {
//   return String(value || "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function isAlphabeticText(value) {
//   return (
//     !!normalizeSpaces(value) && ALPHABETIC_REGEX.test(normalizeSpaces(value))
//   );
// }

// export default function BookingForm() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     organization: "",
//     phone: "",
//     sex: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState("info");

//   const showModal = (title, message, type = "info") => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setModalType(type);
//     setModalOpen(true);
//   };

//   const setFormField = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNameInput = (value, fieldLabel = "ሙሉ ስም") => {
//     if (!ALPHABETIC_REGEX.test(value)) {
//       showModal("ማስጠንቀቂያ", `${fieldLabel} ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።`, "error");
//       return null;
//     }
//     return value;
//   };

//   const handlePhoneInput = (value, label = "ስልክ ቁጥር") => {
//     const digits = String(value || "")
//       .replace(/\D/g, "")
//       .slice(0, 10);
//     if (String(value || "") !== digits) {
//       showModal(
//         "ማስጠንቀቂያ",
//         `${label} ቁጥር ብቻ መሆን አለበት፣ ከ10 ዲጂት በላይ አይፈቀድም።`,
//         "error",
//       );
//     }
//     return digits;
//   };

//   const validate = () => {
//     if (!isAlphabeticText(form.name)) return "እባክዎ ሙሉ ስምዎትን ያስገቡ።";
//     if (!normalizeSpaces(form.organization))
//       return "እባክዎ የቤተሰብ ስም (ድርጅት)ን ይምረጡ።";
//     if (!PHONE_REGEX.test(normalizeSpaces(form.phone))) {
//       return "እባክዎ ስልክ ቁጥርን በ09 የሚጀምር 10 ዲጂት መሆን አለበት።";
//     }
//     if (!normalizeSpaces(form.sex)) return "እባክዎ ፆታዎን ይምረጡ።";
//     return "";
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (submitting) return;

//     const validationError = validate();
//     if (validationError) {
//       showModal("ማስጠንቀቂያ", validationError, "error");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         name: normalizeSpaces(form.name),
//         organization: normalizeSpaces(form.organization),
//         phone: normalizeSpaces(form.phone),
//         sex: normalizeSpaces(form.sex),
//       };
//       // const existing = await Participant.findOne({
//       if (payload) {
//         // });
//         // if (existing) {
//         showModal("ማስጠንቀቂያ", " ይህ ስም ከዚህ ቀደም ተመዝግቧል ስለተሳሙከራዎ እናመሰግናለን");
//         setTimeout(() => {
//           setSubmitting(false);
//         }, 1200);
//       }

//       const res = await api.post("/bookings", payload);

//       const booking = res.data?.booking || res.data;
//       showModal("ተሳክቷል ", "መረጃዎትን በተሳካ ሁኔታ ተልኳል። እሺ የሚለውን ይንኩ።", "success");
//       upsertTrackedBooking({
//         bookingId: booking._id,
//         name: booking.name,
//         message:
//           "Your official registration details have been received. Waiting for coordinator review.",
//         updatedAt:
//           booking.updatedAt || booking.createdAt || new Date().toISOString(),
//         unread: false,
//       });

//       setTimeout(() => {
//         navigate("/thank-you");
//       }, 1200);
//     } catch (submitError) {
//       console.error(submitError.response?.data || submitError.message);
//       showModal(
//         "ማስጠንቀቂያ",
//         submitError.response?.data?.message ||
//           "የኢንተርኔት ወይም የሰርቨር መቋረጥ ተከስቷል። እባክዎ ደግመው ይሞክሩ።",
//         "error",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-6 md:py-8 overflow-x-hidden">
//       <div className="w-full max-w-3xl min-w-0">
//         <div className="text-left mb-4">
//           <button
//             type="button"
//             className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition max-w-full"
//             onClick={() => navigate("/")}
//           >
//             <img src={back} alt="back" className="w-5 h-5" />
//             መመለስ
//           </button>
//         </div>

//         <form
//           onSubmit={submit}
//           className="bg-white p-6 md:p-8 rounded-3xl shadow-xl"
//         >
//           <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center text-emerald-700">
//             ለጉባኤ ቤተሰብ ለብሥራት ተሳትፎ የምዝገባ ቅጽ
//           </h2>

//           <p className="text-center text-gray-500 mb-6">
//             እባክዎ መረጃዎትን በትክክል ይሙሉ፣ ለጉባኤው የተሳካ መሆን ቅድመ ዝግጅት ቁጥራዊ መረጃ ለመሰብሰብ ብቻ
//             የተዘጋጀ ነው።
//           </p>

//           <input
//             placeholder="ሙሉ ስም / Full Name"
//             className="border p-3 mb-3 w-full rounded-xl"
//             value={form.name}
//             onChange={(e) => {
//               const nextValue = handleNameInput(e.target.value);
//               if (nextValue !== null) setFormField("name", nextValue);
//             }}
//           />

//           <select
//             className="border p-3 mb-3 w-full rounded-xl bg-white"
//             value={form.organization}
//             onChange={(e) => setFormField("organization", e.target.value)}
//           >
//             <option value="">የቤተሰብ ስም (ድርጅት) ይምረጡ / Select Organization</option>
//             {ORGANIZATIONS.map((org) => (
//               <option key={org} value={org}>
//                 {org}
//               </option>
//             ))}
//           </select>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
//             <input
//               type="tel"
//               placeholder="ስልክ ቁጥር / Phone Number"
//               className="border p-3 w-full rounded-xl"
//               value={form.phone}
//               onChange={(e) =>
//                 setFormField("phone", handlePhoneInput(e.target.value))
//               }
//             />

//             <select
//               className="border p-3 w-full rounded-xl bg-white"
//               value={form.sex}
//               onChange={(e) => setFormField("sex", e.target.value)}
//             >
//               <option value="">ፆታ / Sex</option>
//               {SEX_OPTIONS.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             disabled={submitting}
//             className="bg-emerald-500 text-white w-full py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-60"
//           >
//             {submitting ? "ይጠብቁ በመላክ ላይ ነው..." : "መረጃ ያስገቡ / Submit"}
//           </button>

//           <div className="text-sm text-gray-500 mt-4">
//             * እባክዎ የሞሉት መረጃ ትክክለኛ መሆኑን ያረጋግጡ። ይህ ገጽ የይለፍ ቃል፣ የካርድ ቁጥር ወይም
//             የመተግበሪያ ማውረጃ አይጠይቅም። የሰርቨር ወይም የኢንተርኔት ችግር ከተፈጠረ የማስጠንቀቂያ መልእክት
//             ይታያል።
//           </div>
//         </form>
//       </div>

//       <MessageModal
//         open={modalOpen}
//         title={modalTitle}
//         message={modalMessage}
//         type={modalType}
//         onClose={() => setModalOpen(false)}
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
const BRAND_DARK = "#00313c";
const BRAND_DARKER = "#022e38";
const BRAND_ACCENT = "#f2b134"; // yellow accent — swap here if you have an exact hex

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

function pickExistingBooking(error) {
  const data = error?.response?.data || {};
  return (
    data.booking ||
    data.existingBooking ||
    data.existing ||
    data.participant ||
    data.data?.booking ||
    data.data?.existingBooking ||
    (data._id || data.id ? data : null) ||
    null
  );
}

function pickBookingId(value) {
  if (!value) return "";
  return String(
    value._id ||
      value.id ||
      value.bookingId ||
      value.booking_id ||
      value.participantId ||
      value.participant_id ||
      "",
  );
}

async function blobToDataUrl(blob) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function loadExistingQr(booking) {
  if (!booking)
    throw new Error(
      "Existing participant details were not returned by the server.",
    );

  if (booking.qrDataUrl) return booking.qrDataUrl;
  if (booking.qrImage) return booking.qrImage;
  if (booking.qrCodeDataUrl) return booking.qrCodeDataUrl;

  const bookingId = pickBookingId(booking);
  if (!bookingId) {
    throw new Error(
      "The server confirmed this participant is already registered, but it did not return the participant ID needed to retrieve the existing QR code.",
    );
  }

  const response = await api.get(`/qr/${encodeURIComponent(bookingId)}`, {
    responseType: "blob",
  });

  if (!response.data || response.data.size === 0) {
    throw new Error("The server returned an empty QR image.");
  }

  return blobToDataUrl(response.data);
}

function saveParticipantQr(dataUrl, booking) {
  localStorage.setItem(
    "latestParticipantQr",
    JSON.stringify({
      qrDataUrl: dataUrl,
      name: booking?.name || "Participant",
      organization: booking?.organization || "",
      bookingId: pickBookingId(booking),
    }),
  );
}

function downloadQr(dataUrl, name = "participant-qr") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${String(name).replace(/[^a-zA-Z0-9_-]+/g, "_")}-qr.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function shareQr(dataUrl, name = "Participant QR") {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], "participant-qr.png", { type: "image/png" });
    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare({ files: [file] }))
    ) {
      await navigator.share({
        title: "Event QR Code",
        text: `${name} - Event attendance QR code`,
        files: [file],
      });
      return;
    }
    downloadQr(dataUrl, name);
  } catch (error) {
    if (error?.name !== "AbortError") downloadQr(dataUrl, name);
  }
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

  // Duplicate-registration QR recovery
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [duplicateBooking, setDuplicateBooking] = useState(null);
  const [duplicateQr, setDuplicateQr] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [duplicatePayload, setDuplicatePayload] = useState(null);

  const linkBase =
    "block w-full rounded-xl px-4 py-3 font-semibold transition cursor-pointer text-sm md:text-base";
  const linkInactive = "text-white hover:bg-white/10";
  const linkActiveStyle = { backgroundColor: "#ffffff", color: BRAND_DARK };

  const showModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const recoverDuplicateQr = async (
    bookingOverride = null,
    payloadOverride = null,
  ) => {
    const booking = bookingOverride || duplicateBooking;
    const payload = payloadOverride || duplicatePayload;
    if (!booking && !payload) return;

    setDuplicateLoading(true);
    setDuplicateError("");

    try {
      let normalizedBooking = booking;
      let qr =
        booking?.qrDataUrl || booking?.qrImage || booking?.qrCodeDataUrl || "";

      // The current backend returns qrDataUrl directly in the 409 response.
      // That is the preferred path because it is the original QR token.
      if (!normalizedBooking && payload) {
        const response = await api.post("/bookings/recover-qr", payload);
        normalizedBooking =
          response.data?.booking ||
          response.data?.existingBooking ||
          response.data?.participant ||
          response.data?.data?.booking ||
          response.data;
        qr =
          response.data?.qrDataUrl ||
          response.data?.qrImage ||
          response.data?.qrCodeDataUrl ||
          normalizedBooking?.qrDataUrl ||
          "";
      }

      if (!qr && normalizedBooking) {
        const bookingId = pickBookingId(normalizedBooking);
        if (bookingId) {
          try {
            const response = await api.get(
              `/qr/${encodeURIComponent(bookingId)}`,
              {
                responseType: "blob",
              },
            );
            if (response.data?.size) qr = await blobToDataUrl(response.data);
          } catch (fallbackError) {
            console.warn(
              "Admin-protected QR fallback unavailable:",
              fallbackError,
            );
          }
        }
      }

      if (!normalizedBooking) {
        throw new Error(
          "Existing participant details were not returned by the server.",
        );
      }
      if (!qr) {
        throw new Error(
          "The server confirmed the registration but did not return the existing QR code.",
        );
      }

      setDuplicateBooking(normalizedBooking);
      setDuplicateQr(qr);
      saveParticipantQr(qr, normalizedBooking);
    } catch (error) {
      console.error("Existing participant QR recovery error:", error);
      setDuplicateError(
        error?.response?.data?.message ||
          error?.message ||
          "የተመዘገበውን QR ኮድ ማምጣት አልተቻለም።",
      );
    } finally {
      setDuplicateLoading(false);
    }
  };

  const openDuplicateRecovery = async (error, submittedPayload) => {
    const data = error?.response?.data || {};
    const booking = pickExistingBooking(error);
    const qr =
      data.qrDataUrl ||
      data.qrImage ||
      data.qrCodeDataUrl ||
      booking?.qrDataUrl ||
      booking?.qrImage ||
      booking?.qrCodeDataUrl ||
      "";

    setDuplicateBooking(booking);
    setDuplicatePayload(booking ? null : submittedPayload);
    setDuplicateQr(qr);
    setDuplicateError("");
    setDuplicateOpen(true);

    if (qr && booking) {
      saveParticipantQr(qr, booking);
      return;
    }

    await recoverDuplicateQr(booking, submittedPayload);
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

    const payload = {
      name: normalizeSpaces(form.name),
      organization: normalizeSpaces(form.organization),
      phone: normalizeSpaces(form.phone),
      sex: normalizeSpaces(form.sex),
    };

    try {
      setSubmitting(true);

      // The backend rejects duplicate submissions (same name + organization +
      // phone) with a 409 — that's handled in the catch block below, since it
      // arrives as a normal error response.
      const res = await api.post("/bookings", payload);

      const booking = res.data?.booking || res.data;
      if (res.data?.qrDataUrl) {
        localStorage.setItem(
          "latestParticipantQr",
          JSON.stringify({
            qrDataUrl: res.data.qrDataUrl,
            name: booking.name || "Participant",
            organization: booking.organization || "",
            bookingId: booking._id,
          }),
        );
      }
      upsertTrackedBooking({
        bookingId: booking._id,
        name: booking.name,
        message:
          "Your official registration details have been received. Waiting for coordinator review.",
        updatedAt:
          booking.updatedAt || booking.createdAt || new Date().toISOString(),
        unread: false,
      });

      showModal("ተሳክቷል", "መረጃዎትን በተሳካ ሁኔታ ተልኳል። እሺ የሚለውን ይንኩ።", "success");

      setTimeout(() => {
        navigate("/thank-you");
      }, 1200);
    } catch (submitError) {
      console.error(submitError.response?.data || submitError.message);

      if (submitError.response?.status === 409) {
        await openDuplicateRecovery(submitError, payload);
      } else {
        showModal(
          "ማስጠንቀቂያ",
          submitError.response?.data?.message ||
            "የኢንተርኔት ወይም የሰርቨር መቋረጥ ተከስቷል። እባክዎ ደግመው ይሞክሩ።",
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
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition max-w-full"
            onClick={() => navigate("/")}
            style={{ color: BRAND_DARKER }}
          >
            <img
              src={back}
              alt="back"
              className="w-5 h-5"
              style={{ color: BRAND_DARKER }}
            />
            መመለስ
          </button>
        </div>

        <form
          onSubmit={submit}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-xl"
        >
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-4 text-center text-emerald-700"
            style={{ color: BRAND_DARKER }}
          >
            ለጉባኤ ቤተሰብ ለብሥራት ጉባኤው ላይ እንደሚገኙ ለማረጋገጥ የሚሞላ ቅጽ
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
            className="bg-emerald-950 text-white w-full py-3 rounded-xl font-bold hover:bg-emerald-900 transition disabled:opacity-60"
            style={{ color: BRAND_ACCENT }}
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

      {duplicateOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-emerald-100">
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
                    ቀድሞ ተመዝግበዋል | Already Registered
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                  QR
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="font-bold text-emerald-950">
                  ይህ ተሳታፊ ከዚህ በፊት ተመዝግቧል።
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You do not need to register again. You can retrieve the same
                  QR code used for event attendance.
                </p>
              </div>

              {duplicateBooking && (
                <div className="mt-4 rounded-2xl border border-gray-200 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500">
                    Participant
                  </div>
                  <div className="text-lg font-extrabold text-gray-900 mt-1">
                    {duplicateBooking.name || form.name}
                  </div>
                  {(duplicateBooking.organization || form.organization) && (
                    <div className="text-sm text-gray-600 mt-1">
                      {duplicateBooking.organization || form.organization}
                    </div>
                  )}
                </div>
              )}

              {duplicateLoading && (
                <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-gray-50 p-5 text-emerald-800 font-semibold">
                  <span className="w-5 h-5 rounded-full border-2 border-emerald-200 border-t-emerald-700 animate-spin" />
                  የቀድሞ QR ኮድዎን በማምጣት ላይ...
                </div>
              )}

              {duplicateQr && !duplicateLoading && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4 text-center shadow-sm">
                  <p className="font-extrabold text-emerald-900">
                    የእርስዎ የመግቢያ QR Code | Your QR Code
                  </p>
                  <img
                    src={duplicateQr}
                    alt="Existing participant QR code"
                    className="w-64 h-64 max-w-full mx-auto my-4 object-contain rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mb-4">
                    This is the original QR code. The attendance token has not
                    been changed.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        downloadQr(
                          duplicateQr,
                          duplicateBooking?.name || form.name,
                        )
                      }
                      className="rounded-xl py-3 px-4 font-extrabold text-white shadow-md hover:-translate-y-0.5 transition"
                      style={{ backgroundColor: BRAND_DARK }}
                    >
                      Download QR
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        shareQr(
                          duplicateQr,
                          duplicateBooking?.name || form.name,
                        )
                      }
                      className="rounded-xl py-3 px-4 font-extrabold border-2 hover:bg-emerald-50 transition"
                      style={{ borderColor: BRAND_DARK, color: BRAND_DARK }}
                    >
                      Share QR
                    </button>
                  </div>
                </div>
              )}

              {duplicateError && !duplicateLoading && !duplicateQr && (
                <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  <p className="font-bold">QR ኮድ አልተገኘም</p>
                  <p className="mt-1">{duplicateError}</p>
                  <p className="mt-2 text-xs text-red-700">
                    If this continues, please contact the event coordinator. The
                    registration server should return the original QR
                    automatically.
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {!duplicateQr && !duplicateLoading && (
                  <button
                    type="button"
                    onClick={() => recoverDuplicateQr()}
                    className="flex-1 rounded-xl py-3 px-4 font-extrabold text-white shadow-md hover:-translate-y-0.5 transition disabled:opacity-50"
                    style={{ backgroundColor: BRAND_DARKER }}
                    disabled={!duplicateBooking && !duplicatePayload}
                  >
                    🔄 Get My QR Code
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDuplicateOpen(false)}
                  className="flex-1 rounded-xl py-3 px-4 font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Close / ዝጋ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
