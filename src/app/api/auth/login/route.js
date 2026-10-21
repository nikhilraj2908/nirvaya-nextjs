import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Role } from '@/models';
import { comparePassword, generateToken } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seed';

export async function POST(req) {
  try {
    await connectDB();
    await ensureDatabaseSeeded();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Contact administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const role = await Role.findOne({ id: user.roleId });
    const token = generateToken(user, role);

    user.lastLoginAt = new Date().toISOString();
    await user.save();

    const userObj = user.toJSON();
    delete userObj.passwordHash;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userObj,
      role: role ? role.toJSON() : null
    });
  } catch (err) {
    console.error('[auth/login] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: err.message },
      { status: 500 }
    );
  }
}
