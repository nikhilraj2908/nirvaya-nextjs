'use client';

import React, { useState, useEffect } from 'react';
import SafeLink from '@/components/common/SafeLink';
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
  deletePaper,
  changePassword,
  createStaffUser
} from '@/services/api';
import { PERMISSION_DEFINITIONS } from '@/lib/permissions';
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
  BookOpen,
  FileText,
  Trash2,
  ExternalLink,
  Activity,
  Globe,
  Copy,
  Sparkles,
  Eye,
  EyeOff,
  Compass,
  Smartphone,
  Monitor,
  Tablet,
  MousePointerClick,
  MessageSquare,
  PhoneCall,
  ArrowUpRight,
  Radio,
  Layers,
  PieChart,
  Key,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Mail,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 0) return 'Just now';
  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

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
  const [hoveredDay, setHoveredDay] = useState(null);

  // Google Analytics 4 (GA4) State
  const [copiedGaId, setCopiedGaId] = useState(false);
  const [lookerStudioUrl, setLookerStudioUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nirvaya_looker_studio_url') || '';
    }
    return '';
  });
  const [tempLookerUrl, setTempLookerUrl] = useState('');
  const [showLookerSettings, setShowLookerSettings] = useState(false);

  const handleCopyGaId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('G-KY995SYKY6');
      setCopiedGaId(true);
      setTimeout(() => setCopiedGaId(false), 2000);
    }
  };

  const handleSaveLookerUrl = () => {
    setLookerStudioUrl(tempLookerUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nirvaya_looker_studio_url', tempLookerUrl);
    }
    setShowLookerSettings(false);
  };

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
  const [catalog, setCatalog] = useState(() => PERMISSION_DEFINITIONS.flatMap((c) => c.permissions));
  const [permissionGroups, setPermissionGroups] = useState(() => PERMISSION_DEFINITIONS);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleMessage, setRoleMessage] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);

  // User Assignment on Role Creation
  const [assignUserNow, setAssignUserNow] = useState(true);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [userPasswordMode, setUserPasswordMode] = useState('otp'); // 'otp' | 'manual'
  const [customPassword, setCustomPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(() => `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`);

  // Credentials Display Modal for Created User
  const [createdUserCredentials, setCreatedUserCredentials] = useState(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Role Selection on Login Screen
  const [publicRoles, setPublicRoles] = useState([]);
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState(null);
  const [loginRoleUsers, setLoginRoleUsers] = useState([]);
  const [showLoginPassText, setShowLoginPassText] = useState(false);

  // Add Staff User to an Existing Role Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [targetRoleIdForUser, setTargetRoleIdForUser] = useState('');
  const [addUserName, setAddUserName] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserPhone, setAddUserPhone] = useState('');
  const [addUserPasswordMode, setAddUserPasswordMode] = useState('otp'); // 'otp' | 'manual'
  const [addUserCustomPassword, setAddUserCustomPassword] = useState('');
  const [addUserGeneratedOtp, setAddUserGeneratedOtp] = useState(() => `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`);
  const [addUserSubmitting, setAddUserSubmitting] = useState(false);

  // Forced First-Time Login Password Change State
  const [showFirstTimePasswordModal, setShowFirstTimePasswordModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [firstTimeNewPass, setFirstTimeNewPass] = useState('');
  const [firstTimeConfirmPass, setFirstTimeConfirmPass] = useState('');
  const [firstTimeError, setFirstTimeError] = useState('');
  const [firstTimeLoading, setFirstTimeLoading] = useState(false);
  const [showPassText, setShowPassText] = useState(false);

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
    const cur = getCurrentUser();
    if (cur) {
      if (cur.mustChangePassword) {
        setPendingUser(cur);
        setShowFirstTimePasswordModal(true);
      } else {
        setUser(cur);
      }
    }
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

  // Load public roles directory for the login portal
  useEffect(() => {
    getRoles()
      .then((res) => {
        if (res?.roles) setPublicRoles(res.roles);
      })
      .catch((err) => console.error('Failed to load login roles:', err));
  }, [user]);

  // Realtime Poller for Live Traffic & Active Visitors
  useEffect(() => {
    if (user && activeTab === 'crp') {
      const interval = setInterval(() => {
        getLiveStats()
          .then((liveRes) => {
            if (liveRes) {
              setLiveStats(
                liveRes.stats || { activeVisitorsLast15Min: liveRes.activeNow || 0 }
              );
            }
          })
          .catch(() => {});
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  // Handle Login Role Selection
  const handleSelectRoleForLogin = (role) => {
    setSelectedRoleForLogin(role);
    const users = role.users || [];
    setLoginRoleUsers(users);
    if (users.length > 0) {
      setEmail(users[0].email);
    } else {
      setEmail('');
    }
    setPassword('');
    setAuthError('');
  };

  const handleBackToRoleSelection = () => {
    setSelectedRoleForLogin(null);
    setLoginRoleUsers([]);
    setEmail('');
    setPassword('');
    setAuthError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await adminLogin(email.trim(), password.trim());
      if (res.mustChangePassword) {
        setPendingUser(res.user);
        setShowFirstTimePasswordModal(true);
      } else {
        setUser(res.user);
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFirstTimePasswordSubmit = async (e) => {
    e.preventDefault();
    setFirstTimeError('');
    if (firstTimeNewPass.length < 6) {
      setFirstTimeError('New password must be at least 6 characters long.');
      return;
    }
    if (firstTimeNewPass !== firstTimeConfirmPass) {
      setFirstTimeError('Passwords do not match. Please verify.');
      return;
    }
    setFirstTimeLoading(true);
    try {
      const res = await changePassword({
        email: pendingUser?.email || email.trim(),
        newPassword: firstTimeNewPass.trim()
      });
      setShowFirstTimePasswordModal(false);
      setUser(res.user || pendingUser);
      setFirstTimeNewPass('');
      setFirstTimeConfirmPass('');
      alert('Your permanent password has been set successfully! Welcome to the portal.');
    } catch (err) {
      setFirstTimeError(err.message || 'Failed to update password.');
    } finally {
      setFirstTimeLoading(false);
    }
  };

  // Add Staff User to an Existing Role Handler
  const handleAddStaffUserSubmit = async (e) => {
    e.preventDefault();
    if (!targetRoleIdForUser) {
      alert('Please select a position/role.');
      return;
    }
    if (!addUserEmail.trim()) {
      alert('Please enter a login email address for the staff member.');
      return;
    }
    if (addUserPasswordMode === 'manual' && (!addUserCustomPassword.trim() || addUserCustomPassword.trim().length < 6)) {
      alert('Please enter a manual password of at least 6 characters.');
      return;
    }

    setAddUserSubmitting(true);
    try {
      const res = await createStaffUser({
        roleId: targetRoleIdForUser,
        name: addUserName.trim() || 'Staff Member',
        email: addUserEmail.trim(),
        phone: addUserPhone.trim(),
        passwordMode: addUserPasswordMode,
        password: addUserPasswordMode === 'manual' ? addUserCustomPassword.trim() : addUserGeneratedOtp
      });

      setShowAddUserModal(false);
      setAddUserName('');
      setAddUserEmail('');
      setAddUserPhone('');
      setAddUserCustomPassword('');
      const nextOtp = `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`;
      setAddUserGeneratedOtp(nextOtp);

      if (res.user) {
        setCreatedUserCredentials(res.user);
      } else {
        setRoleMessage('Staff member added successfully!');
        setTimeout(() => setRoleMessage(''), 4000);
      }

      await loadRoles();
      getRoles().then((r) => r?.roles && setPublicRoles(r.roles)).catch(() => {});
    } catch (err) {
      alert(`Failed to add staff member: ${err.message}`);
    } finally {
      setAddUserSubmitting(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setUser(null);
    setSelectedRoleForLogin(null);
    setLoginRoleUsers([]);
    setEmail('');
    setPassword('');
    getRoles().then((res) => {
      if (res?.roles) setPublicRoles(res.roles);
    }).catch(() => {});
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
        getPermissionsCatalog().catch(() => ({ catalog: [], definitions: PERMISSION_DEFINITIONS }))
      ]);
      setRoles(rolesRes.roles || []);
      const defs = catRes?.definitions?.length > 0 ? catRes.definitions : PERMISSION_DEFINITIONS;
      setPermissionGroups(defs);
      const flat = catRes?.catalog?.length > 0 ? catRes.catalog : defs.flatMap((c) => c.permissions);
      setCatalog(flat);
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

  const selectAllPermissions = () => {
    const allKeys = catalog.map((p) => p.key);
    setSelectedPermissions(allKeys);
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const toggleCategoryPermissions = (categoryPerms) => {
    const keys = categoryPerms.map((p) => p.key);
    const allSelected = keys.every((k) => selectedPermissions.includes(k));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !keys.includes(k)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])));
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      alert('Please enter a position name.');
      return;
    }
    if (selectedPermissions.length === 0) {
      if (!window.confirm('No permissions selected for this position. Do you want to continue without permissions?')) {
        return;
      }
    }
    if (assignUserNow && !newUserEmail.trim()) {
      alert('Please enter an email ID (Login ID) for the assigned user.');
      return;
    }
    if (assignUserNow && userPasswordMode === 'manual' && (!customPassword.trim() || customPassword.trim().length < 6)) {
      alert('Please enter a manual password of at least 6 characters.');
      return;
    }

    try {
      const payload = {
        name: newRoleName.trim(),
        description: newRoleDesc.trim(),
        permissions: selectedPermissions,
        assignUser: assignUserNow
          ? {
              name: (newUserName.trim() || newRoleName.trim()),
              email: newUserEmail.trim(),
              phone: newUserPhone.trim(),
              passwordMode: userPasswordMode,
              password: userPasswordMode === 'manual' ? customPassword.trim() : generatedOtp
            }
          : null
      };

      const res = await createRole(payload);

      setShowRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setSelectedPermissions([]);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setCustomPassword('');
      const nextOtp = `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedOtp(nextOtp);

      if (res.user) {
        setCreatedUserCredentials(res.user);
      } else {
        setRoleMessage(`Position "${newRoleName}" created successfully!`);
        setTimeout(() => setRoleMessage(''), 4000);
      }

      loadRoles();
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
  // FORCED FIRST-TIME PASSWORD SETUP (When logged in with temporary OTP)
  // ---------------------------------------------------------------------------
  if (showFirstTimePasswordModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061226] via-[#0A1E3F] to-[#122B55] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#DFBF64]/20 text-[#DFBF64] border border-[#C59B27]/40 mb-3 shadow-md">
              <Key className="w-8 h-8 text-[#C59B27]" />
            </div>
            <h1 className="font-heading text-2xl font-black text-[#0A1E3F]">
              Set Permanent Password
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Your account was initialized with a one-time temporary password. You must set a new confidential password before continuing to the clinical dashboard.
            </p>
          </div>

          {firstTimeError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{firstTimeError}</span>
            </div>
          )}

          <form onSubmit={handleFirstTimePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Email (Login ID)
              </label>
              <input
                type="email"
                disabled
                value={pendingUser?.email || email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Permanent Password *
              </label>
              <div className="relative">
                <input
                  type={showPassText ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter at least 6 characters"
                  value={firstTimeNewPass}
                  onChange={(e) => setFirstTimeNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassText(!showPassText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Permanent Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Re-type new password"
                value={firstTimeConfirmPass}
                onChange={(e) => setFirstTimeConfirmPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={firstTimeLoading}
              className="w-full py-3 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#DFBF64]" />
              <span>{firstTimeLoading ? 'Saving New Password...' : 'Save Password & Enter Dashboard'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                adminLogout();
                setShowFirstTimePasswordModal(false);
                setPendingUser(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Cancel and sign in as different user
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // IF NOT LOGGED IN: Render Login Portal
  // ---------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061226] via-[#0A1E3F] to-[#122B55] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#0A1E3F] text-[#DFBF64] mb-3 shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-2xl font-black text-[#0A1E3F]">
              Nirvaya Staff Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {selectedRoleForLogin
                ? `Sign in as ${selectedRoleForLogin.name}`
                : 'Select your clinical position to access your dashboard'}
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* VIEW A: Choose Clinical Position */}
          {!selectedRoleForLogin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C59B27]" />
                  Select Clinical Position ({publicRoles.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live MongoDB Roles
                </span>
              </div>

              {publicRoles.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Loading clinical positions from database...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                  {publicRoles.map((role) => {
                    const users = role.users || [];
                    const isSystem = role.id?.startsWith('role-admin');
                    return (
                      <button
                        key={role.id || role.slug}
                        type="button"
                        onClick={() => handleSelectRoleForLogin(role)}
                        className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#DFBF64] hover:shadow-md text-left transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                              {isSystem ? 'System Root' : 'Clinical Position'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#C59B27] group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <strong className="block text-sm font-bold text-[#0A1E3F] group-hover:text-[#0A1E3F]">
                            {role.name}
                          </strong>
                          <p className="text-[10.5px] text-slate-500 line-clamp-1">
                            {role.description || 'Clinical staff access'}
                          </p>
                        </div>

                        {/* Assigned Staff Preview */}
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                          {users.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-[10.5px] text-slate-700 font-medium truncate">
                                {users[0].name}
                                {users.length > 1 && ` (+${users.length - 1} more)`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              No staff assigned yet
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Direct Manual Sign In Option */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRoleForLogin({
                      id: null,
                      name: 'Direct Staff Sign-In',
                      description: 'Enter your assigned credentials manually'
                    })
                  }
                  className="text-xs text-[#0A1E3F] hover:text-[#C59B27] font-semibold transition-colors cursor-pointer"
                >
                  Or enter credentials manually →
                </button>
                <SafeLink
                  href="/"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Return to Website
                </SafeLink>
              </div>
            </div>
          ) : (
            /* VIEW B: Login Form For Selected Position */
            <div className="space-y-4">
              {/* Back to Role Selector Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={handleBackToRoleSelection}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1E3F] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Different Position</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DFBF64]/20 text-[#0A1E3F] border border-[#C59B27]/30">
                  {selectedRoleForLogin.name}
                </span>
              </div>

              {/* Selected Position Header Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Signing in to Position:
                  </span>
                  <span className="text-xs font-bold text-[#0A1E3F]">
                    {selectedRoleForLogin.name}
                  </span>
                </div>
                {selectedRoleForLogin.description && (
                  <p className="text-[11px] text-slate-500">
                    {selectedRoleForLogin.description}
                  </p>
                )}

                {/* Staff Account Selector */}
                {loginRoleUsers.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Assigned Staff User:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {loginRoleUsers.map((u) => (
                        <button
                          key={u.id || u.email}
                          type="button"
                          onClick={() => setEmail(u.email)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            email === u.email
                              ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold">{u.name}</span>
                          <span className="font-mono text-[10px] opacity-80 block">{u.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff Email Address (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff@nirvaya.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password or Temporary OTP *
                    </label>
                    <span className="text-[10.5px] text-[#C59B27] font-semibold">
                      OTP sets permanent password
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassText ? 'text' : 'password'}
                      required
                      placeholder="•••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassText(!showLoginPassText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showLoginPassText ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    If signing in with a system-generated OTP, you will be prompted to set your private permanent password immediately after authentication.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#DFBF64]" />
                  <span>
                    {authLoading
                      ? 'Authenticating...'
                      : `Sign In to ${selectedRoleForLogin.name || 'Portal'}`}
                  </span>
                </button>
              </form>

              {/* Demo Fill Quick Helpers for Default Accounts */}
              {selectedRoleForLogin.slug === 'admin' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => quickFill('admin@nirvaya.com', 'Admin@123')}
                    className="text-[11px] text-[#C59B27] hover:underline cursor-pointer font-semibold"
                  >
                    Quick fill demo credentials for Super Admin
                  </button>
                </div>
              )}
              {selectedRoleForLogin.slug === 'manager' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => quickFill('manager@nirvaya.com', 'Nirvaya@123')}
                    className="text-[11px] text-[#C59B27] hover:underline cursor-pointer font-semibold"
                  >
                    Quick fill demo credentials for Clinic Manager
                  </button>
                </div>
              )}
              {selectedRoleForLogin.slug === 'nurse' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => quickFill('nurse@nirvaya.com', 'Nirvaya@123')}
                    className="text-[11px] text-[#C59B27] hover:underline cursor-pointer font-semibold"
                  >
                    Quick fill demo credentials for Staff Nurse
                  </button>
                </div>
              )}
              {selectedRoleForLogin.slug === 'receptionist' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => quickFill('reception@nirvaya.com', 'Nirvaya@123')}
                    className="text-[11px] text-[#C59B27] hover:underline cursor-pointer font-semibold"
                  >
                    Quick fill demo credentials for Frontdesk
                  </button>
                </div>
              )}
            </div>
          )}
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
            <span>Analytics & Visitor Traffic</span>
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

          <SafeLink
            href="/"
            target="_blank"
            className="ml-auto px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-[11px] font-normal hover:bg-slate-800 transition-colors"
          >
            Visit Live Site ↗
          </SafeLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================= */}
        {/* TAB 1: CRP Analytics & Funnel                                     */}
        {/* ================================================================= */}
        {/* ================================================================= */}
        {/* TAB 1: Traffic & Visitor Analytics Command Hub                    */}
        {/* ================================================================= */}
        {activeTab === 'crp' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header + Time Filter */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Live Visitor Telemetry Active
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    GA4 Tag: <code className="text-[#0A1E3F] font-bold font-mono">G-KY995SYKY6</code>
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0A1E3F]">
                  Traffic & Visitor Intelligence Centre
                </h2>
                <p className="text-xs text-slate-500">
                  Live in-panel Google Analytics & patient journey data — no external logins required
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: '7d', label: '7 Days' },
                    { id: '14d', label: '14 Days' },
                    { id: '30d', label: '30 Days' },
                    { id: '90d', label: '90 Days' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCrpPeriod(p.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        crpPeriod === p.id
                          ? 'bg-[#0A1E3F] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={loadCrp}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  title="Refresh Metrics"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${crpLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Metric Cards (8 Core Indicators) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 1. Unique Visitors */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#C59B27]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Unique Visitors</span>
                  <Users className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-2 font-heading">
                  {crpLoading ? (
                    <span className="text-slate-300">...</span>
                  ) : (
                    (crpData?.summary?.uniqueVisitors ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span className="font-semibold text-emerald-600">● Live sessions</span>
                  <span>in selected window</span>
                </div>
              </div>

              {/* 2. Total Pageviews */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#C59B27]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Total Page Views</span>
                  <Eye className="w-4 h-4 text-[#C59B27]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-2 font-heading">
                  {crpLoading ? (
                    <span className="text-slate-300">...</span>
                  ) : (
                    (crpData?.summary?.totalVisitors ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Avg. {crpData?.summary?.uniqueVisitors > 0 ? (crpData.summary.totalVisitors / crpData.summary.uniqueVisitors).toFixed(1) : 1} views/patient
                </div>
              </div>

              {/* 3. Pre-Book Intent */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#C59B27]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Pre-Book Intent (CTAs)</span>
                  <MousePointerClick className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-2 font-heading">
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

              {/* 4. Live Active Users */}
              <div className="bg-gradient-to-br from-emerald-900 to-[#061226] text-white rounded-2xl p-5 border border-emerald-700/40 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  <span>Active Now on Site</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-heading flex items-center gap-2">
                  <span>{liveStats?.activeVisitorsLast15Min ?? liveStats?.activeNow ?? 0}</span>
                  <span className="text-xs text-emerald-300 font-normal">patients</span>
                </div>
                <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Realtime last 15 min</span>
                </div>
              </div>
            </div>

            {/* Daily Traffic Trends Chart (Interactive Bar Visualization) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1E3F] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C59B27]" />
                    <span>Daily Traffic Volume & Pageview Trends</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Day-by-day distribution of patient visits and clinical browsing engagement
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-sm bg-[#0A1E3F]" />
                    <span>Page Views</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-sm bg-[#DFBF64]" />
                    <span>Booking Clicks</span>
                  </span>
                </div>
              </div>

              {/* Chart Canvas */}
              {crpData?.timeSeries && crpData.timeSeries.length > 0 ? (
                (() => {
                  const maxViews = Math.max(...crpData.timeSeries.map((d) => d.pageViews || 0), 5);
                  return (
                    <div className="space-y-4">
                      {/* Hover Tooltip Card */}
                      <div className="h-10 flex items-center justify-between px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        {hoveredDay ? (
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="font-bold text-[#0A1E3F]">
                              📅 {hoveredDay.date} ({hoveredDay.dayName}):
                            </span>
                            <span className="font-semibold text-sky-700">
                              👁️ {hoveredDay.pageViews} Page Views
                            </span>
                            <span className="font-semibold text-[#C59B27]">
                              🎯 {hoveredDay.bookClicks} Booking Clicks
                            </span>
                            <span className="font-semibold text-emerald-700">
                              ✅ {hoveredDay.appointments} Bookings
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            Hover over any bar below to view detailed breakdown for that date
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          Max Daily Views: {maxViews}
                        </span>
                      </div>

                      {/* Bar columns */}
                      <div className="flex items-end gap-1.5 sm:gap-2.5 h-48 sm:h-56 pt-6 pb-2 px-2 overflow-x-auto scrollbar-none border-b border-slate-200">
                        {crpData.timeSeries.map((day) => {
                          const viewHeightPct = Math.max(6, Math.round(((day.pageViews || 0) / maxViews) * 100));
                          const clickHeightPct = Math.max(4, Math.round(((day.bookClicks || 0) / maxViews) * 100));
                          const isHovered = hoveredDay?.date === day.date;

                          return (
                            <div
                              key={day.date}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              className="flex-1 min-w-[28px] sm:min-w-[36px] flex flex-col items-center h-full justify-end group cursor-pointer transition-transform hover:-translate-y-1"
                            >
                              <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                                {/* Page Views Bar */}
                                <div
                                  className={`w-1/2 rounded-t-md transition-all duration-300 ${
                                    isHovered ? 'bg-sky-500 shadow-md' : 'bg-[#0A1E3F]'
                                  }`}
                                  style={{ height: `${viewHeightPct}%` }}
                                  title={`${day.pageViews} Page Views`}
                                />
                                {/* Booking Clicks Bar */}
                                <div
                                  className={`w-1/2 rounded-t-md transition-all duration-300 ${
                                    isHovered ? 'bg-amber-400 shadow-md' : 'bg-[#DFBF64]'
                                  }`}
                                  style={{ height: `${clickHeightPct}%` }}
                                  title={`${day.bookClicks} Booking Clicks`}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium mt-2 whitespace-nowrap group-hover:text-[#0A1E3F] group-hover:font-bold">
                                {day.dayName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  No time-series data recorded yet for this date window.
                </div>
              )}
            </div>

            {/* Two-Column Deep Insights: Top Pages + Acquisition Channels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Top Visited Pages */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#0A1E3F] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C59B27]" />
                      <span>Most Visited Pages</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Popular content and medical specialties explored by patients
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Views & % Share
                  </span>
                </div>

                <div className="space-y-3">
                  {crpData?.topPages && crpData.topPages.length > 0 ? (
                    crpData.topPages.map((p, idx) => (
                      <div
                        key={p.path}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-[#0A1E3F] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-mono font-bold text-[#0A1E3F] truncate">
                              {p.path}
                            </span>
                            <SafeLink
                              href={p.path}
                              target="_blank"
                              className="text-slate-400 hover:text-[#0A1E3F] transition-colors shrink-0"
                              title="Preview Page"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </SafeLink>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-[#0A1E3F]">
                              {p.views.toLocaleString()} views
                            </span>
                            <span className="text-[10px] font-bold text-[#C59B27] bg-[#FDF9EE] px-1.5 py-0.5 rounded border border-[#DFBF64]/40">
                              {p.percentage}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#0A1E3F] to-[#C59B27] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(p.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 italic">
                      Tracking public routes... Visit pages to see live metrics appear here.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Traffic Acquisition Channels */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#0A1E3F] flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#C59B27]" />
                      <span>Traffic Acquisition Channels</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Where your patients originate: Google searches, Direct URL, WhatsApp & Social
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Source Share
                  </span>
                </div>

                <div className="space-y-3">
                  {crpData?.sourceBreakdown && crpData.sourceBreakdown.length > 0 ? (
                    crpData.sourceBreakdown.map((src) => {
                      const getIcon = () => {
                        if (src.source.includes('Google')) return <Globe className="w-4 h-4 text-sky-600" />;
                        if (src.source.includes('WhatsApp')) return <MessageSquare className="w-4 h-4 text-emerald-600" />;
                        if (src.source.includes('Direct')) return <ArrowUpRight className="w-4 h-4 text-indigo-600" />;
                        return <Compass className="w-4 h-4 text-purple-600" />;
                      };

                      return (
                        <div
                          key={src.source}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {getIcon()}
                              <span className="font-bold text-[#0A1E3F]">{src.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700">
                                {src.count.toLocaleString()} visits
                              </span>
                              <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {src.percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-600 to-[#C59B27] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(src.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 italic">
                      Acquisition channel tracking active.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Two-Column: Devices Breakdown + User Action Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Devices & Platforms */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#0A1E3F] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#C59B27]" />
                      <span>Device & Platform Distribution</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Breakdown of patient visits across mobile phones, laptops & tablets
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Mobile First
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {crpData?.deviceBreakdown?.map((dev) => {
                    const getDevIcon = () => {
                      if (dev.device.toLowerCase().includes('mobile')) return <Smartphone className="w-5 h-5 text-emerald-600" />;
                      if (dev.device.toLowerCase().includes('tablet')) return <Tablet className="w-5 h-5 text-purple-600" />;
                      return <Monitor className="w-5 h-5 text-sky-600" />;
                    };

                    return (
                      <div
                        key={dev.device}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center justify-between space-y-2"
                      >
                        <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200">
                          {getDevIcon()}
                        </div>
                        <div>
                          <strong className="block text-xs font-bold text-[#0A1E3F]">
                            {dev.device}
                          </strong>
                          <span className="text-xl font-extrabold text-[#0A1E3F] font-heading mt-0.5 block">
                            {dev.percentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {dev.count.toLocaleString()} sessions
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. User Action Telemetry */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#0A1E3F] flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-[#C59B27]" />
                      <span>User Behavior & Actions</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Concrete interactions: page navigation, booking clicks, calls & chat
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Counts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {crpData?.userActions?.map((act) => (
                    <div
                      key={act.action}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#0A1E3F] truncate">{act.action}</span>
                        <span className="font-extrabold font-mono text-[#0A1E3F] bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200">
                          {act.count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-tight">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Visitor Event Stream (Real-Time Feed) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#0A1E3F]">
                      Live Visitor Activity Stream
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Real-time stream of incoming visitors, page navigations, and patient booking actions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Auto-updating feed
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {crpData?.recentActivity && crpData.recentActivity.length > 0 ? (
                  crpData.recentActivity.map((evt) => {
                    const getBadge = () => {
                      if (evt.type === 'book_intent') {
                        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">Pre-Book Click</span>;
                      }
                      if (evt.type === 'form_start') {
                        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[10px]">Form Started</span>;
                      }
                      if (evt.type === 'appointment_booked') {
                        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">Appointment Booked</span>;
                      }
                      if (evt.type === 'whatsapp_click') {
                        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">WhatsApp Inquiry</span>;
                      }
                      if (evt.type === 'call_click') {
                        return <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[10px]">Helpline Tap</span>;
                      }
                      return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">Page View</span>;
                    };

                    return (
                      <div
                        key={evt.id}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 flex items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          {getBadge()}
                          <span className="font-mono text-slate-700 font-semibold truncate">
                            {evt.path}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                          <span className="capitalize">{evt.device}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-500">{formatTimeAgo(evt.time)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 italic text-center">
                    Awaiting live visitor events... Browse pages on the live website to see activity stream here.
                  </div>
                )}
              </div>
            </div>

            {/* Visual Funnel Representation */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">
                    5-Stage Patient Conversion Funnel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track visitor flow from landing page browsing through to confirmed clinic OPD appointments
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                  ● End-to-End Clinic Pipeline
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
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            — {stage.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700">
                            {stage.count.toLocaleString()} visitors
                          </span>
                          <span className="font-bold text-[#C59B27] bg-[#FDF9EE] px-2 py-0.5 rounded border border-[#DFBF64]/40">
                            {stage.percentage ?? stage.conversionRate}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0A1E3F] to-[#C59B27] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(stage.percentage ?? stage.conversionRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-4">No funnel data available for this range.</p>
                )}
              </div>
            </div>

            {/* Google Analytics 4 (GA4) Control & Zero-Redirect Embedded Report */}
            <div className="bg-gradient-to-br from-[#061226] via-[#0A1E3F] to-[#0E2855] text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[#DFBF64] shadow-inner shrink-0">
                    <Activity className="w-6 h-6 text-[#DFBF64]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFBF64] bg-[#DFBF64]/10 px-2 py-0.5 rounded border border-[#DFBF64]/20">
                        Official Google GA4 Integration
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        Live in Admin Panel
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-extrabold text-white">
                      Google Analytics 4 Live Screen & Looker Studio
                    </h3>
                  </div>
                </div>

                {/* Measurement ID & Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                    <span className="text-slate-400">Measurement ID:</span>
                    <code className="text-[#DFBF64] font-bold font-mono">G-KY995SYKY6</code>
                    <button
                      type="button"
                      onClick={handleCopyGaId}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Measurement ID"
                    >
                      {copiedGaId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTempLookerUrl(lookerStudioUrl);
                      setShowLookerSettings(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <span>Configure Embed Screen</span>
                  </button>

                  <a
                    href="https://analytics.google.com/analytics/web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#DFBF64] hover:bg-[#C59B27] text-[#0A1E3F] text-xs font-bold shadow-md transition-all cursor-pointer"
                    title="Open external Google Analytics if desired"
                  >
                    <span>Google Console</span>
                    <ExternalLink className="w-3 h-3 text-[#0A1E3F]" />
                  </a>
                </div>
              </div>

              {/* Embedded Interactive Report or Setup Helper */}
              {lookerStudioUrl ? (
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      Embedded Google Looker Studio Dashboard (Live GA4)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLookerSettings(true)}
                      className="text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Change Embed URL
                    </button>
                  </div>
                  <div className="w-full aspect-[16/9] min-h-[500px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <iframe
                      src={lookerStudioUrl}
                      title="Google Analytics Interactive Dashboard"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <strong className="text-white text-sm block font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#DFBF64]" />
                      Want Google-hosted visual charts embedded directly on this screen?
                    </strong>
                    <span className="text-slate-300 text-xs leading-relaxed block">
                      Connect Google Looker Studio (free) to your property <strong>G-KY995SYKY6</strong> and paste the embed link. Google charts will render right here inside this admin frame without leaving!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTempLookerUrl(lookerStudioUrl);
                      setShowLookerSettings(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#DFBF64] hover:bg-[#C59B27] text-[#0A1E3F] font-bold whitespace-nowrap transition cursor-pointer shadow-md"
                  >
                    Connect Looker Studio Embed
                  </button>
                </div>
              )}

              {/* Looker Studio Embed Settings Modal */}
              {showLookerSettings && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                  <h4 className="font-bold text-sm text-white">Google Looker Studio Embed Screen Setup</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Open <SafeLink href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer" className="text-[#DFBF64] underline">lookerstudio.google.com</SafeLink>.<br />
                    2. Create a report connected to Google Analytics 4 property <strong>G-KY995SYKY6</strong>.<br />
                    3. Click <strong>File → Embed report → Enable embedding</strong>, copy the Embed URL, and paste it below:
                  </p>
                  <input
                    type="url"
                    value={tempLookerUrl}
                    onChange={(e) => setTempLookerUrl(e.target.value)}
                    placeholder="https://lookerstudio.google.com/embed/reporting/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-[#DFBF64] focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLookerSettings(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLookerUrl}
                      className="px-4 py-1.5 rounded-lg bg-[#DFBF64] text-[#0A1E3F] font-bold text-xs hover:bg-[#C59B27] cursor-pointer"
                    >
                      Save & Embed
                    </button>
                  </div>
                </div>
              )}
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

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (roles.length > 0) setTargetRoleIdForUser(roles[0].id);
                    setAddUserGeneratedOtp(`Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`);
                    setShowAddUserModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-[#0A1E3F] bg-white text-[#0A1E3F] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#C59B27]" />
                  <span>Add Staff Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPermissionDropdownOpen(true);
                    setShowRoleModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#DFBF64]" />
                  <span>Create New Position</span>
                </button>
              </div>
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
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#DFBF64] transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {role.id?.startsWith('role-admin')
                          ? 'Root System Role'
                          : 'Custom Position'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {role.slug}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">{role.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{role.description || 'Clinical staff access position'}</p>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Assigned Permissions ({role.permissions?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
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

                  {/* Assigned Staff Members */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Assigned Staff ({role.users?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetRoleIdForUser(role.id);
                          setAddUserGeneratedOtp(`Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`);
                          setShowAddUserModal(true);
                        }}
                        className="text-[11px] font-bold text-[#C59B27] hover:text-[#9B771A] flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Add Staff</span>
                      </button>
                    </div>

                    {role.users && role.users.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-0.5">
                        {role.users.map((u) => (
                          <div
                            key={u.id || u.email}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                          >
                            <div className="truncate pr-2">
                              <strong className="block text-[#0A1E3F] text-[11px] truncate">
                                {u.name}
                              </strong>
                              <span className="text-slate-500 font-mono text-[10px] truncate block">
                                {u.email}
                              </span>
                            </div>
                            {u.mustChangePassword ? (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                                OTP Active
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10.5px] text-slate-400 italic">
                        No staff assigned yet. Click &quot;+ Add Staff&quot; to assign a user.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: New Role */}
            {showRoleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Create Clinical Position
                      </h3>
                      <p className="text-xs text-slate-500">
                        Define role name, select authorized clinical permissions, and optionally provision a staff user
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

                  <form onSubmit={handleCreateRole} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Position Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ophthalmic OT Coordinator or Retina Clinic Manager"
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
                        placeholder="e.g. Manages vitrectomy day-care scheduling, equipment readiness, and OT doctor notes..."
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    {/* Permissions Dropdown Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Assign Granular Permissions *
                        </label>
                        <span className="text-[11px] font-semibold text-[#0A1E3F] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {selectedPermissions.length} of {catalog.length} selected
                        </span>
                      </div>

                      {/* Dropdown Toggle Header */}
                      <button
                        type="button"
                        onClick={() => setIsPermissionDropdownOpen(!isPermissionDropdownOpen)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:border-[#DFBF64] focus:ring-2 focus:ring-[#C59B27] focus:outline-none flex items-center justify-between text-left transition-all cursor-pointer shadow-xs"
                      >
                        <div className="flex-1 truncate pr-2">
                          {selectedPermissions.length === 0 ? (
                            <span className="text-xs text-slate-400">
                              Click to choose clinical permissions from catalog...
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-h-14 overflow-hidden">
                              {selectedPermissions.slice(0, 4).map((permKey) => (
                                <span
                                  key={permKey}
                                  className="px-2 py-0.5 rounded text-[10.5px] bg-slate-100 text-[#0A1E3F] font-mono font-medium border border-slate-200"
                                >
                                  {permKey}
                                </span>
                              ))}
                              {selectedPermissions.length > 4 && (
                                <span className="px-2 py-0.5 rounded text-[10.5px] bg-[#DFBF64]/20 text-[#0A1E3F] font-bold">
                                  +{selectedPermissions.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                          <span className="text-[11px] font-bold text-slate-600">
                            {isPermissionDropdownOpen ? 'Hide Catalog' : 'Browse Permissions'}
                          </span>
                          {isPermissionDropdownOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#0A1E3F]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#0A1E3F]" />
                          )}
                        </div>
                      </button>

                      {/* Dropdown Menu Body */}
                      {isPermissionDropdownOpen && (
                        <div className="mt-2.5 p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner space-y-3 animate-in fade-in duration-150">
                          {/* Search bar & quick toggles */}
                          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pb-2 border-b border-slate-200">
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Search by permission key, name or module..."
                                value={permissionSearch}
                                onChange={(e) => setPermissionSearch(e.target.value)}
                                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                              />
                              {permissionSearch && (
                                <button
                                  type="button"
                                  onClick={() => setPermissionSearch('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 text-xs">
                              <button
                                type="button"
                                onClick={selectAllPermissions}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#DFBF64] text-slate-700 font-bold hover:text-[#0A1E3F] transition-all cursor-pointer shadow-2xs"
                              >
                                Select All ({catalog.length})
                              </button>
                              <button
                                type="button"
                                onClick={clearAllPermissions}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-red-300 text-slate-500 font-medium hover:text-red-600 transition-all cursor-pointer shadow-2xs"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>

                          {/* Categorized Permissions Accordions */}
                          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                            {permissionGroups.map((group) => {
                              const filtered = group.permissions.filter(
                                (p) =>
                                  p.key.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                                  p.label.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                                  p.description.toLowerCase().includes(permissionSearch.toLowerCase())
                              );
                              if (filtered.length === 0) return null;

                              const allCategoryKeys = group.permissions.map((p) => p.key);
                              const isAllSelected = allCategoryKeys.every((k) =>
                                selectedPermissions.includes(k)
                              );

                              return (
                                <div
                                  key={group.category}
                                  className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs space-y-2"
                                >
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <span className="font-heading text-xs font-bold text-[#0A1E3F]">
                                        {group.category}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-semibold">
                                        ({filtered.length})
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleCategoryPermissions(group.permissions)}
                                      className="text-[10.5px] font-bold text-[#C59B27] hover:text-[#9B771A] hover:underline cursor-pointer"
                                    >
                                      {isAllSelected ? 'Deselect Category' : 'Select Category'}
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                                    {filtered.map((perm) => {
                                      const isChecked = selectedPermissions.includes(perm.key);
                                      return (
                                        <label
                                          key={perm.key}
                                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                                            isChecked
                                              ? 'bg-amber-50/50 border-[#DFBF64]/60 text-[#0A1E3F]'
                                              : 'bg-slate-50/50 hover:bg-slate-100/60 border-slate-200/60 text-slate-700'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => togglePermission(perm.key)}
                                            className="mt-0.5 rounded text-[#0A1E3F] focus:ring-[#C59B27] cursor-pointer"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="text-xs font-bold text-[#0A1E3F]">
                                                {perm.label}
                                              </span>
                                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono bg-slate-200/80 text-slate-700">
                                                {perm.key}
                                              </span>
                                            </div>
                                            <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">
                                              {perm.description}
                                            </p>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}

                            {permissionGroups.every((g) =>
                              g.permissions.every(
                                (p) =>
                                  !p.key.toLowerCase().includes(permissionSearch.toLowerCase()) &&
                                  !p.label.toLowerCase().includes(permissionSearch.toLowerCase()) &&
                                  !p.description.toLowerCase().includes(permissionSearch.toLowerCase())
                              )
                            ) && (
                              <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                                No clinical permissions match &quot;{permissionSearch}&quot;
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setIsPermissionDropdownOpen(false)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#0A1E3F] text-white text-[11px] font-bold hover:bg-[#16325C] transition-all cursor-pointer shadow-xs"
                            >
                              Done Selecting ({selectedPermissions.length} chosen)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section: Assign Staff User to this Position */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={assignUserNow}
                            onChange={(e) => setAssignUserNow(e.target.checked)}
                            className="w-4 h-4 rounded text-[#0A1E3F] focus:ring-[#C59B27] cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#0A1E3F] flex items-center gap-1.5">
                              <UserPlus className="w-3.5 h-3.5 text-[#C59B27]" />
                              Add Staff User for this Position Now
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              Create an account and assign login credentials for this role
                            </span>
                          </div>
                        </label>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DFBF64]/20 text-[#0A1E3F] border border-[#C59B27]/30">
                          Recommended
                        </span>
                      </div>

                      {assignUserNow && (
                        <div className="space-y-3.5 pt-3 border-t border-slate-200/80 animate-in fade-in duration-150">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Staff Full Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Dr. Rajesh Sharma or Nurse Anita"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Staff Email ID (Login ID) *
                              </label>
                              <input
                                type="email"
                                required={assignUserNow}
                                placeholder="e.g. staff.ot@nirvaya.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Contact Mobile (Optional)
                            </label>
                            <input
                              type="tel"
                              placeholder="e.g. 9826012345"
                              value={newUserPhone}
                              onChange={(e) => setNewUserPhone(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                            />
                          </div>

                          {/* Password Setup Mode */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                              Password Provisioning Mode
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setUserPasswordMode('otp')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  userPasswordMode === 'otp'
                                    ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold">System Generated OTP</span>
                                  {userPasswordMode === 'otp' && (
                                    <Check className="w-3.5 h-3.5 text-[#DFBF64]" />
                                  )}
                                </div>
                                <p
                                  className={`text-[10px] leading-tight ${
                                    userPasswordMode === 'otp' ? 'text-slate-200' : 'text-slate-500'
                                  }`}
                                >
                                  System creates one-time temporary OTP; user will change it on 1st login.
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => setUserPasswordMode('manual')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  userPasswordMode === 'manual'
                                    ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold">Manual Initial Password</span>
                                  {userPasswordMode === 'manual' && (
                                    <Check className="w-3.5 h-3.5 text-[#DFBF64]" />
                                  )}
                                </div>
                                <p
                                  className={`text-[10px] leading-tight ${
                                    userPasswordMode === 'manual' ? 'text-slate-200' : 'text-slate-500'
                                  }`}
                                >
                                  Specify custom temporary password; user will still change it on 1st login.
                                </p>
                              </button>
                            </div>
                          </div>

                          {/* OTP Display Card */}
                          {userPasswordMode === 'otp' && (
                            <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <Key className="w-3.5 h-3.5 text-[#C59B27]" />
                                  Generated One-Time Password (OTP):
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`;
                                    setGeneratedOtp(next);
                                  }}
                                  className="text-[10.5px] font-bold text-[#C59B27] hover:text-[#9B771A] flex items-center gap-1 cursor-pointer"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Regenerate
                                </button>
                              </div>
                              <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                <span className="font-mono text-sm font-bold text-[#0A1E3F] tracking-wider">
                                  {generatedOtp}
                                </span>
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                                  One-Time Password
                                </span>
                              </div>
                              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                                On their first login with this OTP at the staff portal, the user will be presented with a forced password change screen to set their permanent confidential password before accessing the clinical dashboard.
                              </p>
                            </div>
                          )}

                          {/* Manual Password Input */}
                          {userPasswordMode === 'manual' && (
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Enter Initial Temporary Password *
                              </label>
                              <input
                                type="text"
                                required={assignUserNow && userPasswordMode === 'manual'}
                                minLength={6}
                                placeholder="At least 6 characters (e.g. Clinic@2026)"
                                value={customPassword}
                                onChange={(e) => setCustomPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                              />
                              <p className="text-[10px] text-slate-500 mt-1">
                                Staff user will still be required to change this password on their first login.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
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
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#DFBF64]" />
                        <span>Create Position {assignUserNow ? '& Assign User' : ''}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Add Staff User to an Existing Role */}
            {showAddUserModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                        Add Staff Member to Position
                      </h3>
                      <p className="text-xs text-slate-500">
                        Assign a user account with login credentials to an existing clinical role
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddStaffUserSubmit} className="space-y-4">
                    {/* Target Position Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clinical Position / Role *
                      </label>
                      <select
                        value={targetRoleIdForUser}
                        onChange={(e) => setTargetRoleIdForUser(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none bg-white font-medium text-slate-800"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Staff Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Staff Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aman Sharma or Nurse Anita"
                        value={addUserName}
                        onChange={(e) => setAddUserName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    {/* Login Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Staff Email ID (Login ID) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aman@nirvayaeyecare.com"
                        value={addUserEmail}
                        onChange={(e) => setAddUserEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Mobile (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9826012345"
                        value={addUserPhone}
                        onChange={(e) => setAddUserPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                      />
                    </div>

                    {/* Password Setup Mode */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Initial Password Provisioning
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAddUserPasswordMode('otp')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            addUserPasswordMode === 'otp'
                              ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">System Generated OTP</span>
                            {addUserPasswordMode === 'otp' && (
                              <Check className="w-3.5 h-3.5 text-[#DFBF64]" />
                            )}
                          </div>
                          <p
                            className={`text-[10px] leading-tight ${
                              addUserPasswordMode === 'otp' ? 'text-slate-200' : 'text-slate-500'
                            }`}
                          >
                            Temporary OTP; user is forced to create permanent password on 1st login.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAddUserPasswordMode('manual')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            addUserPasswordMode === 'manual'
                              ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">Manual Temporary Password</span>
                            {addUserPasswordMode === 'manual' && (
                              <Check className="w-3.5 h-3.5 text-[#DFBF64]" />
                            )}
                          </div>
                          <p
                            className={`text-[10px] leading-tight ${
                              addUserPasswordMode === 'manual' ? 'text-slate-200' : 'text-slate-500'
                            }`}
                          >
                            Specify custom password; user still changes it on first login.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* OTP Display Card */}
                    {addUserPasswordMode === 'otp' && (
                      <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-[#C59B27]" />
                            One-Time Temporary Password (OTP):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`;
                              setAddUserGeneratedOtp(next);
                            }}
                            className="text-[10.5px] font-bold text-[#C59B27] hover:text-[#9B771A] flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Regenerate
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <span className="font-mono text-sm font-bold text-[#0A1E3F] tracking-wider">
                            {addUserGeneratedOtp}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                            One-Time Password
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-relaxed">
                          When this staff member logs in at the portal with this OTP, they will immediately be presented with a screen to configure their private permanent password before accessing the clinical dashboard.
                        </p>
                      </div>
                    )}

                    {/* Manual Password Input */}
                    {addUserPasswordMode === 'manual' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Enter Temporary Password *
                        </label>
                        <input
                          type="text"
                          required={addUserPasswordMode === 'manual'}
                          minLength={6}
                          placeholder="At least 6 characters"
                          value={addUserCustomPassword}
                          onChange={(e) => setAddUserCustomPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#C59B27] focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addUserSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4 text-[#DFBF64]" />
                        <span>{addUserSubmitting ? 'Creating Staff Account...' : 'Add Staff Member'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Created Staff User Credentials Card */}
            {createdUserCredentials && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
                  <div className="text-center mb-5">
                    <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2.5 shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                      Position &amp; Staff Account Created!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      The clinical position and user login credentials have been provisioned in the system.
                    </p>
                  </div>

                  {/* Credentials Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Position / Role:</span>
                      <span className="font-bold text-[#0A1E3F]">
                        {createdUserCredentials.role || createdUserCredentials.roleName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Staff Member:</span>
                      <span className="font-bold text-[#0A1E3F]">
                        {createdUserCredentials.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Login ID (Email):</span>
                      <span className="font-mono font-bold text-[#0A1E3F]">
                        {createdUserCredentials.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 bg-amber-50/70 px-2.5 rounded-xl border border-amber-200/70">
                      <span className="text-amber-900 font-medium">One-Time Password:</span>
                      <span className="font-mono font-bold text-amber-950 text-sm tracking-wide">
                        {createdUserCredentials.tempPassword}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-700 font-medium">
                      <Shield className="w-3.5 h-3.5 shrink-0 text-[#C59B27]" />
                      <span>Forced Password Change: Active on 1st login</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Share this Login ID and temporary OTP with the staff member. When they sign in at <strong className="font-mono">/admin</strong>, they will immediately be prompted with a secure window to create their permanent password before accessing the dashboard.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '/admin';
                        const text = `Nirvaya Eyecare Centre — Staff Portal Access\nPosition: ${createdUserCredentials.role || createdUserCredentials.roleName}\nStaff Name: ${createdUserCredentials.name}\nLogin ID: ${createdUserCredentials.email}\nTemporary OTP: ${createdUserCredentials.tempPassword}\nPortal Link: ${portalUrl}\n\nNote: You will be asked to set your confidential permanent password upon first login.`;
                        if (navigator?.clipboard) {
                          navigator.clipboard.writeText(text);
                          setCopiedOtp(true);
                          setTimeout(() => setCopiedOtp(false), 3000);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedOtp ? (
                        <>
                          <Check className="w-4 h-4 text-[#DFBF64]" />
                          <span>Credentials Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#DFBF64]" />
                          <span>Copy Login Credentials</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreatedUserCredentials(null);
                        setCopiedOtp(false);
                      }}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Done / Close
                    </button>
                  </div>
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
                              <SafeLink
                                href={`/blog/${b.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="View on Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </SafeLink>
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
                              <SafeLink
                                href="/research"
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="View Publication on Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </SafeLink>
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
