import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Role } from '@/models';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ id: authUser.userId });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const role = await Role.findOne({ id: user.roleId });
    const userObj = user.toJSON();
    delete userObj.passwordHash;

    return NextResponse.json({
      success: true,
      user: userObj,
      role: role ? role.toJSON() : null
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
