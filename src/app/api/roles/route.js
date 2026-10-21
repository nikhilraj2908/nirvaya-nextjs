import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Role } from '@/models';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    await ensureDatabaseSeeded();
    const roles = await Role.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, count: roles.length, roles });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, permissions = [], description = '' } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Position name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await Role.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Role with this name already exists' }, { status: 400 });
    }

    const newRole = await Role.create({
      id: `role-${crypto.randomUUID().substring(0, 8)}`,
      name,
      slug,
      description,
      isSystemRole: false,
      permissions
    });

    return NextResponse.json({
      success: true,
      message: `Position "${name}" created successfully`,
      role: newRole
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
