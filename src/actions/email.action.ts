"use server";

import { resend } from "@/lib/resend";

export async function sendOrderConfirmationEmail(
  userEmail: string,
  orderNumber: string,
  totalAmount: number,
  firstName: string
) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl mx-auto p-4 border rounded shadow-sm">
        <h2 style="color: #00008F;">Siparişiniz Başarıyla Alındı!</h2>
        <p>Merhaba ${firstName},</p>
        <p>Siparişiniz başarıyla sistemimize ulaştı. Sipariş detaylarınızı aşağıda bulabilirsiniz:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Sipariş Numarası:</strong> ${orderNumber}</p>
          <p style="margin: 10px 0 0;"><strong>Toplam Tutar:</strong> ${totalAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</p>
        </div>
        
        <p>Ürünleriniz en kısa sürede kargoya verilecektir. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Baskı Atölyesi Ekibi</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Baskı Atölyesi <siparis@baski-atolyesi.com>',
      to: [userEmail],
      subject: `Siparişiniz Alındı - #${orderNumber}`,
      html: htmlContent,
    });

    console.log("Order confirmation email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl mx-auto p-4 border rounded shadow-sm">
        <h2 style="color: #00008F;">Şifre Sıfırlama Talebi</h2>
        <p>Merhaba,</p>
        <p>Hesabınızın şifresini sıfırlamak için bir talepte bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
        </div>
        
        <p>Eğer butona tıklayamıyorsanız, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
        <p style="font-size: 0.9em; word-break: break-all; color: #00008F;">${resetLink}</p>
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Eğer bu işlemi siz yapmadıysanız bu e-postayı dikkate almayınız.</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Baskı Atölyesi <destek@baski-atolyesi.com>',
      to: [userEmail],
      subject: 'Şifre Sıfırlama Talebi',
      html: htmlContent,
    });

    console.log("Password reset email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}

export async function sendOrderShippedEmail(
  userEmail: string,
  orderNumber: string,
  firstName: string
) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl mx-auto p-4 border rounded shadow-sm">
        <h2 style="color: #f97316;">Müjde! Siparişiniz Kargoya Verildi 🚀</h2>
        <p>Merhaba ${firstName},</p>
        <p><strong>#${orderNumber}</strong> numaralı siparişiniz başarıyla kargoya verildi ve yola çıktı.</p>
        
        <p>Bizi tercih ettiğiniz için teşekkür ederiz. Güzel günlerde kullanmanız dileğiyle!</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Baskı Atölyesi Ekibi</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Baskı Atölyesi <siparis@baski-atolyesi.com>',
      to: [userEmail],
      subject: `Siparişiniz Kargoya Verildi - #${orderNumber}`,
      html: htmlContent,
    });

    console.log("Order shipped email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending order shipped email:", error);
    return { success: false, error };
  }
}

export async function sendQuoteRequestAdminEmail(
  quoteDetails: {
    orderNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    wantsBox: boolean;
    fileUrls: string[];
  }
) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl mx-auto p-4 border rounded shadow-sm">
        <h2 style="color: #00008F;">Yeni Bir Teklif Talebi Geldi</h2>
        <p><strong>Müşteri:</strong> ${quoteDetails.firstName} ${quoteDetails.lastName}</p>
        <p><strong>E-posta:</strong> ${quoteDetails.email}</p>
        <p><strong>Telefon:</strong> ${quoteDetails.phone}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Talep Numarası:</strong> ${quoteDetails.orderNumber}</p>
          <p style="margin: 10px 0 0;"><strong>Özel Kutu İsteği:</strong> ${quoteDetails.wantsBox ? 'Evet' : 'Hayır'}</p>
          <p style="margin: 10px 0 0;"><strong>Mesaj/Detay:</strong> ${quoteDetails.message || 'Belirtilmedi'}</p>
          <p style="margin: 10px 0 0;"><strong>Dosyalar:</strong> ${quoteDetails.fileUrls.map(url => `<a href="${url}">Dosyayı Gör</a>`).join(', ')}</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Baskı Atölyesi <siparis@baski-atolyesi.com>',
      to: ['admin@sode.com.tr'], // Admin email as agreed in the plan
      subject: `Yeni Teklif Talebi - #${quoteDetails.orderNumber}`,
      html: htmlContent,
    });

    console.log("Quote admin email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending quote admin email:", error);
    return { success: false, error };
  }
}

export async function sendQuoteRequestCustomerEmail(
  userEmail: string,
  firstName: string,
  orderNumber: string
) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl mx-auto p-4 border rounded shadow-sm">
        <h2 style="color: #00008F;">Talebiniz Alındı</h2>
        <p>Merhaba ${firstName},</p>
        <p><strong>#${orderNumber}</strong> numaralı 3D Baskı / Kutu talebiniz başarıyla sistemimize ulaştı.</p>
        
        <p>Ekibimiz yüklediğiniz dosyaları ve detayları inceleyip, fiyatlandırma ve üretim süreci hakkında en kısa sürede sizinle iletişime geçecektir.</p>
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Baskı Atölyesi Ekibi</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Baskı Atölyesi <siparis@baski-atolyesi.com>',
      to: [userEmail],
      subject: `Talebiniz Alındı - #${orderNumber}`,
      html: htmlContent,
    });

    console.log("Quote customer email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending quote customer email:", error);
    return { success: false, error };
  }
}
