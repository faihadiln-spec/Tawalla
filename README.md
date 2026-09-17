# تولّى | Tawalla 💼✨
> **مساحتك الشخصية لما يهمك — تنظيم مصاريفك، ضماناتك، ووثائقك في مكان واحد هادئ ومنظم.**
> *A modern, privacy-first personal management platform for subscriptions, warranties, and official documents.*

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://tawalla.vercel.app)

---

## 🌐 الرابط المباشر للمشروع (Live Demo)
يمكنك تجربة النسخة الحية للموقع مباشرة عبر الرابط:  
👉 **[https://tawalla.vercel.app](https://tawalla.vercel.app)**

---

## 📖 عن المشروع (About Tawalla)
«**تولّى**» منصة ويب عربية صُممت بعناية لتجمع الجوانب الحيوية في حياة الفرد اليومية بعيداً عن التعقيد وجداول البيانات الجامدة. تركز المنصة على البساطة، الخصوصية التامة (بدون أي ربط بنكي)، وتجربة مستخدم بصرية راقية ومريحة.

### 🌟 المحاور والمسارات الرئيسية:

#### 1. مسار مصروفاتي (السلة التفاعلية) 🛒
- تجربة بصرية تفاعلية مميزة لحساب المصروفات والاشتراكات الدورية (ترفيه، رياضة، سحابية، اتصالات).
- إمكانية استبعاد أي اشتراك مؤقتاً أو دائماً لرؤية إجمالي **الوفر المالي الشهري والسنوي** لحظياً.
- تصنيف المصروفات ومتابعة حالة كل اشتراك بدقة.

#### 2. مسار ضماناتي (حماية المنتجات والأجهزة) 🛡️
- تتبع تواريخ صلاحية الضمانات للأجهزة الإلكترونية والمنزلية ومشترياتك الهامة.
- تنبيهات ذكية قبل انتهاء فترة الضمان لتدارك الإصلاح أو الاستبدال قبل فوات الأوان.
- ربط وتوثيق وجود فواتير الشراء لكل منتج.

#### 3. مسار وثائقي (الأوراق والمستندات الرسمية) 📄
- تنظيم الوثائق الرسمية (جواز السفر، رخصة القيادة، الهوية الوطنية، عقود الإيجار "إيجار"، تأمين المركبات).
- نظام تنبيهات مبكر قبل انتهاء الصلاحية لتجنب الغرامات والمفاجآت غير المتوقعة.
- خصوصية وأمان عالي دون مشاركة بياناتك مع أي أطراف ثالثة.

#### 4. نظام تنبيهات البريد الإلكتروني الذكي (Email Alerts) ✉️
- إمكانية تخصيص وقت استلام التنبيهات للضمانات والوثائق (قبل 3، 7، 14، 30 يوماً أو توقيت مخصص).
- تكامل مباشر مع مزود البريد الاحترافي **Resend** لضمان وصول التنبيهات في وقتها.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend & Routing:** [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design System:** [Tailwind CSS](https://tailwindcss.com/) مع هوية لونية هادئة (Organic Palette)، وظلال ناعمة، ودعم كامل للغة العربية (RTL).
- **Authentication & Backend:** [Supabase](https://supabase.com/) (Auth, PostgreSQL Database & Row Level Security).
- **Icons:** [Lucide Icons](https://lucide.dev/).
- **Email Delivery:** [Resend API](https://resend.com/).
- **Hosting & CI/CD:** [Vercel](https://vercel.com/).

---

## 🚀 التشغيل محلياً (Local Development Setup)

### 1. استنساخ المستودع (Clone Repository)
```bash
git clone https://github.com/faihadiln-spec/Tawalla.git
cd Tawalla
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد المتغيرات البيئية (Environment Variables)
أنشئ ملف باسم `.env.local` في المجلد الرئيسي وضع به القيم التالية:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

### 4. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000) لتصفح المشروع محلياً.

---

## 📁 هيكلية المشروع (Project Structure)

```text
Tawalla/
├── app/                      # مسارات Next.js (App Router)
│   ├── (auth)/               # صفحات تسجيل الدخول وإنشاء الحساب
│   ├── (dashboard)/          # لوحة التحكم ومسارات المصروفات، الضمانات، الوثائق، الإعدادات
│   ├── api/                  # نقاط النهاية (API Routes للتنبيهات وإرسال البريد)
│   ├── layout.tsx            # الإطار العام للموقع والشعار
│   └── page.tsx              # الصفحة الرئيسية (Landing Page)
├── components/               # مكونات واجهة المستخدم
│   ├── basket/               # مكونات السلة التفاعلية
│   ├── brand/                # شعار وهوية تولّى الرسمية
│   ├── landing/              # أقسام صفحة الهبوط والعرض البصري
│   └── ui/                   # المكونات الأساسية (أزرار، حقول، شارات، شريط تنقل)
├── lib/                      # وظائف الاتصال وقاعدة البيانات
│   ├── supabase/             # إعدادات العميل ودوال الاستعلام (db.ts)
│   └── utils/                # أدوات التنسيق والتواريخ العربية
└── types/                    # تعريفات TypeScript للبيانات
```

---

## 🔒 الأمان والخصوصية (Security & Privacy)
- يتم تطبيق سياسات الحماية على مستوى الصفوف (**Row Level Security - RLS**) في Supabase، مما يضمن أن كل مستخدم لا يستطيع الوصول إلا لبياناته الخاصة فقط.
- لا يتم تخزين أي كلمات مرور أو مفاتيح سرية في مستودع الكود العام.

---
  أعضاء المشروع

تم تطوير المشروع بواسطة:

* **رؤود فهد اليوسف**
* **غلا علي العتيبي**
* **غزيل براك العتيبي**
* **شيخة محمد العنزي**
* **دعاء الذبياني**
* **رنا الغامدي**
* **في العتيبي**
* **أسيل الذبياني**
* **ساره الجحدلي**



---

##  البرنامج التدريبي

تم تنفيذ مشروع **تولّى (Tawalla)** ضمن:

### برنامج البرمجة التوليدية (VIBE Coding)

بإشراف:

### أكاديمية سدايا — SDAIA Academy

🔗 **حساب أكاديمية سدايا على GitHub:**
https://github.com/SDAIAAcademy


