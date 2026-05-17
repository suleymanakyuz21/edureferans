import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@edureferans.com';

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('REPLACE_')) {
    console.log(`\n[DEV] VERIFICATION EMAIL TO: ${email} | CODE: ${code} (15 min)\n`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'EduReferans — E-posta Doğrulama',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#020617;font-family:system-ui,sans-serif">
  <div style="max-width:480px;margin:40px auto;background:#0B0F19;border-radius:16px;border:1px solid #1E293B;overflow:hidden">
    <div style="background:linear-gradient(135deg,#06b6d4,#2563eb);padding:32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800">EduReferans</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px">E-posta Doğrulama</p>
    </div>
    <div style="padding:40px 32px">
      <p style="color:#94a3b8;font-size:15px;margin:0 0 24px">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
      <div style="background:#020617;border:2px dashed #1E293B;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
        <span style="color:#22d3ee;font-size:36px;font-weight:800;letter-spacing:8px">${code}</span>
      </div>
      <p style="color:#64748b;font-size:13px;margin:0">Bu kod 15 dakika geçerlidir. Siz istemediğiniz takdirde bu e-postayı görmezden gelin.</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1E293B;text-align:center">
      <p style="color:#475569;font-size:12px;margin:0">© 2026 EduReferans. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>`,
  });
}
