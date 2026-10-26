import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Role } from '@/models';
import { hashPassword, comparePassword, getAuthUser, generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, newPassword, currentPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Try identifying user via token first, or via email
    let user;
    const authUser = getAuthUser(req);
    if (authUser?.userId) {
      user = await User.findOne({ id: authUser.userId });
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please log in again.' },
        { status: 404 }
      );
    }

    // If currentPassword is provided and user does not have mustChangePassword active, verify current password
    if (currentPassword && !user.mustChangePassword) {
      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Current password does not match' },
          { status: 400 }
        );
      }
    }

    // Hash and store the new permanent password
    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    user.mustChangePassword = false;
    user.tempPassword = null;
    await user.save();

    const role = await Role.findOne({ id: user.roleId });
    const token = generateToken(user, role);

    const userObj = user.toJSON();
    delete userObj.passwordHash;

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! Welcome to the portal.',
      token,
      user: {
        ...userObj,
        mustChangePassword: false
      },
      role: role ? role.toJSON() : null
    });
  } catch (err) {
    console.error('[auth/change-password] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update password', error: err.message },
      { status: 500 }
    );
  }
}
