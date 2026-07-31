import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";
import back from "../assets/home.png";

const PAGE_LIMIT = 20;

function StatCard({ label, value, accent }) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1 border-t-4"
      style={{ borderTopColor: accent }}
    >
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-3xl font-extrabold text-gray-800">{value}</span>
    </div>
  );
}

export default function AdminParticipants() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    men: 0,
    women: 0,
    organizations: 0,
  });
  const [orgSummary, setOrgSummary] = useState([]);

  const [search, setSearch] = useState("");
  const [activeOrganization, setActiveOrganization] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/bookings", {
        params: {
          page,
          limit: PAGE_LIMIT,
          q: search || undefined,
          organization: activeOrganization || undefined,
        },
      });

      setBookings(res.data?.bookings || []);
      setTotalPages(res.data?.totalPages || 1);
      setStats(
        res.data?.stats || { total: 0, men: 0, women: 0, organizations: 0 },
      );
      setOrgSummary(res.data?.orgSummary || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "መረጃውን መጫን አልተሳካም | Failed to load participant data",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, activeOrganization]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search, activeOrganization]);

  const fetchAllForExport = async () => {
    const res = await api.get("/bookings/export/all", {
      params: {
        q: search || undefined,
        organization: activeOrganization || undefined,
      },
    });
    return res.data?.bookings || [];
  };

  const buildExportRows = (rows) =>
    rows.map((b, idx) => ({
      "#": idx + 1,
      "ሙሉ ስም / Name": b.name || "",
      "ድርጅት / Organization": b.organization || "",
      "ስልክ ቁጥር / Phone": b.phone || "",
      "ፆታ / Sex": b.sex || "",
      "የገባበት ጊዜ / Submitted At": b.createdAt
        ? new Date(b.createdAt).toLocaleString()
        : "",
    }));

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const all = await fetchAllForExport();
      const rows = buildExportRows(all);
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Participants");
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buffer]), "participants.xlsx");
    } catch (err) {
      console.error(err);
      setError("Excel ማውጣት አልተሳካም | Excel export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const all = await fetchAllForExport();
      const rows = buildExportRows(all);

      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(14);
      doc.text("Participant Report", 14, 15);
      doc.setFontSize(10);
      doc.text(
        `Total: ${stats.total}  |  Men: ${stats.men}  |  Women: ${stats.women}  |  Organizations: ${stats.organizations}`,
        14,
        22,
      );

      autoTable(doc, {
        startY: 28,
        head: [["#", "Name", "Organization", "Phone", "Sex", "Submitted At"]],
        body: rows.map((r) => [
          r["#"],
          r["ሙሉ ስም / Name"],
          r["ድርጅት / Organization"],
          r["ስልክ ቁጥር / Phone"],
          r["ፆታ / Sex"],
          r["የገባበት ጊዜ / Submitted At"],
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [4, 120, 87] },
      });

      doc.save("participants.pdf");
    } catch (err) {
      console.error(err);
      setError("PDF ማውጣት አልተሳካም | PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
            onClick={() => navigate("/admin-dashboard")}
          >
            <img src={back} alt="back" className="w-5 h-5" />
            መመለስ
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportExcel}
              className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold shadow hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {exporting ? "እየተላከ..." : "Excel አውርድ"}
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportPdf}
              className="bg-rose-600 text-white px-4 py-3 rounded-xl font-bold shadow hover:bg-rose-700 transition disabled:opacity-60"
            >
              {exporting ? "እየተላከ..." : "PDF አውርድ"}
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-800 mb-6">
          የተሳታፊዎች ዳሽቦርድ | Participant Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="ጠቅላላ ተሳታፊ / Total"
            value={stats.total}
            accent="#047857"
          />
          <StatCard label="ወንድ / Men" value={stats.men} accent="#2563eb" />
          <StatCard label="ሴት / Women" value={stats.women} accent="#db2777" />
          <StatCard
            label="ድርጅቶች / Organizations"
            value={stats.organizations}
            accent="#d97706"
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-emerald-800">
              በድርጅት የተከፋፈለ / Breakdown by Organization
            </h2>
            {activeOrganization && (
              <button
                className="text-sm text-emerald-700 underline"
                onClick={() => setActiveOrganization("")}
              >
                ማጣሪያ አጽዳ / Clear filter
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2 pr-3">ድርጅት / Organization</th>
                  <th className="py-2 pr-3">ጠቅላላ / Total</th>
                  <th className="py-2 pr-3">ወንድ / Men</th>
                  <th className="py-2 pr-3">ሴት / Women</th>
                </tr>
              </thead>
              <tbody>
                {orgSummary.map((row) => (
                  <tr
                    key={row.organization}
                    className={`border-b last:border-0 cursor-pointer hover:bg-emerald-50 ${
                      activeOrganization === row.organization
                        ? "bg-emerald-100"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveOrganization((prev) =>
                        prev === row.organization ? "" : row.organization,
                      )
                    }
                  >
                    <td className="py-2 pr-3">{row.organization}</td>
                    <td className="py-2 pr-3 font-semibold">{row.count}</td>
                    <td className="py-2 pr-3">{row.men}</td>
                    <td className="py-2 pr-3">{row.women}</td>
                  </tr>
                ))}
                {orgSummary.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">
                      ምንም መረጃ የለም / No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-lg text-emerald-800">
              ዝርዝር ዝርዝር / Detailed List
            </h2>
            <input
              type="text"
              placeholder="ፈልግ በስም/ድርጅት/ስልክ... / Search..."
              className="border rounded-xl px-3 py-2 w-full sm:w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-3 text-sm text-red-600 font-semibold">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">ሙሉ ስም / Name</th>
                  <th className="py-2 pr-3">ድርጅት / Organization</th>
                  <th className="py-2 pr-3">ስልክ / Phone</th>
                  <th className="py-2 pr-3">ፆታ / Sex</th>
                  <th className="py-2 pr-3">ቀን / Submitted</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={b._id} className="border-b last:border-0">
                    <td className="py-2 pr-3">
                      {(page - 1) * PAGE_LIMIT + idx + 1}
                    </td>
                    <td className="py-2 pr-3">{b.name}</td>
                    <td className="py-2 pr-3">{b.organization}</td>
                    <td className="py-2 pr-3">{b.phone}</td>
                    <td className="py-2 pr-3">{b.sex}</td>
                    <td className="py-2 pr-3">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-400">
                      ምንም መረጃ የለም / No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-gray-100 font-semibold disabled:opacity-40"
            >
              ወደኋላ / Prev
            </button>
            <span className="text-sm text-gray-500">
              ገጽ {page} ከ {totalPages}
            </span>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl bg-gray-100 font-semibold disabled:opacity-40"
            >
              ወደፊት / Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
