import { useEffect, useState } from "react";

const ALPHABETIC_REGEX = /^[A-Za-z\u1200-\u137F\s]*$/;
const PHONE_REGEX = /^09\d{8}$/;
const BRAND_DARK = "#00313c";

function normalizeSpaces(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function EditParticipantModal({
  open,
  booking,
  organizations = [],
  sexOptions = [],
  saving = false,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    phone: "",
    sex: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (booking) {
      setForm({
        name: booking.name || "",
        organization: booking.organization || "",
        phone: booking.phone || "",
        sex: booking.sex || "",
      });
      setFormError("");
    }
  }, [booking]);

  if (!open || !booking) return null;

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNameChange = (value) => {
    if (!ALPHABETIC_REGEX.test(value)) {
      setFormError("ስም ፊደላትን ብቻ መያዝ አለበት / Name must contain letters only");
      return;
    }
    setFormError("");
    setField("name", value);
  };

  const handlePhoneChange = (value) => {
    const digits = String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);
    setField("phone", digits);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = normalizeSpaces(form.name);
    const organization = normalizeSpaces(form.organization);
    const phone = normalizeSpaces(form.phone);
    const sex = normalizeSpaces(form.sex);

    if (!name) return setFormError("እባክዎ ሙሉ ስም ያስገቡ / Full name is required");
    if (!organization)
      return setFormError("እባክዎ ድርጅት ይምረጡ / Organization is required");
    if (!PHONE_REGEX.test(phone))
      return setFormError(
        "ትክክለኛ ስልክ ቁጥር ያስፈልጋል (09XXXXXXXX) / A valid phone number is required",
      );
    if (!sex) return setFormError("እባክዎ ፆታ ይምረጡ / Sex is required");

    setFormError("");
    onSave(booking._id, { name, organization, phone, sex });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div
          className="px-5 py-4 text-white"
          style={{ backgroundColor: BRAND_DARK }}
        >
          <h3 className="text-lg font-bold">ተሳታፊ አርም / Edit Participant</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
          {formError && (
            <p className="text-sm text-red-600 font-semibold">{formError}</p>
          )}

          <input
            className="border p-3 w-full rounded-xl"
            placeholder="ሙሉ ስም / Full Name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <select
            className="border p-3 w-full rounded-xl bg-white"
            value={form.organization}
            onChange={(e) => setField("organization", e.target.value)}
          >
            <option value="">ድርጅት ይምረጡ / Select Organization</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          <input
            type="tel"
            className="border p-3 w-full rounded-xl"
            placeholder="ስልክ ቁጥር / Phone Number"
            value={form.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />

          <select
            className="border p-3 w-full rounded-xl bg-white"
            value={form.sex}
            onChange={(e) => setField("sex", e.target.value)}
          >
            <option value="">ፆታ / Sex</option>
            {sexOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              ይቅር / Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-60"
              style={{ backgroundColor: BRAND_DARK }}
            >
              {saving ? "በማስቀመጥ ላይ..." : "አስቀምጥ / Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
