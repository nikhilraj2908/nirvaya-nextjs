import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BlockedDate } from '@/models';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const deleted = await BlockedDate.findOneAndDelete({
      $or: [{ id }, { date: id }]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Blocked date record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Date unblocked successfully'
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
