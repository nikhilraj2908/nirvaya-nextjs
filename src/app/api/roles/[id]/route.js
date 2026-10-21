import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Role } from '@/models';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const role = await Role.findOne({ id });
    if (!role) {
      return NextResponse.json({ success: false, message: 'Role not found' }, { status: 404 });
    }

    if (body.name) {
      role.name = body.name;
    }
    if (body.description !== undefined) {
      role.description = body.description;
    }
    if (Array.isArray(body.permissions)) {
      role.permissions = body.permissions;
    }

    await role.save();

    return NextResponse.json({
      success: true,
      message: 'Position updated successfully',
      role
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const role = await Role.findOne({ id });
    if (!role) {
      return NextResponse.json({ success: false, message: 'Role not found' }, { status: 404 });
    }
    if (role.isSystemRole) {
      return NextResponse.json({ success: false, message: 'System positions cannot be deleted' }, { status: 403 });
    }

    await Role.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Position deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
