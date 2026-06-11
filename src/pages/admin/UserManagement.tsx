import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, X, RefreshCw, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';

interface UserManagementProps {
  adminPassword: string;
}

const PERSONA_OPTIONS: { value: string; label: string }[] = [
  { value: 'software-engineering',   label: 'Code Architect' },
  { value: 'graphics-multimedia',    label: 'Pixel Maestro' },
  { value: 'cybersecurity',          label: 'Cyber Sentinel' },
  { value: 'artificial-intelligence', label: 'AI Pioneer' },
  { value: 'business-analytics',     label: 'Data Oracle' },
  { value: 'systems-networking',     label: 'Network Titan' },
];

const personaLabel = (slug: string | null | undefined): string => {
  if (!slug) return '—';
  return PERSONA_OPTIONS.find((p) => p.value === slug)?.label ?? slug;
};

export function UserManagement({ adminPassword }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [personaFilter, setPersonaFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.getStudents();
      if (res.success && res.students) setUsers(res.students);
    } catch (err: any) {
      console.error('Failed to fetch students', err);
      setFetchError(err.message || 'Failed to load students. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPersona = personaFilter === 'All' || user.persona === personaFilter;
    return matchesSearch && matchesPersona;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.adminDeleteStudent(id, adminPassword);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await api.adminUpdateStudent(
        editingUser.id,
        {
          name: editingUser.name,
          email: editingUser.email,
          age: editingUser.age ? parseInt(editingUser.age, 10) : undefined,
          persona: editingUser.persona,
        },
        adminPassword,
      );
      if (res.success && res.student) {
        setUsers((prev) => prev.map((u) => (u.id === res.student.id ? res.student : u)));
        setEditingUser(null);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────

  const EXPORT_COLUMNS = [
    { key: 'name',                  label: 'Name' },
    { key: 'email',                 label: 'Email' },
    { key: 'phone_number',          label: 'Phone' },
    { key: 'age',                   label: 'Age' },
    { key: 'school_name',           label: 'School' },
    { key: 'highest_qualification', label: 'Qualification' },
    { key: 'persona',               label: 'Persona' },
    { key: 'quiz_completed',        label: 'Quiz Done' },
    { key: 'created_at',            label: 'Registered At' },
  ];

  const buildRows = (data: any[]) =>
    data.map((u) =>
      EXPORT_COLUMNS.map(({ key }) => {
        if (key === 'quiz_completed') return u[key] ? 'Yes' : 'No';
        if (key === 'persona') return personaLabel(u[key]);
        if (key === 'created_at') return u[key] ? new Date(u[key]).toLocaleDateString('en-MY') : '—';
        return u[key] ?? '—';
      }),
    );

  const handleExportExcel = () => {
    const headers = EXPORT_COLUMNS.map((c) => c.label);
    const rows = buildRows(filteredUsers);
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MyUniPath_Students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const headers = EXPORT_COLUMNS.map((c) => c.label);
    const rows = buildRows(filteredUsers);
    const date = new Date().toLocaleDateString('en-MY');
    const headerCells = headers.map((h) => `<th>${h}</th>`).join('');
    const bodyRows = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('');
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>MyUniPath Students Export</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:9pt;color:#111}
.hdr{background:#0F3361;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}
.hdr h1{font-size:14pt;font-weight:bold}
.hdr p{font-size:8pt;opacity:.85}
table{width:100%;border-collapse:collapse}
th{background:#0F3361;color:#fff;padding:6px 8px;text-align:left;font-size:8pt}
td{padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:8pt}
tr:nth-child(even) td{background:#f5f7fa}
@media print{@page{size:A4 landscape;margin:10mm}}
</style></head>
<body>
<div class="hdr"><h1>MyUniPath — Student Export</h1>
<p>UNITEN CCI &nbsp;|&nbsp; Generated: ${date} &nbsp;|&nbsp; Total: ${filteredUsers.length} students</p></div>
<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
<script>window.onload=()=>{window.print()}<\/script>
</body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none text-foreground"
            >
              <option value="All">All Personas</option>
              {PERSONA_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleExportExcel}
            disabled={filteredUsers.length === 0}
            title="Export as CSV (opens in Excel)"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500 hover:text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={handleExportPdf}
            disabled={filteredUsers.length === 0}
            title="Print / Save as PDF"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500 hover:text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-medium">
          ⚠️ {fetchError}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 border-b border-border text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">School</th>
                <th className="px-6 py-4">Qualification</th>
                <th className="px-6 py-4">Persona</th>
                <th className="px-6 py-4">Quiz</th>
                <th className="px-6 py-4">Transcript</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{user.phone_number || '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{user.age || '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-[160px] truncate" title={user.school_name}>{user.school_name || '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{user.highest_qualification || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#0F3361]/10 text-[#0F3361] dark:bg-blue-500/20 dark:text-blue-400 border border-[#0F3361]/20 dark:border-blue-500/30">
                        {personaLabel(user.persona)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.quiz_completed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Done</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-muted-foreground border border-border">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.transcript_path ? (
                        <a
                          href={`http://localhost:8000/storage/${user.transcript_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-blue-500 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isLoading && (
            <div className="flex justify-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full relative"
            >
              <button
                onClick={() => setEditingUser(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-6 text-foreground">Edit User Info</h3>
              {saveError && (
                <div className="mb-4 p-3 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm rounded-lg">
                  {saveError}
                </div>
              )}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-muted-foreground">Age</label>
                    <input
                      type="number"
                      value={editingUser.age}
                      onChange={(e) => setEditingUser({ ...editingUser, age: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-muted-foreground">Persona</label>
                    <select
                      value={editingUser.persona ?? ''}
                      onChange={(e) => setEditingUser({ ...editingUser, persona: e.target.value || null })}
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:outline-none transition-all text-sm appearance-none"
                    >
                      <option value="">— None —</option>
                      {PERSONA_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setEditingUser(null); setSaveError(null); }}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors text-sm disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
