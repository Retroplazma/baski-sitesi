'use server';

export async function submitQuoteForm(prevState: any, formData: FormData) {
  // Simüle edilmiş ağ gecikmesi
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    companyName: formData.get('companyName'),
    contactName: formData.get('contactName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    productType: formData.get('productType'),
    quantity: formData.get('quantity'),
    message: formData.get('message'),
  };

  console.log("Teklif talebi info@egitimto.org adresine gönderilecek:", data);

  return { success: true, message: "Teklif talebiniz başarıyla alınmıştır. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir." };
}
