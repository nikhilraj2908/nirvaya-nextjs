import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Role, User } from '@/models';
import { hashPassword } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    await ensureDatabaseSeeded();
    const [roles, users] = await Promise.all([
      Role.find({}).sort({ createdAt: 1 }),
      User.find({ isActive: true })
    ]);

    const usersByRoleId = {};
    for (const u of users) {
      if (!usersByRoleId[u.roleId]) usersByRoleId[u.roleId] = [];
      usersByRoleId[u.roleId].push({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        mustChangePassword: Boolean(u.mustChangePassword)
      });
    }

    const rolesWithUsers = roles.map((role) => {
      const rObj = role.toJSON();
      return {
        ...rObj,
        users: usersByRoleId[role.id] || []
      };
    });

    return NextResponse.json({ success: true, count: rolesWithUsers.length, roles: rolesWithUsers });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, permissions = [], description = '', assignUser = null } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Position name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await Role.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Role with this name already exists' }, { status: 400 });
    }

    if (assignUser && assignUser.email) {
      const userEmail = assignUser.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: userEmail });
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: `User with email "${userEmail}" already exists. Please use a unique email for the staff assignment.`
        }, { status: 400 });
      }
    }

    // 1. Create the Role
    const newRole = await Role.create({
      id: `role-${crypto.randomUUID().substring(0, 8)}`,
      name,
      slug,
      description,
      isSystemRole: false,
      permissions
    });

    // 2. Optionally Create and Assign User to this Role
    let createdUser = null;
    let generatedOtp = null;

    if (assignUser && assignUser.email) {
      const userEmail = assignUser.email.toLowerCase().trim();

      // Generate secure one-time password if OTP mode or no manual password
      if (assignUser.passwordMode === 'manual' && assignUser.password) {
        generatedOtp = assignUser.password.trim();
      } else {
        generatedOtp = `Nirvaya@${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const passwordHash = await hashPassword(generatedOtp);
      const newUserDoc = await User.create({
        id: `usr-${crypto.randomUUID().substring(0, 8)}`,
        name: (assignUser.name || name).trim(),
        email: userEmail,
        phone: assignUser.phone || '',
        passwordHash,
        roleId: newRole.id,
        isActive: true,
        mustChangePassword: true,
        tempPassword: generatedOtp,
        lastLoginAt: null
      });

      createdUser = {
        id: newUserDoc.id,
        name: newUserDoc.name,
        email: newUserDoc.email,
        roleId: newRole.id,
        role: newRole.name,
        roleName: newRole.name,
        tempPassword: generatedOtp,
        mustChangePassword: true
      };
    }

    return NextResponse.json({
      success: true,
      message: createdUser
        ? `Position "${name}" and staff user "${createdUser.email}" created successfully.`
        : `Position "${name}" created successfully.`,
      role: newRole,
      user: createdUser
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

