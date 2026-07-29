"use client";

import { useState } from "react";
import { resetPasswordWithToken } from "@/actions/auth.action";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Geçersiz veya eksik token. Lütfen linki tekrar kontrol edin.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithToken(token, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setError(res.message);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-md text-center">
        Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
          <input
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00008F] focus:border-[#00008F] sm:text-sm text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00008F] focus:border-[#00008F] sm:text-sm text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00008F] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00008F] disabled:opacity-50 transition-colors"
        >
          {loading ? "Güncelleniyor..." : "Şifremi Güncelle"}
        </button>
      </div>
    </form>
  );
}
