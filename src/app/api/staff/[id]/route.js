import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';
import { hashPassword } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const user = await User.findOne({ id });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Staff member not found' }, { status: 404 });
    }

    if (body.name) user.name = body.name.trim();
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.roleId) user.roleId = body.roleId;
    if (body.isActive !== undefined) user.isActive = body.isActive;
    if (body.password) {
      user.passwordHash = await hashPassword(body.password);
    }

    await user.save();

    const uObj = user.toJSON();
    delete uObj.passwordHash;

    return NextResponse.json({
      success: true,
      message: 'Staff account updated successfully',
      user: uObj
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const deleted = await User.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Staff account deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
