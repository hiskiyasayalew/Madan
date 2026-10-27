// app/api/admin/member-email/route.ts
import { NextResponse } from "next/server";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/app/lib/emailService";

export async function POST(req: Request) {
  try {
    const { type, user } = await req.json();

    console.log('📧 API Route called with type:', type);
    console.log('📧 User email:', user?.email);

    if (!user || !user.email) {
      console.error('❌ Missing user data:', user);
      return NextResponse.json(
        { success: false, error: 'Missing user data' },
        { status: 400 }
      );
    }

    if (type === "approved") {
      console.log('📧 Sending approval email...');
      await sendApprovalEmail(user);
      console.log('✅ Approval email sent');
    }

    if (type === "rejected") {
      console.log('📧 Sending rejection email...');
      await sendRejectionEmail(user);
      console.log('✅ Rejection email sent');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API Route Error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}