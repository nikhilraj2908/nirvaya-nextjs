export const PERMISSIONS = {
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  APPOINTMENTS_VIEW: 'appointments:view',
  APPOINTMENTS_CREATE: 'appointments:create',
  APPOINTMENTS_UPDATE: 'appointments:update',
  APPOINTMENTS_DELETE: 'appointments:delete',
  PATIENTS_VIEW: 'patients:view',
  PATIENTS_NOTES: 'patients:notes',
  DOCTORS_MANAGE: 'doctors:manage',
  SLOTS_MANAGE: 'slots:manage',
  CONTENT_VIEW: 'content:view',
  CONTENT_MANAGE: 'content:manage',
  STAFF_VIEW: 'staff:view',
  STAFF_MANAGE: 'staff:manage',
  ROLES_VIEW: 'roles:view',
  ROLES_MANAGE: 'roles:manage',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage'
};

export const PERMISSION_DEFINITIONS = [
  {
    category: 'CRP & Visitor Analytics',
    permissions: [
      {
        key: PERMISSIONS.ANALYTICS_VIEW,
        label: 'View CRP & Traffic Analytics',
        description: 'Access visitor counts, appointment conversion funnels, and marketing metrics'
      },
      {
        key: PERMISSIONS.ANALYTICS_EXPORT,
        label: 'Export Analytics Reports',
        description: 'Download CSV and PDF reports of traffic and conversion rates'
      }
    ]
  },
  {
    category: 'Appointment & Slot Management',
    permissions: [
      {
        key: PERMISSIONS.APPOINTMENTS_VIEW,
        label: 'View Appointments',
        description: 'See incoming patient bookings, dates, and doctor schedules'
      },
      {
        key: PERMISSIONS.APPOINTMENTS_CREATE,
        label: 'Create / Book Appointments',
        description: 'Book walk-in and phone appointments on behalf of patients'
      },
      {
        key: PERMISSIONS.APPOINTMENTS_UPDATE,
        label: 'Update Appointment Status',
        description: 'Mark appointments as Confirmed, In Consultation, Completed, or Cancelled'
      },
      {
        key: PERMISSIONS.APPOINTMENTS_DELETE,
        label: 'Delete Appointments',
        description: 'Archive or permanently delete appointment entries'
      },
      {
        key: PERMISSIONS.SLOTS_MANAGE,
        label: 'Manage Booking Slots & Capacity',
        description: 'Configure available time slots, daily caps, and block holiday dates'
      }
    ]
  },
  {
    category: 'Doctors & Specialists',
    permissions: [
      {
        key: PERMISSIONS.DOCTORS_MANAGE,
        label: 'Manage Doctors Directory',
        description: 'Add and edit doctor profiles, qualifications, bios, OPD timings, and photos'
      }
    ]
  },
  {
    category: 'Clinical Content & Publications',
    permissions: [
      {
        key: PERMISSIONS.CONTENT_VIEW,
        label: 'View Content & Publications',
        description: 'View drafts, published blogs, and clinical research papers'
      },
      {
        key: PERMISSIONS.CONTENT_MANAGE,
        label: 'Manage Blogs & Research Papers',
        description: 'Publish, edit, and organize SEO-friendly blogs and research papers'
      }
    ]
  },
  {
    category: 'Patient Records & CRM',
    permissions: [
      {
        key: PERMISSIONS.PATIENTS_VIEW,
        label: 'View Patient Directory',
        description: 'Access patient contact details, visit history, and registered complaints'
      },
      {
        key: PERMISSIONS.PATIENTS_NOTES,
        label: 'Add & Edit Clinical / Frontdesk Notes',
        description: 'Attach clinical observations or reception notes to patient files'
      }
    ]
  },
  {
    category: 'Staff Management',
    permissions: [
      {
        key: PERMISSIONS.STAFF_VIEW,
        label: 'View Staff List',
        description: 'View active hospital staff profiles, assigned roles, and contact numbers'
      },
      {
        key: PERMISSIONS.STAFF_MANAGE,
        label: 'Manage Staff Members',
        description: 'Add new staff members, edit details, and activate or deactivate accounts'
      }
    ]
  },
  {
    category: 'Position & Access Management',
    permissions: [
      {
        key: PERMISSIONS.ROLES_VIEW,
        label: 'View Custom Roles & Positions',
        description: 'See available roles (Manager, Nurse, etc.) and their granted permissions'
      },
      {
        key: PERMISSIONS.ROLES_MANAGE,
        label: 'Create & Edit Positions',
        description: 'Create new positions (e.g. Manager, Nurse) and grant tailored permission sets'
      }
    ]
  },
  {
    category: 'System & Clinic Settings',
    permissions: [
      {
        key: PERMISSIONS.SETTINGS_VIEW,
        label: 'View Clinic Settings',
        description: 'Inspect clinic operating hours, doctor slots, and SMS/Email templates'
      },
      {
        key: PERMISSIONS.SETTINGS_MANAGE,
        label: 'Manage Clinic Settings',
        description: 'Modify working hours, contact info, and system configuration'
      }
    ]
  }
];

export function hasPermission(userPermissions = [], requiredPermission) {
  if (!Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}
