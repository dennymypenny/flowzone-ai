"use client";
import { useState, useEffect } from "react";

const MOCK_LEADS = [
  { id: 1, name: "Sarah Kim", email: "sarah@acmecorp.com", company: "Acme Corp", budget: "$1,000–$2,500", status: "paid", date: "2026-03-18", notes: "Signed up for Growth plan" },
  { id: 2, name: "James Rodriguez", email: "james@startupxyz.io", company: "StartupXYZ", budget: "$500–$1,p00", status: "contacted", date: "2026-03-17", notes: "Discovery call scheduled" },
  { id: 3, name: "Mei Chen", email: "mei@retailco.com", company: "RetailCo", budget: "$2,500–$5,000", status: "new", date: "2026-03-17", notes: "" },
  { id: 4, name: "Alex Thompson", email: "alex@agencypro.com", company: "AgencyPro", budget: "$1,000–$2,500", status: "new", date: "2026-03-16", notes: "" },
  { id: 5, name: "Priya Patel", email: "priya@consulting.co", company: "Consulting Co", budget: "$500–$1,000", status: "contacted", date: "2026-03-15", notes: "Followed up twice" },
  { id: 6, name: "David Wu", email: "david@techfirm.io", company: "TechFirm", budget: "$5,000+", status: "paid", date: "2026-03-14", notes: "Enterprise client" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-indigo-100 text-indigo-700" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", color: "bg-green-100 text-green-700" },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [leads] = useState(MOCK_LEADS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(localStorage.getItem("fz_admin_auth") === "true");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "flowzone2026") {
      localStorage.setItem("fz_admin_auth", "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fz_admin_auth");
    setAuthed(false);
    setPassword("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-indigo-400 font-bold text-lg tracking-wide">FLOWZONE AI</p>
            <h1 className="text-3xl font-black text-white mt-2">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <label className="block text-sm font-semibold text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors mb-4"
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const stats = {
    total: leads.length,
    newThisWeek: leads.filter((l) => l.status === "new").length,
    paid: leads.filter((l) => l.status === "paid").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-950 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">FlowZone AI</p>
            <h1 className="text-xl font-black">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors border border-gray-700 px-4 py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mock data notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-8 flex items-center gap-3">
          <span className="text-yellow-500 text-lg">⚠️</span>
          <p className="text-yellow-800 text-sm">
            <strong>Showing mock data.</strong> Connect Supabase to see live leads from your intake form.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Leads", value: stats.total, color: "text-gray-900" },
            { label: "New / Uncontacted", value: stats.newThisWeek, color: "text-indigo-600" },
            { label: "Paid Conversions", value: stats.paid, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-sm font-medium mb-1">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "new", "contacted", "paid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                filter === f ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
              }`}
            >
              {f === "all" ? "All Leads" : f}
            </button>
          ))}
        </div>

        {/* Leads table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => (
                <tr key={lead.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filteredLeads.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                    <p className="text-gray-400 text-xs">{lead.company}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.budget}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[lead.status]?.color}`}>
                      {STATUS_CONFIG[lead.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{lead.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors">
                        Mark Contacted
                      </button>
                      <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">No leads in this category</p>
              <p className="text-sm">Check back after connecting live data</p>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-xs text-center mt-8">
          FlowZone AI Admin · Secure · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
