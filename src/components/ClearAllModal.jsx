import { useEffect, useState } from "react";

const BRAND_DARK = "#00313c";
const CONFIRM_PHRASE = "DELETE ALL";

export default function ClearAllModal({
  open,
  count,
  deleting,
  onClose,
  onConfirm,
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  if (!open) return null;

  const canConfirm = typed.trim() === CONFIRM_PHRASE && !deleting;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="px-5 py-4 text-white bg-red-600">
          <h3 className="text-lg font-bold">ሁሉንም ውሂብ አጽዳ / Clear All Data</h3>
        </div>

        <div className="px-5 py-5 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            ይህ ተግባር <strong>ሁሉንም {count} የተሳታፊ መዝገቦችን</strong> በቋሚነት ይሰርዛል። ይህ
            መመለስ አይቻልም። ከቀጠሉ በፊት ምትኬ እንዲወርድ እንመክራለን።
            <br />
            <br />
            This will permanently delete{" "}
            <strong>all {count} participant records</strong>. This cannot be
            undone. We recommend downloading a backup first.
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              ለማረጋገጫ ይተይቡ / Type{" "}
              <span className="font-mono">{CONFIRM_PHRASE}</span> to confirm
            </label>
            <input
              className="border p-3 w-full rounded-xl font-mono"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              ይቅር / Cancel
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={onConfirm}
              className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700"
            >
              {deleting ? "እየጠፋ..." : "ሁሉንም አጥፋ / Delete Everything"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
