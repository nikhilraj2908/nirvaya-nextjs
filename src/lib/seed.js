import connectDB from './db';
import {
  Role,
  User,
  Doctor,
  SlotConfig,
  Blog,
  ResearchPaper
} from '../models';
import { hashPassword } from './auth';

import defaultRoles from '../data/roles.json';
import defaultDoctors from '../data/doctors.json';
import defaultBlogs from '../data/blogs.json';
import defaultPapers from '../data/research_papers.json';
import defaultSlotConfig from '../data/slot_config.json';

export async function ensureDatabaseSeeded() {
  try {
    await connectDB();

    // 1. Roles
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      console.log('[Seed] Seeding default roles...');
      await Role.insertMany(defaultRoles);
      console.log(`[Seed] ${defaultRoles.length} roles initialized.`);
    }

    // 2. Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding default staff accounts...');
      const adminRole = await Role.findOne({ slug: 'admin' });
      const managerRole = await Role.findOne({ slug: 'manager' });
      const nurseRole = await Role.findOne({ slug: 'nurse' });
      const receptionRole = await Role.findOne({ slug: 'receptionist' });
      const doctorRole = await Role.findOne({ slug: 'doctor' });

      const adminHash = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123');
      const defaultPasswordHash = await hashPassword('Nirvaya@123');

      const staffUsers = [
        {
          id: 'usr-admin-01',
          name: process.env.ADMIN_NAME || 'Super Administrator',
          email: (process.env.ADMIN_EMAIL || 'admin@nirvaya.com').toLowerCase(),
          phone: '9826012345',
          passwordHash: adminHash,
          roleId: adminRole ? adminRole.id : 'role-admin',
          isActive: true,
          lastLoginAt: new Date().toISOString()
        },
        {
          id: 'usr-manager-01',
          name: 'Ramesh Sharma',
          email: 'manager@nirvaya.com',
          phone: '9826023456',
          passwordHash: defaultPasswordHash,
          roleId: managerRole ? managerRole.id : 'role-manager',
          isActive: true,
          lastLoginAt: null
        },
        {
          id: 'usr-nurse-01',
          name: 'Sunita Verma',
          email: 'nurse@nirvaya.com',
          phone: '9826034567',
          passwordHash: defaultPasswordHash,
          roleId: nurseRole ? nurseRole.id : 'role-nurse',
          isActive: true,
          lastLoginAt: null
        },
        {
          id: 'usr-reception-01',
          name: 'Pooja Tiwari',
          email: 'reception@nirvaya.com',
          phone: '9826045678',
          passwordHash: defaultPasswordHash,
          roleId: receptionRole ? receptionRole.id : 'role-receptionist',
          isActive: true,
          lastLoginAt: null
        },
        {
          id: 'usr-doctor-01',
          name: 'Dr Sandhya Gaur',
          email: 'doctor.sandhya@nirvaya.com',
          phone: '9826056789',
          passwordHash: defaultPasswordHash,
          roleId: doctorRole ? doctorRole.id : 'role-doctor',
          isActive: true,
          lastLoginAt: null
        }
      ];

      await User.insertMany(staffUsers);
      console.log(`[Seed] ${staffUsers.length} staff user accounts created.`);
    }

    // 3. Doctors
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log('[Seed] Seeding doctors directory...');
      await Doctor.insertMany(defaultDoctors);
      console.log(`[Seed] ${defaultDoctors.length} doctors seeded.`);
    }

    // 4. Slot Configuration
    const slotCount = await SlotConfig.countDocuments();
    if (slotCount === 0) {
      console.log('[Seed] Seeding slot configuration...');
      await SlotConfig.create(defaultSlotConfig);
      console.log('[Seed] Slot configuration seeded.');
    }

    // 5. Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('[Seed] Seeding clinical blogs...');
      await Blog.insertMany(defaultBlogs);
      console.log(`[Seed] ${defaultBlogs.length} clinical blogs seeded.`);
    }

    // 6. Research Papers
    const paperCount = await ResearchPaper.countDocuments();
    if (paperCount === 0) {
      console.log('[Seed] Seeding research papers...');
      await ResearchPaper.insertMany(defaultPapers);
      console.log(`[Seed] ${defaultPapers.length} research papers seeded.`);
    }

    return { success: true, message: 'Database verified / seeded' };
  } catch (err) {
    console.warn('[Seed] Note: Seed check failed (or Atlas connecting in fallback):', err.message);
    return { success: false, error: err.message };
  }
}
