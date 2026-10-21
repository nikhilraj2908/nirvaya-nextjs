import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { User, Role } from '@/models';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    const roles = await Role.find({});
    const roleMap = new Map(roles.map((r) => [r.id, r]));

    const staffList = users.map((u) => {
      const uObj = u.toJSON();
      delete uObj.passwordHash;
      const role = roleMap.get(u.roleId);
      return {
        ...uObj,
        role: role ? { id: role.id, name: role.name, slug: role.slug } : null
      };
    });

    return NextResponse.json({ success: true, count: staffList.length, staff: staffList });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone = '', password = 'Nirvaya@123', roleId } = body;

    if (!name || !email || !roleId) {
      return NextResponse.json({ success: false, message: 'Name, email, and position are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const newUser = await User.create({
      id: `usr-${crypto.randomUUID().substring(0, 8)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      passwordHash,
      roleId,
      isActive: true,
      lastLoginAt: null
    });

    const uObj = newUser.toJSON();
    delete uObj.passwordHash;

    return NextResponse.json({
      success: true,
      message: 'Staff account created successfully',
      user: uObj
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
