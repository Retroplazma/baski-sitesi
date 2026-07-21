'use server';

export async function submitContactForm(prevState: any, formData: FormData) {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  console.log("info@egitimto.org adresine e-posta gönderilecek:", data);

  return { success: true, message: "Mesajınız başarıyla iletildi. En kısa sürede tarafınıza dönüş yapılacaktır." };
}
