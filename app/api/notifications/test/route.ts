import { NextResponse } from "next/server";
import { toArabicDigits } from "@/lib/utils/formatters";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const reminderDays = body.reminderDays || 7;

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب لإرسال التنبيه التجريبي." },
        { status: 400 }
      );
    }

    const daysText =
      reminderDays === 0
        ? "بدون مهلة مسبقة"
        : reminderDays === 1
        ? "يوم واحد"
        : reminderDays === 2
        ? "يومان"
        : reminderDays <= 10
        ? `${toArabicDigits(reminderDays)} أيام`
        : `${toArabicDigits(reminderDays)} يوماً`;

    // Luxury Tawalla HTML Email preview payload
    const emailPayload = {
      to: email,
      subject: `تولّى — تنبيه تجريبي: اقتراب موعد انتهاء الصلاحية (${daysText})`,
      previewHtml: `
        <div dir="rtl" style="font-family: system-ui, -apple-system, sans-serif; background-color: #FBF9F5; padding: 32px; color: #2D241E;">
          <div style="max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 32px; border: 1px solid #EFEAE3; box-shadow: 0 4px 20px rgba(45,36,30,0.04);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 800; color: #8C6A4F; letter-spacing: -0.5px;">تولّى</span>
              <p style="font-size: 13px; color: #8F857D; margin-top: 4px;">تنبيه مسبق تجريبي</p>
            </div>
            <div style="background-color: #F6F3EE; border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: right;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2D241E;">مرحباً بك في خدمة تنبيهات تولّى 🔔</h3>
              <p style="margin: 0; font-size: 13px; color: #62574F; line-height: 1.6;">
                هذا بريد تجريبي لتأكيد تفعيل إعدادات الإشعارات بنجاح. سيتم إشعارك مستقبلاً قبل موعد الانتهاء بـ <strong>${daysText}</strong> لكل وثيقة أو ضمان مسجل.
              </p>
            </div>
            <div style="text-align: center; font-size: 11px; color: #A0968F; border-top: 1px solid #F0ECE6; padding-top: 16px;">
              منصة تولّى — مساحتك الخاصة لإدارة ما يهمك بهدوء وأمان.
            </div>
          </div>
        </div>
      `,
    };

    console.log("Mock email sent successfully to:", email, emailPayload);

    return NextResponse.json({
      success: true,
      message: `تم تجهيز وإرسال الإشعار التجريبي إلى ${email}`,
      targetEmail: email,
      reminderDays,
    });
  } catch (error: any) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة التنبيه التجريبي." },
      { status: 500 }
    );
  }
}
