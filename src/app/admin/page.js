'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';
import {
  adminLogin,
  adminLogout,
  getCurrentUser,
  getCrpAnalytics,
  getLiveStats,
  getAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  bookAppointment,
  getRoles,
  getPermissionsCatalog,
  createRole,
  getSlotConfig,
  getBlockedDates,
  blockDate,
  unblockDate,
  getBlogs,
  createBlog,
  deleteBlog,
  getResearchPapers,
  createPaper,
  deletePaper
} from '@/services/api';
import {
  Shield,
  Calendar,
  Users,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Check,
  X,
  BarChart3,
  TrendingUp,
  Sparkles,
  BookOpen,
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('crp'); // crp | appointments | roles | slots | blogs | papers

  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // CRP Analytics State
  const [crpData, setCrpData] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [crpPeriod, setCrpPeriod] = useState('30d');
  const [crpLoading, setCrpLoading] = useState(false);

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [apptFilter, setApptFilter] = useState('all');
  const [apptSearch, setApptSearch] = useState('');
  const [apptLoading, setApptLoading] = useState(false);
  const [showApptModal, setShowApptModal] = useState(false);
  const [apptSubmitting, setApptSubmitting] = useState(false);
  const [apptSuccessMsg, setApptSuccessMsg] = useState('');
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    phone: '',
    age: '',
    city: 'Bhopal',
    specialty: 'Retina & Vitreoretinal Surgery',
    preferredDate: '',
    preferredSlot: 'Morning (10:00 AM – 1:00 PM)',
    reason: '',
    consent: true
  });

  useEffect(() => {
    setNewAppt((prev) => ({
      ...prev,
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    }));
  }, []);

  // Roles & RBAC State
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleMessage, setRoleMessage] = useState('');

  // Slot Config State
  const [slotConfig, setSlotConfig] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [slotMessage, setSlotMessage] = useState('');

  // Blogs & Articles CMS State
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Retina & Vitreous',
    readTime: '4 min read',
    summary: '',
    content: '',
    author: 'Dr Sandhya Gaur (MD AIIMS)',
    keywords: ''
  });

  // Research Publications State
  const [papers, setPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    journal: 'Indian Journal of Ophthalmology',
    year: '2025',
    category: 'Vitreoretinal Surgery',
    authors: 'Dr Sandhya Gaur et al.',
    doi: '',
    citationsCount: 0,
    abstract: '',
    keyFindings: ''
  });

  // Check auth on mount
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Load data when authenticated or tab changes
  useEffect(() => {
    if (user) {
      if (activeTab === 'crp') loadCrp();
      if (activeTab === 'appointments') loadAppointments();
      if (activeTab === 'roles') loadRoles();
      if (activeTab === 'slots') loadSlotData();
      if (activeTab === 'blogs') loadBlogs();
      if (activeTab === 'papers') loadPapers();
    }
  }, [user, activeTab, crpPeriod]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await adminLogin(email.trim(), password.trim());
      setUser(res.user);
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setUser(null);
  };

  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  // 1. CRP Loader
  const loadCrp = async () => {
    setCrpLoading(true);
    try {
      const [crpRes, liveRes] = await Promise.all([
        getCrpAnalytics(crpPeriod),
        getLiveStats().catch(() => null)
      ]);
      setCrpData(crpRes);
      setLiveStats(
        liveRes?.stats || (liveRes ? { activeVisitorsLast15Min: liveRes.activeNow } : null)
      );
    } catch (err) {
      console.error('Failed to load CRP:', err);
    } finally {
      setCrpLoading(false);
    }
  };

  // 2. Appointments Loader
  const loadAppointments = async () => {
    setApptLoading(true);
    try {
      const params = {};
      if (apptFilter !== 'all') params.status = apptFilter;
      if (apptSearch.trim()) params.search = apptSearch.trim();
      const res = await getAdminAppointments(params);
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setApptLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      loadAppointments();
      loadCrp();
    } catch (err) {
      alert(`Could not update appointment: ${err.message}`);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!newAppt.patientName.trim()) {
      alert('Please enter patient name');
      return;
    }
    const cleanPhone = newAppt.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setApptSubmitting(true);
    try {
      await bookAppointment({
        ...newAppt,
        phone: cleanPhone,
        source: 'admin-portal'
      });
      setShowApptModal(false);
      setApptSuccessMsg(`Appointment for "${newAppt.patientName}" created successfully!`);
      setNewAppt({
        patientName: '',
        phone: '',
        age: '',
        city: 'Bhopal',
        specialty: 'Retina & Vitreoretinal Surgery',
        preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferredSlot: 'Morning (10:00 AM – 1:00 PM)',
        reason: '',
        consent: true
      });
      await loadAppointments();
      loadCrp();
      setTimeout(() => setApptSuccessMsg(''), 4000);
    } catch (err) {
      alert(`Failed to create appointment: ${err.message}`);
    } finally {
      setApptSubmitting(false);
    }
  };

  const handleDeleteAppointment = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to delete appointment ${ref || id}?`)) return;
    try {
      await deleteAppointment(id);
      loadAppointments();
      loadCrp();
    } catch (err) {
      alert(`Failed to delete appointment: ${err.message}`);
    }
  };

  // 3. Roles Loader
  const loadRoles = async () => {
    setRolesLoading(true);
    try {
      const [rolesRes, catRes] = await Promise.all([
        getRoles(),
        getPermissionsCatalog().catch(() => ({ catalog: [] }))
      ]);
      setRoles(rolesRes.roles || []);
      setCatalog(catRes.catalog || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setRolesLoading(false);
    }
  };

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      alert('Please enter a position name.');
      return;
    }
    try {
      await createRole({
        name: newRoleName.trim(),
        description: newRoleDesc.trim(),
        permissions: selectedPermissions
      });
      setRoleMessage(`Position "${newRoleName}" created successfully!`);
      setShowRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setSelectedPermissions([]);
      loadRoles();
      setTimeout(() => setRoleMessage(''), 4000);
    } catch (err) {
      alert(`Failed to create position: ${err.message}`);
    }
  };

  // 4. Slots Loader
  const loadSlotData = async () => {
    try {
      const [cfgRes, blkRes] = await Promise.all([
        getSlotConfig().catch(() => null),
        getBlockedDates().catch(() => ({ blockedDates: [] }))
      ]);
      if (cfgRes?.config) setSlotConfig(cfgRes.config);
      setBlockedDates(blkRes?.blockedDates || []);
    } catch (err) {
      console.error('Failed to load slot data:', err);
    }
  };

  const handleAddBlockedDate = async (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    try {
      await blockDate({
        date: newBlockDate,
        reason: newBlockReason || 'Holiday / Scheduled Closure'
      });
      setNewBlockDate('');
      setNewBlockReason('');
      setSlotMessage('Date blocked successfully.');
      loadSlotData();
      setTimeout(() => setSlotMessage(''), 3000);
    } catch (err) {
      alert(`Failed to block date: ${err.message}`);
    }
  };

  const handleUnblockDate = async (id) => {
    try {
      await unblockDate(id);
      loadSlotData();
    } catch (err) {
      alert(`Failed to unblock: ${err.message}`);
    }
  };

  // 5. Blogs Loader & Actions
  const loadBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await getBlogs({ limit: 50 });
      setBlogs(res.blogs || []);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title.trim()) {
      alert('Please enter a blog title.');
      return;
    }
    try {
      await createBlog({
        ...newBlog,
        keywords: newBlog.keywords ? newBlog.keywords.split(',').map((s) => s.trim()) : []
      });
      setShowBlogModal(false);
      setNewBlog({
        title: '',
        category: 'Retina & Vitreous',
        readTime: '4 min read',
        summary: '',
        content: '',
        author: 'Dr Sandhya Gaur (MD AIIMS)',
        keywords: ''
      });
      loadBlogs();
    } catch (err) {
      alert(`Failed to save blog post: ${err.message}`);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post from the database?')) return;
    try {
      await deleteBlog(id);
      loadBlogs();
    } catch (err) {
      alert(`Failed to delete blog: ${err.message}`);
    }
  };

  // 6. Papers Loader & Actions
  const loadPapers = async () => {
    setPapersLoading(true);
    try {
      const res = await getResearchPapers({ limit: 50 });
      setPapers(res.papers || res.data || []);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setPapersLoading(false);
    }
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newPaper.title.trim()) {
      alert('Please enter a publication title.');
      return;
    }
    try {
      await createPaper({
        ...newPaper,
        keyFindings: newPaper.keyFindings
          ? newPaper.keyFindings.split('\n').map((s) => s.trim()).filter(Boolean)
          : []
      });
      setShowPaperModal(false);
      setNewPaper({
        title: '',
        journal: 'Indian Journal of Ophthalmology',
        year: '2025',
        category: 'Vitreoretinal Surgery',
        authors: 'Dr Sandhya Gaur et al.',
        doi: '',
        citationsCount: 0,
        abstract: '',
        keyFindings: ''
      });
      loadPapers();
    } catch (err) {
      alert(`Failed to save research paper: ${err.message}`);
    }
  };

  const handleDeletePaper = async (id) => {
    if (!window.confirm('Are you sure you want to delete this research paper from the database?'))
      return;
    try {
      await deletePaper(id);
      loadPapers();
    } catch (err) {
      alert(`Failed to delete research paper: ${err.message}`);
    }
  };

  // ---------------------------------------------------------------------------
  // IF NOT LOGGED IN: Render Login Portal
  // ---------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061226] via-[#0A1E3F] to-[#122B55] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#0A1E3F] text-[#DFBF64] mb-3 shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-2xl font-black text-[#0A1E3F]">
              Nirvaya Staff Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage appointments, CRP analytics & clinic positions
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@nirvaya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#DFBF64]" />
              <span>{authLoading ? 'Signing in...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Registered Staff Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Registered Staff Logins
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live MongoDB Auth
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickFill('admin@nirvaya.com', 'Admin@123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
              >
                <strong className="text-[#0A1E3F] block">Super Admin</strong>
                <span className="text-[10px] text-slate-500">Full Root Access</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('manager@nirvaya.com', 'Nirvaya@123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
              >
                <strong className="text-[#0A1E3F] block">Clinic Manager</strong>
                <span className="text-[10px] text-slate-500">Analytics & Slots</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('nurse@nirvaya.com', 'Nirvaya@123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
              >
                <strong className="text-[#0A1E3F] block">Staff Nurse</strong>
                <span className="text-[10px] text-slate-500">Appointments Only</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('reception@nirvaya.com', 'Nirvaya@123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
              >
                <strong className="text-[#0A1E3F] block">Frontdesk</strong>
                <span className="text-[10px] text-slate-500">Patient Desk</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-[#0A1E3F] hover:text-[#C59B27] font-semibold transition-colors"
            >
              ← Return to Nirvaya Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED: Render Admin Console
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-[#061226] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo variant="light" size="sm" />
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DFBF64]/10 text-[#DFBF64] border border-[#DFBF64]/20">
              <Shield className="w-3 h-3" />
              Admin Command Centre
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[10.5px] text-[#DFBF64]">
                {user.role?.name || 'Administrator'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 scrollbar-none text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('crp')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'crp'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CRP Analytics & Funnel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'appointments'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments & Bookings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'roles'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Positions & Roles (RBAC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'slots'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>OPD Slots & Holidays</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'blogs'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blogs CMS ({blogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'papers'
                ? 'border-[#DFBF64] text-[#DFBF64] bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Research Papers ({papers.length})</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="ml-auto px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-[11px] font-normal hover:bg-slate-800 transition-colors"
          >
            Visit Live Site ↗
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================= */}
        {/* TAB 1: CRP Analytics & Funnel                                     */}
        {/* ================================================================= */}
        {activeTab === 'crp' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header + Time Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  CRP Funnel & Conversion Performance
                </h2>
                <p className="text-xs text-slate-500">
                  Track visitors from initial arrival through booking intent and completed clinical appointments
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={crpPeriod}
                  onChange={(e) => setCrpPeriod(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#0A1E3F] shadow-xs cursor-pointer focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                >
                  <option value="today">Today</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <button
                  type="button"
                  onClick={loadCrp}
                  className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
                  title="Refresh Metrics"
                >
                  <RefreshCw className={`w-4 h-4 ${crpLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Quick KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Unique Site Visitors
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-1 font-heading">
                  {crpLoading ? (
                    <span className="text-slate-300">...</span>
                  ) : (
                    (crpData?.summary?.uniqueVisitors ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{(crpData?.summary?.totalVisitors ?? 0).toLocaleString()} page views</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Booking Intent (CTAs)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-1 font-heading">
                  {crpLoading ? (
                    <span className="text-slate-300">...</span>
                  ) : (
                    (crpData?.summary?.bookingIntentCount ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-[11px] text-[#C59B27] font-semibold mt-1">
                  {crpData?.summary?.visitorToIntentRate ?? 0}% visitor interest
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bookings in Ledger
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-1 font-heading">
                  {crpLoading ? (
                    <span className="text-slate-300">...</span>
                  ) : (
                    (crpData?.summary?.appointmentsBooked ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-[11px] text-sky-600 font-semibold mt-1">
                  {crpData?.summary?.appointmentsConfirmed ?? 0} confirmed by coordinator
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Live Traffic
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-heading flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{liveStats?.activeVisitorsLast15Min ?? liveStats?.activeNow ?? 0}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">
                  Live now in last 15 min
                </div>
              </div>
            </div>

            {/* Visual Funnel Representation */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">
                    5-Stage Conversion Funnel Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated live from MongoDB Atlas visitor sessions and booking events
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                  ● Live Database Telemetry
                </span>
              </div>

              <div className="space-y-4">
                {crpData?.funnel && crpData.funnel.length > 0 ? (
                  crpData.funnel.map((stage) => (
                    <div
                      key={stage.step}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#0A1E3F] text-white flex items-center justify-center font-bold text-[11px]">
                            {stage.step}
                          </span>
                          <strong className="text-[#0A1E3F] font-heading">{stage.name}</strong>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700">
                            {stage.count.toLocaleString()} visitors
                          </span>
                          <span className="font-bold text-[#C59B27] bg-[#FDF9EE] px-2 py-0.5 rounded border border-[#DFBF64]/40">
                            {stage.conversionRate}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0A1E3F] to-[#C59B27] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(stage.conversionRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-4">No funnel data available for this range.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: Appointments & Bookings Management                         */}
        {/* ================================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  Consultation Appointments
                </h2>
                <p className="text-xs text-slate-500">
                  Manage patient consultation queue, verify WhatsApp requests, and confirm slots
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, ref..."
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAppointments()}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                  />
                </div>

                <select
                  value={apptFilter}
                  onChange={(e) => setApptFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#0A1E3F] shadow-xs cursor-pointer focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={loadAppointments}
                  className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
                  title="Refresh Appointments"
                >
                  <RefreshCw className={`w-4 h-4 ${apptLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowApptModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFBF64]" />
                  <span>New Appointment</span>
                </button>
              </div>
            </div>

            {apptSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{apptSuccessMsg}</span>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Patient Details</th>
                      <th className="py-3 px-4">Specialty</th>
                      <th className="py-3 px-4">Preferred Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="max-w-sm mx-auto space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-[#0A1E3F] flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-[#DFBF64]" />
                            </div>
                            <h4 className="font-heading font-bold text-slate-700 text-sm">
                              No Appointments in Database
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              You can test live database entry by creating an appointment manually here or submitting a pre-booking from the website.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowApptModal(true)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-[#DFBF64]" />
                              <span>Create Manual Appointment</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appt) => (
                        <tr key={appt.id || appt._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#0A1E3F]">
                            {appt.bookingRef || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="text-sm text-[#0A1E3F] block">
                              {appt.patientName}
                            </strong>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>📞 {appt.phone}</span>
                              {appt.city && <span>• {appt.city}</span>}
                              {appt.age && <span>• Age {appt.age}</span>}
                            </div>
                            {appt.reason && (
                              <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                                &ldquo;{appt.reason}&rdquo;
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {appt.specialty || 'General Consultation'}
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="text-slate-800 block">{appt.preferredDate}</strong>
                            <span className="text-[11px] text-slate-500">{appt.preferredSlot}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                appt.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : appt.status === 'completed'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : appt.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {appt.status !== 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(appt.id || appt._id, 'confirmed')}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                  title="Mark Confirmed"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {appt.status !== 'completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(appt.id || appt._id, 'completed')}
                                  className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors cursor-pointer"
                                  title="Mark Completed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {appt.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(appt.id || appt._id, 'cancelled')}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                                  title="Cancel Appointment"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAppointment(appt.id || appt._id, appt.bookingRef)
                                }
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: New Manual Appointment */}
            {showApptModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Create Patient Appointment
                      </h3>
                      <p className="text-xs text-slate-500">
                        Record offline / phone inquiry into live MongoDB database
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowApptModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Verma"
                        value={newAppt.patientName}
                        onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={newAppt.phone}
                          onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                        <input
                          type="number"
                          placeholder="48"
                          value={newAppt.age}
                          onChange={(e) => setNewAppt({ ...newAppt, age: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          placeholder="Bhopal"
                          value={newAppt.city}
                          onChange={(e) => setNewAppt({ ...newAppt, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Specialty
                        </label>
                        <select
                          value={newAppt.specialty}
                          onChange={(e) => setNewAppt({ ...newAppt, specialty: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        >
                          <option value="Retina & Vitreoretinal Surgery">
                            Retina & Vitreoretinal Surgery
                          </option>
                          <option value="Advanced Cataract & Phacoemulsification">
                            Advanced Cataract & Phaco
                          </option>
                          <option value="Glaucoma Diagnostics & Laser">
                            Glaucoma Diagnostics & Laser
                          </option>
                          <option value="Refractive & LASIK Evaluation">
                            Refractive & LASIK Evaluation
                          </option>
                          <option value="Cornea & Ocular Surface Disease">
                            Cornea & Ocular Surface
                          </option>
                          <option value="Pediatric Ophthalmology & Squint">
                            Pediatric Ophthalmology
                          </option>
                          <option value="Comprehensive Eye Examination">
                            Comprehensive Eye Examination
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={newAppt.preferredDate}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, preferredDate: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          OPD Shift
                        </label>
                        <select
                          value={newAppt.preferredSlot}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, preferredSlot: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        >
                          <option value="Morning (10:00 AM – 1:00 PM)">
                            Morning (10:00 AM – 1:00 PM)
                          </option>
                          <option value="Evening (5:00 PM – 8:00 PM)">
                            Evening (5:00 PM – 8:00 PM)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Reason / Patient Symptoms
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Sudden floaters in right eye, routine diabetic retina follow-up..."
                        value={newAppt.reason}
                        onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowApptModal(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={apptSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {apptSubmitting ? 'Saving to Database...' : 'Save Live Appointment'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: Positions & Role-Based Access Control (RBAC)               */}
        {/* ================================================================= */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  Staff Positions & Access Control (RBAC)
                </h2>
                <p className="text-xs text-slate-500">
                  Create custom clinical positions (Manager, Nurse, Receptionist) and configure granular permissions
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#DFBF64]" />
                <span>Create New Position</span>
              </button>
            </div>

            {roleMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{roleMessage}</span>
              </div>
            )}

            {/* Positions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id || role._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#DFBF64] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {role.id?.startsWith('role-admin')
                          ? 'Root System Role'
                          : 'Custom Position'}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">{role.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Assigned Permissions ({role.permissions?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: New Role */}
            {showRoleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Create Clinical Position
                      </h3>
                      <p className="text-xs text-slate-500">
                        Define role name and select authorized clinical permissions
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRoleModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateRole} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Position Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ophthalmic OT Coordinator"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Role Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Manages vitrectomy day-care scheduling and equipment readiness..."
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Assign Granular Permissions ({selectedPermissions.length} selected)
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                        {catalog.map((perm) => (
                          <label
                            key={perm.key}
                            className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer hover:text-[#0A1E3F]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.key)}
                              onChange={() => togglePermission(perm.key)}
                              className="mt-0.5 rounded text-[#0A1E3F] focus:ring-[#C59B27]"
                            />
                            <div>
                              <strong className="block text-[#0A1E3F] font-mono text-[11px]">
                                {perm.key}
                              </strong>
                              <span className="text-slate-500 text-[10.5px]">
                                {perm.description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowRoleModal(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Create Position
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: OPD Slots & Holiday Blocking                               */}
        {/* ================================================================= */}
        {activeTab === 'slots' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                OPD Slot Capacities & Scheduled Closures
              </h2>
              <p className="text-xs text-slate-500">
                Configure patient capacity per shift and block clinical holidays from public booking
              </p>
            </div>

            {slotMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{slotMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Block a Date */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">
                  Block a Date (Holiday / Conference)
                </h3>
                <p className="text-xs text-slate-500">
                  Dates added here will be automatically blocked in the patient pre-book modal and page
                </p>

                <form onSubmit={handleAddBlockedDate} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date to Block
                    </label>
                    <input
                      type="date"
                      required
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reason for Closure
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Diwali Public Holiday, National Vitreoretinal Conference"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Block Selected Date
                  </button>
                </form>

                {/* List of currently blocked dates */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Active Blocked Dates ({blockedDates.length})
                  </span>
                  <div className="space-y-2">
                    {blockedDates.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No dates currently blocked.</p>
                    ) : (
                      blockedDates.map((item) => (
                        <div
                          key={item.id || item._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div>
                            <strong className="text-[#0A1E3F] block">{item.date}</strong>
                            <span className="text-slate-500 text-[11px]">{item.reason}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnblockDate(item.id || item._id)}
                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Unblock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Shift Capacities */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">
                  Shift Capacity Thresholds
                </h3>
                <p className="text-xs text-slate-500">
                  Default maximum patient pre-bookings allowed per OPD session before triggering full capacity
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-[#0A1E3F] block text-sm">Morning OPD Session</strong>
                      <span className="text-xs text-slate-500">10:00 AM – 1:30 PM</span>
                    </div>
                    <span className="text-base font-extrabold text-[#C59B27] font-mono">
                      {slotConfig?.morningSlotCapacity || 15} Max / Day
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-[#0A1E3F] block text-sm">Evening OPD Session</strong>
                      <span className="text-xs text-slate-500">4:30 PM – 7:30 PM</span>
                    </div>
                    <span className="text-base font-extrabold text-[#C59B27] font-mono">
                      {slotConfig?.eveningSlotCapacity || 15} Max / Day
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 space-y-1">
                  <strong className="block font-bold">Automatic Emergency Quota:</strong>
                  Emergency trauma cases (retinal tear, acute vitreous hemorrhage) bypass online capacity limits.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: Clinical Blogs & Education CMS (MongoDB Atlas)             */}
        {/* ================================================================= */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  Clinical Articles & Blog CMS
                </h2>
                <p className="text-xs text-slate-500">
                  Manage patient education articles and vitreoretinal clinical perspectives in MongoDB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadBlogs}
                  className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 shadow-xs cursor-pointer"
                  title="Refresh Articles"
                >
                  <RefreshCw className={`w-4 h-4 ${blogsLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowBlogModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFBF64]" />
                  <span>Publish New Article</span>
                </button>
              </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Title & Excerpt</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Reading Time</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400">
                          No blog posts found.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((b) => (
                        <tr key={b.id || b._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <strong className="text-sm text-[#0A1E3F] block font-heading">
                              {b.title}
                            </strong>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {b.excerpt || b.summary}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{b.category}</td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {b.readingMinutes ? `${b.readingMinutes} min read` : b.readTime || '4 min read'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                            {b.viewsCount || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/blog/${b.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="View on Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteBlog(b.id || b._id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: New Blog Post */}
            {showBlogModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Publish New Clinical Article
                      </h3>
                      <p className="text-xs text-slate-500">
                        Saves directly into MongoDB and renders live on the website
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowBlogModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateBlog} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Article Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Innovations in Retinal Tear Laser Surgery"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newBlog.category}
                          onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        >
                          <option value="Retina & Vitreous">Retina & Vitreous</option>
                          <option value="Diabetic Retinopathy">Diabetic Retinopathy</option>
                          <option value="Macular Degeneration">Macular Degeneration</option>
                          <option value="Cataract & Phaco">Cataract & Phaco</option>
                          <option value="Pediatric Eye Care">Pediatric Eye Care</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Read Time
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 5 min read"
                          value={newBlog.readTime}
                          onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Summary (SEO Excerpt)
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Brief overview summarizing the article for patients and Google snippets..."
                        value={newBlog.summary}
                        onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Article Content
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Full body of clinical article..."
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        SEO Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="retina surgery, vitreous detachment, Bhopal eyecare"
                        value={newBlog.keywords}
                        onChange={(e) => setNewBlog({ ...newBlog, keywords: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowBlogModal(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Publish to MongoDB
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: Peer-Reviewed Research Publications (MongoDB Atlas)        */}
        {/* ================================================================= */}
        {activeTab === 'papers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  Peer-Reviewed Research Publications
                </h2>
                <p className="text-xs text-slate-500">
                  Manage scientific ophthalmology publications authored by Dr Sandhya Gaur in MongoDB Atlas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadPapers}
                  className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 shadow-xs cursor-pointer"
                  title="Refresh Publications"
                >
                  <RefreshCw className={`w-4 h-4 ${papersLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaperModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFBF64]" />
                  <span>Publish Research Paper</span>
                </button>
              </div>
            </div>

            {/* Publications List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Title & Journal</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4">Citations</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {papers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400">
                          No research publications found.
                        </td>
                      </tr>
                    ) : (
                      papers.map((p) => (
                        <tr key={p.id || p._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <strong className="text-sm text-[#0A1E3F] block font-heading">
                              {p.title}
                            </strong>
                            <span className="text-[11px] text-[#C59B27] font-semibold">
                              {p.journal}
                            </span>
                            {p.doi && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                DOI: {p.doi}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{p.specialty || p.category}</td>
                          <td className="py-3.5 px-4 font-mono">{p.year}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#C59B27]">
                            {p.citationCount ?? p.citationsCount ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href="/research"
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="View Publication on Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeletePaper(p.id || p._id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Delete from Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Publish New Research Paper */}
            {showPaperModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Publish Peer-Reviewed Publication
                      </h3>
                      <p className="text-xs text-slate-500">
                        Persists academic publication record directly into MongoDB Atlas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaperModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePaper} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Paper Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Outcome of 27-Gauge Vitrectomy in Complex Proliferative Diabetic Retinopathy"
                        value={newPaper.title}
                        onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Journal
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ophthalmology Retina"
                          value={newPaper.journal}
                          onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026"
                          value={newPaper.year}
                          onChange={(e) => setNewPaper({ ...newPaper, year: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vitreoretinal Surgery"
                          value={newPaper.category}
                          onChange={(e) =>
                            setNewPaper({ ...newPaper, category: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Authors
                        </label>
                        <input
                          type="text"
                          placeholder="Dr Sandhya Gaur, et al."
                          value={newPaper.authors}
                          onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          DOI / Link
                        </label>
                        <input
                          type="text"
                          placeholder="10.1016/j.oret.2025.04.012"
                          value={newPaper.doi}
                          onChange={(e) => setNewPaper({ ...newPaper, doi: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Abstract
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Comprehensive scientific abstract..."
                        value={newPaper.abstract}
                        onChange={(e) => setNewPaper({ ...newPaper, abstract: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowPaperModal(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Save Paper to MongoDB
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
