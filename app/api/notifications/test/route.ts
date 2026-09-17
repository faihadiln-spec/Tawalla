import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toArabicDigits } from "@/lib/utils/formatters";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لإجراء هذا الاختبار." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const email = body.email || user.email;
    const reminderDays = typeof body.reminderDays === "number" ? body.reminderDays : 7;

    // 2. Validate input email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "يرجى إدخال عنوان بريد إلكتروني صالح." },
        { status: 400 }
      );
    }

    if (reminderDays < 0 || reminderDays > 365) {
      return NextResponse.json(
        { error: "عدد أيام التنبيه غير صالح (يجب أن يكون بين ٠ و ٣٦٥ يوماً)." },
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

    const emailHtml = `
      <div dir="rtl" style="font-family: system-ui, -apple-system, sans-serif; background-color: #FBF9F5; padding: 32px; color: #2D241E;">
        <div style="max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 32px; border: 1px solid #EFEAE3; box-shadow: 0 4px 20px rgba(45,36,30,0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 28px; font-weight: 800; color: #8C6A4F; letter-spacing: -0.5px;">تولّى</span>
            <p style="font-size: 13px; color: #8F857D; margin-top: 4px;">منصة إدارة الوثائق والضمانات الشخصية</p>
          </div>
          <div style="background-color: #F6F3EE; border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: right;">
            <h3 style="margin: 0 0 10px 0; font-size: 17px; color: #2D241E;">مرحباً بك في تنبيهات تولّى 🔔</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #62574F; line-height: 1.6;">
              هذه رسالة تجريبية لتأكيد وصول الإشعارات إلى بريدك الإلكتروني بنجاح.
            </p>
            <div style="background: #FFFFFF; border-radius: 12px; padding: 12px 16px; border: 1px solid #E8E2D9; font-size: 12px; color: #4A3E36;">
              ⚙️ <strong>الإعداد الحالي:</strong> سيتم تنبيهك قبل موعد الانتهاء بـ <strong>${daysText}</strong> لأي وثيقة أو ضمان مسجل.
            </div>
          </div>
          <div style="text-align: center; font-size: 11px; color: #A0968F; border-top: 1px solid #F0ECE6; padding-top: 16px;">
            تولّى — مساحتك الخاصة لإدارة ما يهمك بهدوء وأمان.
          </div>
        </div>
      </div>
    `;

    // 3. If RESEND_API_KEY is configured, send real email via official Resend SDK!
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const { data: resendData, error: resendError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Tawalla <onboarding@resend.dev>",
          to: [email],
          subject: `تولّى — تنبيه تجريبي: اقتراب موعد انتهاء الصلاحية (${daysText})`,
          html: emailHtml,
        });

        if (resendError) {
          console.error("Resend API error:", resendError);
          return NextResponse.json(
            {
              success: false,
              isLiveDelivered: false,
              error: resendError.message || "تعذر إرسال البريد عبر المزود.",
            },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          isLiveDelivered: true,
          message: `تم إرسال البريد الفعلي بنجاح إلى (${email}) عبر خادم البريد.`,
          id: resendData?.id,
        });
      } catch (err: any) {
        console.error("Error communicating with Resend:", err);
      }
    }

    // If no external provider key configured in env yet:
    return NextResponse.json({
      success: true,
      isLiveDelivered: false,
      needsMailProvider: true,
      targetEmail: email,
      message: `تم التحقق وتجهيز التنبيه بنجاح للبريد (${email}). لإرسال الإيميل الفعلي إلى صندوق الوارد (Inbox)، يتطلب النظام تزويده بمفتاح خدمة بريد إلكتروني (مثل RESEND_API_KEY).`,
    });
  } catch (error: any) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة التنبيه التجريبي." },
      { status: 500 }
    );
  }
}
