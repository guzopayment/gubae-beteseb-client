// // import { useCallback, useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import api from "../services/api";
// // import back from "../assets/home.png";

// // const PAGE_LIMIT = 20;

// // function StatCard({ label, value, accent }) {
// //   return (
// //     <div
// //       className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1 border-t-4"ም
// //       style={{ borderTopColor: accent }}
// //     >
// //       <span className="text-sm font-semibold text-gray-500">{label}</span>
// //       <span className="text-3xl font-extrabold text-gray-800">{value}</span>
// //     </div>
// //   );
// // }

// // export default function AdminParticipants() {
// //   const navigate = useNavigate();

// //   const [bookings, setBookings] = useState([]);
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     men: 0,
// //     women: 0,
// //     organizations: 0,
// //   });
// //   const [orgSummary, setOrgSummary] = useState([]);

// //   const [search, setSearch] = useState("");
// //   const [activeOrganization, setActiveOrganization] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   const [loading, setLoading] = useState(false);
// //   const [exporting, setExporting] = useState(false);
// //   const [error, setError] = useState("");

// //   const fetchData = useCallback(async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/bookings", {
// //         params: {
// //           page,
// //           limit: PAGE_LIMIT,
// //           q: search || undefined,
// //           organization: activeOrganization || undefined,
// //         },
// //       });

// //       setBookings(res.data?.bookings || []);
// //       setTotalPages(res.data?.totalPages || 1);
// //       setStats(
// //         res.data?.stats || { total: 0, men: 0, women: 0, organizations: 0 },
// //       );
// //       setOrgSummary(res.data?.orgSummary || []);
// //     } catch (err) {
// //       console.error(err);
// //       setError(
// //         err.response?.data?.message ||
// //           "መረጃውን መጫን አልተሳካም | Failed to load participant data",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [page, search, activeOrganization]);

// //   useEffect(() => {
// //     fetchData();
// //   }, [fetchData]);

// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, activeOrganization]);

// //   const fetchAllForExport = async () => {
// //     const res = await api.get("/bookings/export/all", {
// //       params: {
// //         q: search || undefined,
// //         organization: activeOrganization || undefined,
// //       },
// //     });
// //     return res.data?.bookings || [];
// //   };

// //   const buildExportRows = (rows) =>
// //     rows.map((b, idx) => ({
// //       "#": idx + 1,
// //       "ሙሉ ስም / Name": b.name || "",
// //       "ድርጅት / Organization": b.organization || "",
// //       "ስልክ ቁጥር / Phone": b.phone || "",
// //       "ፆታ / Sex": b.sex || "",
// //       "የገባበት ጊዜ / Submitted At": b.createdAt
// //         ? new Date(b.createdAt).toLocaleString()
// //         : "",
// //     }));

// //   const handleExportExcel = async () => {
// //     setExporting(true);
// //     try {
// //       const all = await fetchAllForExport();
// //       const rows = buildExportRows(all);
// //       const ws = XLSX.utils.json_to_sheet(rows);
// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, "Participants");
// //       const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
// //       saveAs(new Blob([buffer]), "participants.xlsx");
// //     } catch (err) {
// //       console.error(err);
// //       setError("Excel ማውጣት አልተሳካም | Excel export failed");
// //     } finally {
// //       setExporting(false);
// //     }
// //   };

// //   const handleExportPdf = async () => {
// //     setExporting(true);
// //     try {
// //       const all = await fetchAllForExport();
// //       const rows = buildExportRows(all);

// //       const doc = new jsPDF({ orientation: "landscape" });
// //       doc.setFontSize(14);
// //       doc.text("Participant Report", 14, 15);
// //       doc.setFontSize(10);
// //       doc.text(
// //         `Total: ${stats.total}  |  Men: ${stats.men}  |  Women: ${stats.women}  |  Organizations: ${stats.organizations}`,
// //         14,
// //         22,
// //       );

// //       autoTable(doc, {
// //         startY: 28,
// //         head: [["#", "Name", "Organization", "Phone", "Sex", "Submitted At"]],
// //         body: rows.map((r) => [
// //           r["#"],
// //           r["ሙሉ ስም / Name"],
// //           r["ድርጅት / Organization"],
// //           r["ስልክ ቁጥር / Phone"],
// //           r["ፆታ / Sex"],
// //           r["የገባበት ጊዜ / Submitted At"],
// //         ]),
// //         styles: { fontSize: 8 },
// //         headStyles: { fillColor: [4, 120, 87] },
// //       });

// //       doc.save("participants.pdf");
// //     } catch (err) {
// //       console.error(err);
// //       setError("PDF ማውጣት አልተሳካም | PDF export failed");
// //     } finally {
// //       setExporting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 px-4 py-6 md:py-8">
// //       <div className="max-w-6xl mx-auto">
// //         <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
// //           <button
// //             type="button"
// //             className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
// //             onClick={() => navigate("/admin-dashboard")}
// //           >
// //             <img src={back} alt="back" className="w-5 h-5" />
// //             መመለስ
// //           </button>

// //           <div className="flex gap-3">
// //             <button
// //               type="button"
// //               disabled={exporting}
// //               onClick={handleExportExcel}
// //               className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold shadow hover:bg-emerald-700 transition disabled:opacity-60"
// //             >
// //               {exporting ? "እየተላከ..." : "Excel አውርድ"}
// //             </button>
// //             <button
// //               type="button"
// //               disabled={exporting}
// //               onClick={handleExportPdf}
// //               className="bg-rose-600 text-white px-4 py-3 rounded-xl font-bold shadow hover:bg-rose-700 transition disabled:opacity-60"
// //             >
// //               {exporting ? "እየተላከ..." : "PDF አውርድ"}
// //             </button>
// //           </div>
// //         </div>

// //         <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-800 mb-6">
// //           የተሳታፊዎች ዳሽቦርድ | Participant Dashboard
// //         </h1>

// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //           <StatCard
// //             label="ጠቅላላ ተሳታፊ / Total"
// //             value={stats.total}
// //             accent="#047857"
// //           />
// //           <StatCard label="ወንድ / Men" value={stats.men} accent="#2563eb" />
// //           <StatCard label="ሴት / Women" value={stats.women} accent="#db2777" />
// //           <StatCard
// //             label="ድርጅቶች / Organizations"
// //             value={stats.organizations}
// //             accent="#d97706"
// //           />
// //         </div>

// //         <div className="bg-white rounded-2xl shadow p-5 mb-8">
// //           <div className="flex items-center justify-between mb-4">
// //             <h2 className="font-bold text-lg text-emerald-800">
// //               በድርጅት የተከፋፈለ / Breakdown by Organization
// //             </h2>
// //             {activeOrganization && (
// //               <button
// //                 className="text-sm text-emerald-700 underline"
// //                 onClick={() => setActiveOrganization("")}
// //               >
// //                 ማጣሪያ አጽዳ / Clear filter
// //               </button>
// //             )}
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full text-sm text-left">
// //               <thead className="text-gray-500 border-b">
// //                 <tr>
// //                   <th className="py-2 pr-3">ድርጅት / Organization</th>
// //                   <th className="py-2 pr-3">ጠቅላላ / Total</th>
// //                   <th className="py-2 pr-3">ወንድ / Men</th>
// //                   <th className="py-2 pr-3">ሴት / Women</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {orgSummary.map((row) => (
// //                   <tr
// //                     key={row.organization}
// //                     className={`border-b last:border-0 cursor-pointer hover:bg-emerald-50 ${
// //                       activeOrganization === row.organization
// //                         ? "bg-emerald-100"
// //                         : ""
// //                     }`}
// //                     onClick={() =>
// //                       setActiveOrganization((prev) =>
// //                         prev === row.organization ? "" : row.organization,
// //                       )
// //                     }
// //                   >
// //                     <td className="py-2 pr-3">{row.organization}</td>
// //                     <td className="py-2 pr-3 font-semibold">{row.count}</td>
// //                     <td className="py-2 pr-3">{row.men}</td>
// //                     <td className="py-2 pr-3">{row.women}</td>
// //                   </tr>
// //                 ))}
// //                 {orgSummary.length === 0 && !loading && (
// //                   <tr>
// //                     <td colSpan={4} className="py-4 text-center text-gray-400">
// //                       ምንም መረጃ የለም / No data
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow p-5">
// //           <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
// //             <h2 className="font-bold text-lg text-emerald-800">
// //               ዝርዝር ዝርዝር / Detailed List
// //             </h2>
// //             <input
// //               type="text"
// //               placeholder="ፈልግ በስም/ድርጅት/ስልክ... / Search..."
// //               className="border rounded-xl px-3 py-2 w-full sm:w-72"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //             />
// //           </div>

// //           {error && (
// //             <div className="mb-3 text-sm text-red-600 font-semibold">
// //               {error}
// //             </div>
// //           )}

// //           <div className="overflow-x-auto">
// //             <table className="w-full text-sm text-left">
// //               <thead className="text-gray-500 border-b">
// //                 <tr>
// //                   <th className="py-2 pr-3">#</th>
// //                   <th className="py-2 pr-3">ሙሉ ስም / Name</th>
// //                   <th className="py-2 pr-3">ድርጅት / Organization</th>
// //                   <th className="py-2 pr-3">ስልክ / Phone</th>
// //                   <th className="py-2 pr-3">ፆታ / Sex</th>
// //                   <th className="py-2 pr-3">ቀን / Submitted</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {bookings.map((b, idx) => (
// //                   <tr key={b._id} className="border-b last:border-0">
// //                     <td className="py-2 pr-3">
// //                       {(page - 1) * PAGE_LIMIT + idx + 1}
// //                     </td>
// //                     <td className="py-2 pr-3">{b.name}</td>
// //                     <td className="py-2 pr-3">{b.organization}</td>
// //                     <td className="py-2 pr-3">{b.phone}</td>
// //                     <td className="py-2 pr-3">{b.sex}</td>
// //                     <td className="py-2 pr-3">
// //                       {b.createdAt
// //                         ? new Date(b.createdAt).toLocaleDateString()
// //                         : "—"}
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {bookings.length === 0 && !loading && (
// //                   <tr>
// //                     <td colSpan={6} className="py-4 text-center text-gray-400">
// //                       ምንም መረጃ የለም / No data
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="flex items-center justify-between mt-4">
// //             <button
// //               disabled={page <= 1 || loading}
// //               onClick={() => setPage((p) => Math.max(1, p - 1))}
// //               className="px-4 py-2 rounded-xl bg-gray-100 font-semibold disabled:opacity-40"
// //             >
// //               ወደኋላ / Prev
// //             </button>
// //             <span className="text-sm text-gray-500">
// //               ገጽ {page} ከ {totalPages}
// //             </span>
// //             <button
// //               disabled={page >= totalPages || loading}
// //               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //               className="px-4 py-2 rounded-xl bg-gray-100 font-semibold disabled:opacity-40"
// //             >
// //               ወደፊት / Next
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import api from "../services/api";
// import back from "../assets/home.png";
// import Sidebar from "../components/Sidebar";
// import Pagination from "../components/Pagination";
// import MessageModal from "../components/MessageModal";
// import EditParticipantModal from "../components/EditParticipantModal";
// import { ORGANIZATIONS, SEX_OPTIONS } from "../utils/bookingOptions";

// const PAGE_LIMIT = 20;
// const ORG_PAGE_LIMIT = 8;

// // Brand palette
// const BRAND_DARK = "#00313c";
// const BRAND_DARKER = "#022e38";
// const BRAND_ACCENT = "#f2b134"; // yellow accent — swap here if you have an exact hex

// function StatCard({ label, value, accent }) {
//   return (
//     <div
//       className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1 border-t-4"
//       style={{ borderTopColor: accent }}
//     >
//       <span className="text-sm font-semibold text-gray-500">{label}</span>
//       <span className="text-3xl font-extrabold" style={{ color: BRAND_DARK }}>
//         {value}
//       </span>
//     </div>
//   );
// }

// function formatDateTime(value) {
//   if (!value) return "—";
//   const d = new Date(value);
//   return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
// }

// export default function AdminParticipants() {
//   const navigate = useNavigate();

//   const [bookings, setBookings] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     men: 0,
//     women: 0,
//     organizations: 0,
//   });
//   const [orgSummary, setOrgSummary] = useState([]);

//   const [search, setSearch] = useState("");
//   const [activeOrganization, setActiveOrganization] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [orgPage, setOrgPage] = useState(1);

//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const [error, setError] = useState("");

//   // Edit modal state
//   const [editTarget, setEditTarget] = useState(null);
//   const [savingEdit, setSavingEdit] = useState(false);

//   // Delete confirmation state
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   // Hidden container used to render a full, printable snapshot for the PDF export
//   const printRef = useRef(null);
//   const [printRows, setPrintRows] = useState(null); // null = not prepared yet

//   const orgTotalPages = Math.max(
//     1,
//     Math.ceil(orgSummary.length / ORG_PAGE_LIMIT),
//   );
//   const visibleOrgRows = useMemo(
//     () =>
//       orgSummary.slice(
//         (orgPage - 1) * ORG_PAGE_LIMIT,
//         orgPage * ORG_PAGE_LIMIT,
//       ),
//     [orgSummary, orgPage],
//   );

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/bookings", {
//         params: {
//           page,
//           limit: PAGE_LIMIT,
//           q: search || undefined,
//           organization: activeOrganization || undefined,
//         },
//       });

//       setBookings(res.data?.bookings || []);
//       setTotalPages(res.data?.totalPages || 1);
//       setStats(
//         res.data?.stats || { total: 0, men: 0, women: 0, organizations: 0 },
//       );
//       setOrgSummary(res.data?.orgSummary || []);
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message ||
//           "መረጃውን መጫን አልተሳካም | Failed to load participant data",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, activeOrganization]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, activeOrganization]);

//   useEffect(() => {
//     setOrgPage(1);
//   }, [orgSummary.length, search, activeOrganization]);

//   const fetchAllForExport = async () => {
//     const res = await api.get("/bookings/export/all", {
//       params: {
//         q: search || undefined,
//         organization: activeOrganization || undefined,
//       },
//     });
//     return res.data?.bookings || [];
//   };

//   // ---------- Excel export ----------
//   const buildExportRows = (rows) =>
//     rows.map((b, idx) => ({
//       "#": idx + 1,
//       "ሙሉ ስም / Name": b.name || "",
//       "ድርጅት / Organization": b.organization || "",
//       "ስልክ ቁጥር / Phone": b.phone || "",
//       "ፆታ / Sex": b.sex || "",
//       "የገባበት ጊዜ / Submitted At": b.createdAt
//         ? new Date(b.createdAt).toLocaleString()
//         : "",
//     }));

//   const handleExportExcel = async () => {
//     setExporting(true);
//     try {
//       const all = await fetchAllForExport();
//       const rows = buildExportRows(all);
//       const ws = XLSX.utils.json_to_sheet(rows);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Participants");
//       const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       saveAs(new Blob([buffer]), "participants.xlsx");
//     } catch (err) {
//       console.error(err);
//       setError("Excel ማውጣት አልተሳካም | Excel export failed");
//     } finally {
//       setExporting(false);
//     }
//   };

//   // ---------- PDF export (renders the real DOM so any script, incl. Amharic, shows correctly) ----------
//   const handleExportPdf = async () => {
//     setExporting(true);
//     setError("");
//     try {
//       const all = await fetchAllForExport();
//       setPrintRows(all);

//       // wait for the hidden print container to render with the new data
//       await new Promise((resolve) =>
//         requestAnimationFrame(() => requestAnimationFrame(resolve)),
//       );

//       const node = printRef.current;
//       if (!node) throw new Error("Print container not ready");

//       const canvas = await html2canvas(node, {
//         scale: 2,
//         backgroundColor: "#ffffff",
//         useCORS: true,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position -= pageHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save("participants.pdf");
//     } catch (err) {
//       console.error(err);
//       setError("PDF ማውጣት አልተሳካም | PDF export failed");
//     } finally {
//       setPrintRows(null);
//       setExporting(false);
//     }
//   };

//   // ---------- Edit ----------
//   const handleEditSave = async (id, payload) => {
//     setSavingEdit(true);
//     try {
//       await api.put(`/bookings/${id}`, payload);
//       setEditTarget(null);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message ||
//           "ማዘመን አልተሳካም | Failed to update participant",
//       );
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   // ---------- Delete ----------
//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       await api.delete(`/bookings/${deleteTarget._id}`);
//       setDeleteTarget(null);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message ||
//           "ማጥፋት አልተሳካም | Failed to delete participant",
//       );
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
//       <Sidebar admin />

//       <main className="flex-1 px-4 py-6 md:py-8 min-w-0">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 bg-white px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
//               style={{ color: BRAND_DARK }}
//               onClick={() => navigate("/admin-dashboard")}
//             >
//               <img src={back} alt="back" className="w-5 h-5" />
//               መመለስ
//             </button>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 disabled={exporting}
//                 onClick={handleExportExcel}
//                 className="text-white px-4 py-3 rounded-xl font-bold shadow transition disabled:opacity-60"
//                 style={{ backgroundColor: BRAND_DARK }}
//               >
//                 {exporting ? "እየተላከ..." : "Excel አውርድ"}
//               </button>
//               <button
//                 type="button"
//                 disabled={exporting}
//                 onClick={handleExportPdf}
//                 className="font-bold px-4 py-3 rounded-xl shadow transition disabled:opacity-60"
//                 style={{ backgroundColor: BRAND_ACCENT, color: BRAND_DARK }}
//               >
//                 {exporting ? "እየተላከ..." : "PDF አውርድ"}
//               </button>
//             </div>
//           </div>

//           <h1
//             className="text-2xl md:text-3xl font-extrabold mb-6"
//             style={{ color: BRAND_DARK }}
//           >
//             የተሳታፊዎች ዳሽቦርድ | Participant Dashboard
//           </h1>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             <StatCard
//               label="ጠቅላላ ተሳታፊ / Total"
//               value={stats.total}
//               accent={BRAND_DARK}
//             />
//             <StatCard
//               label="ወንድ / Men"
//               value={stats.men}
//               accent={BRAND_DARKER}
//             />
//             <StatCard
//               label="ሴት / Women"
//               value={stats.women}
//               accent={BRAND_ACCENT}
//             />
//             <StatCard
//               label="ድርጅቶች / Organizations"
//               value={stats.organizations}
//               accent="#4d7c8c"
//             />
//           </div>

//           {error && (
//             <div className="mb-4 text-sm text-red-600 font-semibold">
//               {error}
//             </div>
//           )}

//           <div className="bg-white rounded-2xl shadow p-5 mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-lg" style={{ color: BRAND_DARK }}>
//                 በድርጅት የተከፋፈለ / Breakdown by Organization
//               </h2>
//               {activeOrganization && (
//                 <button
//                   className="text-sm underline"
//                   style={{ color: BRAND_DARK }}
//                   onClick={() => setActiveOrganization("")}
//                 >
//                   ማጣሪያ አጽዳ / Clear filter
//                 </button>
//               )}
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="text-gray-500 border-b">
//                   <tr>
//                     <th className="py-2 pr-3">ድርጅት / Organization</th>
//                     <th className="py-2 pr-3">ጠቅላላ / Total</th>
//                     <th className="py-2 pr-3">ወንድ / Men</th>
//                     <th className="py-2 pr-3">ሴት / Women</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleOrgRows.map((row) => (
//                     <tr
//                       key={row.organization}
//                       className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
//                       style={
//                         activeOrganization === row.organization
//                           ? { backgroundColor: "#eaf2f4" }
//                           : undefined
//                       }
//                       onClick={() =>
//                         setActiveOrganization((prev) =>
//                           prev === row.organization ? "" : row.organization,
//                         )
//                       }
//                     >
//                       <td className="py-2 pr-3">{row.organization}</td>
//                       <td className="py-2 pr-3 font-semibold">{row.count}</td>
//                       <td className="py-2 pr-3">{row.men}</td>
//                       <td className="py-2 pr-3">{row.women}</td>
//                     </tr>
//                   ))}
//                   {orgSummary.length === 0 && !loading && (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="py-4 text-center text-gray-400"
//                       >
//                         ምንም መረጃ የለም / No data
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <Pagination
//               page={orgPage}
//               totalPages={orgTotalPages}
//               onChange={setOrgPage}
//             />
//           </div>

//           <div className="bg-white rounded-2xl shadow p-5">
//             <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//               <h2 className="font-bold text-lg" style={{ color: BRAND_DARK }}>
//                 ዝርዝር ዝርዝር / Detailed List
//               </h2>
//               <input
//                 type="text"
//                 placeholder="ፈልግ በስም/ድርጅት/ስልክ... / Search..."
//                 className="border rounded-xl px-3 py-2 w-full sm:w-72"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="text-gray-500 border-b">
//                   <tr>
//                     <th className="py-2 pr-3">#</th>
//                     <th className="py-2 pr-3">ሙሉ ስም / Name</th>
//                     <th className="py-2 pr-3">ድርጅት / Organization</th>
//                     <th className="py-2 pr-3">ስልክ / Phone</th>
//                     <th className="py-2 pr-3">ፆታ / Sex</th>
//                     <th className="py-2 pr-3">ቀን / Submitted</th>
//                     <th className="py-2 pr-3">ተግባር / Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((b, idx) => (
//                     <tr key={b._id} className="border-b last:border-0">
//                       <td className="py-2 pr-3">
//                         {(page - 1) * PAGE_LIMIT + idx + 1}
//                       </td>
//                       <td className="py-2 pr-3">{b.name}</td>
//                       <td className="py-2 pr-3">{b.organization}</td>
//                       <td className="py-2 pr-3">{b.phone}</td>
//                       <td className="py-2 pr-3">{b.sex}</td>
//                       <td className="py-2 pr-3">
//                         {b.createdAt
//                           ? new Date(b.createdAt).toLocaleDateString()
//                           : "—"}
//                       </td>
//                       <td className="py-2 pr-3">
//                         <div className="flex gap-2">
//                           <button
//                             className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition"
//                             style={{ backgroundColor: BRAND_DARK }}
//                             onClick={() => setEditTarget(b)}
//                           >
//                             አርም / Edit
//                           </button>
//                           <button
//                             className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition"
//                             onClick={() => setDeleteTarget(b)}
//                           >
//                             አጥፋ / Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {bookings.length === 0 && !loading && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="py-4 text-center text-gray-400"
//                       >
//                         ምንም መረጃ የለም / No data
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <Pagination
//               page={page}
//               totalPages={totalPages}
//               onChange={setPage}
//             />
//           </div>
//         </div>
//       </main>

//       <MessageModal
//         open={!!deleteTarget}
//         title="ማጥፋትን አረጋግጥ / Confirm Delete"
//         message={
//           deleteTarget
//             ? `"${deleteTarget.name}" የተባለውን ተሳታፊ መረጃ ማጥፋት ይፈልጋሉ? ይህ ተግባር መመለስ አይቻልም። | Delete "${deleteTarget.name}"? This cannot be undone.`
//             : ""
//         }
//         type="warning"
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={confirmDelete}
//         confirmLabel={deleting ? "እየጠፋ..." : "አጥፋ / Delete"}
//         cancelLabel="ይቅር / Cancel"
//       />

//       <EditParticipantModal
//         open={!!editTarget}
//         booking={editTarget}
//         organizations={ORGANIZATIONS}
//         sexOptions={SEX_OPTIONS}
//         saving={savingEdit}
//         onClose={() => setEditTarget(null)}
//         onSave={handleEditSave}
//       />

//       {/* Hidden, full (unpaginated) snapshot used only for the PDF export.
//           Rendered off-screen so html2canvas can capture it exactly as the
//           browser displays it — including Amharic script. */}
//       <div
//         ref={printRef}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: "-10000px",
//           width: "900px",
//           backgroundColor: "#ffffff",
//           padding: "24px",
//           fontFamily: "Arial, sans-serif",
//         }}
//       >
//         {printRows !== null && (
//           <div>
//             <h1
//               style={{
//                 color: BRAND_DARK,
//                 fontSize: "22px",
//                 marginBottom: "4px",
//               }}
//             >
//               የተሳታፊዎች ሪፖርት / Participant Report
//             </h1>
//             <p
//               style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}
//             >
//               ተፈጠረ / Generated: {formatDateTime(new Date())}
//               {activeOrganization
//                 ? ` | ማጣሪያ / Filter: ${activeOrganization}`
//                 : ""}
//               {search ? ` | ፍለጋ / Search: ${search}` : ""}
//             </p>

//             <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
//               {[
//                 ["ጠቅላላ / Total", stats.total],
//                 ["ወንድ / Men", stats.men],
//                 ["ሴት / Women", stats.women],
//                 ["ድርጅቶች / Organizations", stats.organizations],
//               ].map(([label, value]) => (
//                 <div
//                   key={label}
//                   style={{
//                     flex: 1,
//                     border: `1px solid ${BRAND_DARK}`,
//                     borderRadius: "8px",
//                     padding: "10px",
//                     textAlign: "center",
//                   }}
//                 >
//                   <div style={{ fontSize: "11px", color: "#555" }}>{label}</div>
//                   <div
//                     style={{
//                       fontSize: "20px",
//                       fontWeight: "bold",
//                       color: BRAND_DARK,
//                     }}
//                   >
//                     {value}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h2
//               style={{
//                 color: BRAND_DARK,
//                 fontSize: "16px",
//                 marginBottom: "8px",
//               }}
//             >
//               በድርጅት የተከፋፈለ / Breakdown by Organization
//             </h2>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 marginBottom: "24px",
//                 fontSize: "12px",
//               }}
//             >
//               <thead>
//                 <tr style={{ backgroundColor: BRAND_DARK, color: "#fff" }}>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ድርጅት / Organization
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ጠቅላላ / Total
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ወንድ / Men
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ሴት / Women
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orgSummary.map((row, idx) => (
//                   <tr
//                     key={row.organization}
//                     style={{
//                       backgroundColor: idx % 2 === 0 ? "#f7f9fa" : "#ffffff",
//                     }}
//                   >
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.organization}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.count}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.men}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.women}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <h2
//               style={{
//                 color: BRAND_DARK,
//                 fontSize: "16px",
//                 marginBottom: "8px",
//               }}
//             >
//               ዝርዝር ዝርዝር / Detailed List
//             </h2>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: "12px",
//               }}
//             >
//               <thead>
//                 <tr style={{ backgroundColor: BRAND_DARK, color: "#fff" }}>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>#</th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ሙሉ ስም / Name
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ድርጅት / Organization
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ስልክ / Phone
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ፆታ / Sex
//                   </th>
//                   <th style={{ padding: "6px 8px", textAlign: "left" }}>
//                     ቀን / Submitted
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(printRows || []).map((b, idx) => (
//                   <tr
//                     key={b._id}
//                     style={{
//                       backgroundColor: idx % 2 === 0 ? "#f7f9fa" : "#ffffff",
//                     }}
//                   >
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {idx + 1}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {b.name}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {b.organization}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {b.phone}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {b.sex}
//                     </td>
//                     <td
//                       style={{
//                         padding: "6px 8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {b.createdAt
//                         ? new Date(b.createdAt).toLocaleDateString()
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../services/api";
// import back from "../assets/home.png";
import DashboardSidebar from "../components/DashboardSidebar";
import Pagination from "../components/Pagination";
import MessageModal from "../components/MessageModal";
import EditParticipantModal from "../components/EditParticipantModal";
import { ORGANIZATIONS, SEX_OPTIONS } from "../utils/bookingOptions";

const PAGE_LIMIT = 8;
const ORG_PAGE_LIMIT = 8;

// Brand palette
const BRAND_DARK = "#00313c";
const BRAND_DARKER = "#022e38";
const BRAND_ACCENT = "#f2b134"; // yellow accent — swap here if you have an exact hex

function StatCard({ label, value, accent }) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1 border-t-4"
      style={{ borderTopColor: accent }}
    >
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-3xl font-extrabold" style={{ color: BRAND_DARK }}>
        {value}
      </span>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

// ---------- ExcelJS: styled workbook builders (colorful, professional header) ----------

function styleHeaderRow(
  row,
  { fill = BRAND_DARK.replace("#", "FF"), fontColor = "FFFFFFFF" } = {},
) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: fontColor } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill.toUpperCase() },
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
}

function addTitleBanner(sheet, columnCount, title, subtitle) {
  sheet.mergeCells(1, 1, 1, columnCount);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00313C" },
  };
  sheet.getRow(1).height = 26;

  sheet.mergeCells(2, 1, 2, columnCount);
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = subtitle;
  subtitleCell.font = { bold: true, color: { argb: "FF00313C" } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "center" };
  subtitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2B134" },
  };
  sheet.getRow(2).height = 20;
}

function bandRows(sheet, startRow, rowCount, columnCount) {
  for (let i = 0; i < rowCount; i += 1) {
    const row = sheet.getRow(startRow + i);
    const fillColor = i % 2 === 0 ? "FFFFFFFF" : "FFF0F4F5";
    for (let c = 1; c <= columnCount; c += 1) {
      const cell = row.getCell(c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor },
      };
      cell.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
    }
  }
}

async function saveWorkbook(workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
}

function buildDetailWorkbook(rows, subtitle) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Participants");
  const columns = [
    "#",
    "ሙሉ ስም / Name",
    "ድርጅት / Organization",
    "ስልክ ቁጥር / Phone",
    "ፆታ / Sex",
    "የገባበት ጊዜ / Submitted At",
  ];

  addTitleBanner(
    sheet,
    columns.length,
    "የተሳታፊዎች ሪፖርት / Participant Report",
    subtitle,
  );

  const headerRowIndex = 4;
  const headerRow = sheet.getRow(headerRowIndex);
  columns.forEach((col, i) => {
    headerRow.getCell(i + 1).value = col;
  });
  styleHeaderRow(headerRow);

  rows.forEach((r, idx) => {
    const row = sheet.getRow(headerRowIndex + 1 + idx);
    row.values = [
      idx + 1,
      r.name || "",
      r.organization || "",
      r.phone || "",
      r.sex || "",
      r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
    ];
  });
  bandRows(sheet, headerRowIndex + 1, rows.length, columns.length);

  sheet.columns.forEach((col, i) => {
    col.width = i === 0 ? 6 : 26;
  });

  return workbook;
}

function buildOrgWorkbook(orgRows, subtitle) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Organization Breakdown");
  const columns = [
    "ድርጅት / Organization",
    "ጠቅላላ / Total",
    "ወንድ / Men",
    "ሴት / Women",
  ];

  addTitleBanner(
    sheet,
    columns.length,
    "በድርጅት የተከፋፈለ ሪፖርት / Organization Breakdown Report",
    subtitle,
  );

  const headerRowIndex = 4;
  const headerRow = sheet.getRow(headerRowIndex);
  columns.forEach((col, i) => {
    headerRow.getCell(i + 1).value = col;
  });
  styleHeaderRow(headerRow);

  orgRows.forEach((r, idx) => {
    const row = sheet.getRow(headerRowIndex + 1 + idx);
    row.values = [r.organization, r.count, r.men, r.women];
  });
  bandRows(sheet, headerRowIndex + 1, orgRows.length, columns.length);

  sheet.columns.forEach((col, i) => {
    col.width = i === 0 ? 42 : 16;
  });

  return workbook;
}

// ---------- html2canvas + jsPDF: capture a rendered DOM node into a multi-page PDF ----------
async function captureNodeToPdf(node, filename) {
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
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
  const [orgPage, setOrgPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  // Edit modal state
  const [editTarget, setEditTarget] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Hidden container used to render a printable snapshot for PDF export.
  // printMode controls which section(s) it shows: "full" (stats + both
  // tables + all detail rows) or "org" (just the organization breakdown).
  const printRef = useRef(null);
  const [printMode, setPrintMode] = useState(null);
  const [printRows, setPrintRows] = useState([]);

  const orgTotalPages = Math.max(
    1,
    Math.ceil(orgSummary.length / ORG_PAGE_LIMIT),
  );
  const visibleOrgRows = useMemo(
    () =>
      orgSummary.slice(
        (orgPage - 1) * ORG_PAGE_LIMIT,
        orgPage * ORG_PAGE_LIMIT,
      ),
    [orgSummary, orgPage],
  );

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

  useEffect(() => {
    setOrgPage(1);
  }, [orgSummary.length, search, activeOrganization]);

  const fetchAllForExport = async () => {
    const res = await api.get("/bookings/export/all", {
      params: {
        q: search || undefined,
        organization: activeOrganization || undefined,
      },
    });
    return res.data?.bookings || [];
  };

  const buildSubtitle = () =>
    `ተፈጠረ / Generated: ${formatDateTime(new Date())}` +
    (activeOrganization ? `  |  ማጣሪያ / Filter: ${activeOrganization}` : "") +
    (search ? `  |  ፍለጋ / Search: ${search}` : "");

  // ---------- Excel exports ----------
  const handleExportDetailExcel = async () => {
    setExporting(true);
    setError("");
    try {
      const all = await fetchAllForExport();
      const workbook = buildDetailWorkbook(all, buildSubtitle());
      await saveWorkbook(workbook, "participants.xlsx");
    } catch (err) {
      console.error(err);
      setError("Excel ማውጣት አልተሳካም | Excel export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleExportOrgExcel = async () => {
    setExporting(true);
    setError("");
    try {
      const workbook = buildOrgWorkbook(orgSummary, buildSubtitle());
      await saveWorkbook(workbook, "organization-breakdown.xlsx");
    } catch (err) {
      console.error(err);
      setError("Excel ማውጣት አልተሳካም | Excel export failed");
    } finally {
      setExporting(false);
    }
  };

  // ---------- PDF exports (render real DOM so any script, incl. Amharic, shows correctly) ----------
  const runPdfCapture = async (filename) => {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    const node = printRef.current;
    if (!node) throw new Error("Print container not ready");
    await captureNodeToPdf(node, filename);
  };

  const handleExportDetailPdf = async () => {
    setExporting(true);
    setError("");
    try {
      const all = await fetchAllForExport();
      setPrintRows(all);
      setPrintMode("full");
      await runPdfCapture("participants.pdf");
    } catch (err) {
      console.error(err);
      setError("PDF ማውጣት አልተሳካም | PDF export failed");
    } finally {
      setPrintMode(null);
      setPrintRows([]);
      setExporting(false);
    }
  };

  const handleExportOrgPdf = async () => {
    setExporting(true);
    setError("");
    try {
      setPrintMode("org");
      await runPdfCapture("organization-breakdown.pdf");
    } catch (err) {
      console.error(err);
      setError("PDF ማውጣት አልተሳካም | PDF export failed");
    } finally {
      setPrintMode(null);
      setExporting(false);
    }
  };

  // ---------- Edit ----------
  const handleEditSave = async (id, payload) => {
    setSavingEdit(true);
    try {
      await api.put(`/bookings/${id}`, payload);
      setEditTarget(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "ማዘመን አልተሳካም | Failed to update participant",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ---------- Delete ----------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/bookings/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "ማጥፋት አልተሳካም | Failed to delete participant",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <DashboardSidebar />

      <main className="flex-1 px-4 py-6 md:py-8 min-w-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-white px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
              style={{ color: BRAND_DARK }}
              // onClick={() => navigate("/admin-dashboard")}
            >
              {/* <img src={back} alt="back" className="w-5 h-5" />
              መመለስ */}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportDetailExcel}
                className="text-white px-4 py-3 rounded-xl font-bold shadow transition disabled:opacity-60"
                style={{ backgroundColor: BRAND_DARK }}
              >
                {exporting ? "እየተላከ..." : "Excel አውርድ"}
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportDetailPdf}
                className="font-bold px-4 py-3 rounded-xl shadow transition disabled:opacity-60"
                style={{ backgroundColor: BRAND_ACCENT, color: BRAND_DARK }}
              >
                {exporting ? "እየተላከ..." : "PDF አውርድ"}
              </button>
            </div>
          </div>

          <h1
            className="text-2xl md:text-3xl font-extrabold mb-6"
            style={{ color: BRAND_DARK }}
          >
            የተሳታፊዎች ዳሽቦርድ | Participant Dashboard
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="ጠቅላላ ተሳታፊ / Total"
              value={stats.total}
              accent={BRAND_DARK}
            />
            <StatCard
              label="ወንድ / Men"
              value={stats.men}
              accent={BRAND_DARKER}
            />
            <StatCard
              label="ሴት / Women"
              value={stats.women}
              accent={BRAND_ACCENT}
            />
            <StatCard
              label="ድርጅቶች / Organizations"
              value={stats.organizations}
              accent="#4d7c8c"
            />
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 font-semibold">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow overflow-hidden mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
              <h2 className="font-bold text-lg" style={{ color: BRAND_DARK }}>
                በድርጅት የተከፋፈለ / Breakdown by Organization
              </h2>
              <div className="flex items-center gap-3">
                {activeOrganization && (
                  <button
                    className="text-sm underline"
                    style={{ color: BRAND_DARK }}
                    onClick={() => setActiveOrganization("")}
                  >
                    ማጣሪያ አጽዳ / Clear filter
                  </button>
                )}
                <button
                  type="button"
                  disabled={exporting}
                  onClick={handleExportOrgExcel}
                  className="text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition disabled:opacity-60"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  Excel
                </button>
                <button
                  type="button"
                  disabled={exporting}
                  onClick={handleExportOrgPdf}
                  className="px-3 py-2 rounded-lg text-xs font-bold shadow transition disabled:opacity-60"
                  style={{ backgroundColor: BRAND_ACCENT, color: BRAND_DARK }}
                >
                  PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ backgroundColor: BRAND_DARK }}>
                    <th className="py-3 px-4 text-white font-semibold">
                      ድርጅት / Organization
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ጠቅላላ / Total
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ወንድ / Men
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ሴት / Women
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrgRows.map((row, idx) => (
                    <tr
                      key={row.organization}
                      className={`cursor-pointer hover:bg-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      style={
                        activeOrganization === row.organization
                          ? { backgroundColor: "#eaf2f4" }
                          : undefined
                      }
                      onClick={() =>
                        setActiveOrganization((prev) =>
                          prev === row.organization ? "" : row.organization,
                        )
                      }
                    >
                      <td className="py-3 px-4">{row.organization}</td>
                      <td className="py-3 px-4 font-semibold">{row.count}</td>
                      <td className="py-3 px-4">{row.men}</td>
                      <td className="py-3 px-4">{row.women}</td>
                    </tr>
                  ))}
                  {orgSummary.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-400"
                      >
                        ምንም መረጃ የለም / No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pb-4">
              <Pagination
                page={orgPage}
                totalPages={orgTotalPages}
                onChange={setOrgPage}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
              <h2 className="font-bold text-lg" style={{ color: BRAND_DARK }}>
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ backgroundColor: BRAND_DARK }}>
                    <th className="py-3 px-4 text-white font-semibold">#</th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ሙሉ ስም / Name
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ድርጅት / Organization
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ስልክ / Phone
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ፆታ / Sex
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ቀን / Submitted
                    </th>
                    <th className="py-3 px-4 text-white font-semibold">
                      ተግባር / Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr
                      key={b._id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4">
                        {(page - 1) * PAGE_LIMIT + idx + 1}
                      </td>
                      <td className="py-3 px-4">{b.name}</td>
                      <td className="py-3 px-4">{b.organization}</td>
                      <td className="py-3 px-4">{b.phone}</td>
                      <td className="py-3 px-4">{b.sex}</td>
                      <td className="py-3 px-4">
                        {b.createdAt
                          ? new Date(b.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition"
                            style={{ backgroundColor: BRAND_DARK }}
                            onClick={() => setEditTarget(b)}
                          >
                            አርም / Edit
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition"
                            onClick={() => setDeleteTarget(b)}
                          >
                            አጥፋ / Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-gray-400"
                      >
                        ምንም መረጃ የለም / No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pb-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </div>
        </div>
      </main>

      <MessageModal
        open={!!deleteTarget}
        title="ማጥፋትን አረጋግጥ / Confirm Delete"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" የተባለውን ተሳታፊ መረጃ ማጥፋት ይፈልጋሉ? ይህ ተግባር መመለስ አይቻልም። | Delete "${deleteTarget.name}"? This cannot be undone.`
            : ""
        }
        type="warning"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmLabel={deleting ? "እየጠፋ..." : "አጥፋ / Delete"}
        cancelLabel="ይቅር / Cancel"
      />

      <EditParticipantModal
        open={!!editTarget}
        booking={editTarget}
        organizations={ORGANIZATIONS}
        sexOptions={SEX_OPTIONS}
        saving={savingEdit}
        onClose={() => setEditTarget(null)}
        onSave={handleEditSave}
      />

      {/* Hidden print container used only for PDF export snapshots. */}
      <div
        ref={printRef}
        style={{
          position: "fixed",
          top: 0,
          left: "-10000px",
          width: "900px",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {printMode && (
          <div>
            <div
              style={{
                backgroundColor: BRAND_DARK,
                padding: "20px 24px",
                borderBottom: `6px solid ${BRAND_ACCENT}`,
              }}
            >
              <h1 style={{ color: "#ffffff", fontSize: "22px", margin: 0 }}>
                {printMode === "org"
                  ? "በድርጅት የተከፋፈለ ሪፖርት / Organization Breakdown Report"
                  : "የተሳታፊዎች ሪፖርት / Participant Report"}
              </h1>
              <p
                style={{ color: "#e5eef0", fontSize: "12px", marginTop: "6px" }}
              >
                {buildSubtitle()}
              </p>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "20px" }}
              >
                {[
                  ["ጠቅላላ / Total", stats.total],
                  ["ወንድ / Men", stats.men],
                  ["ሴት / Women", stats.women],
                  ["ድርጅቶች / Organizations", stats.organizations],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      border: `1px solid ${BRAND_DARK}`,
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#555" }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: BRAND_DARK,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <h2
                style={{
                  color: BRAND_DARK,
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                በድርጅት የተከፋፈለ / Breakdown by Organization
              </h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: printMode === "full" ? "24px" : 0,
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: BRAND_DARK, color: "#fff" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>
                      ድርጅት / Organization
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>
                      ጠቅላላ / Total
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>
                      ወንድ / Men
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>
                      ሴት / Women
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgSummary.map((row, idx) => (
                    <tr
                      key={row.organization}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#f7f9fa" : "#ffffff",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.organization}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.count}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.men}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.women}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {printMode === "full" && (
                <>
                  <h2
                    style={{
                      color: BRAND_DARK,
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    ዝርዝር ዝርዝር / Detailed List
                  </h2>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "12px",
                    }}
                  >
                    <thead>
                      <tr
                        style={{ backgroundColor: BRAND_DARK, color: "#fff" }}
                      >
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          #
                        </th>
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          ሙሉ ስም / Name
                        </th>
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          ድርጅት / Organization
                        </th>
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          ስልክ / Phone
                        </th>
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          ፆታ / Sex
                        </th>
                        <th style={{ padding: "8px 10px", textAlign: "left" }}>
                          ቀን / Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {printRows.map((b, idx) => (
                        <tr
                          key={b._id}
                          style={{
                            backgroundColor:
                              idx % 2 === 0 ? "#f7f9fa" : "#ffffff",
                          }}
                        >
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {b.name}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {b.organization}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {b.phone}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {b.sex}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {b.createdAt
                              ? new Date(b.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
