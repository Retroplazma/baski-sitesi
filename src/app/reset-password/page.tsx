import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Şifre Sıfırlama | Baskı Atölyesi",
  description: "Şifrenizi sıfırlayın.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Şifre Sıfırlama
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Lütfen yeni şifrenizi belirleyin
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-4">Yükleniyor...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
