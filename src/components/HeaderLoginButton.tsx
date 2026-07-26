"use client";

import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HeaderLoginButton() {
  const openAuthModal = useCartStore((state) => state.openAuthModal);
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        {session.user.role === "ADMIN" && (
          <Link href="/admin" className="text-xs font-medium text-orange-500 hover:underline">
            Admin Paneli
          </Link>
        )}
        <Link 
          href="/profile"
          className="flex flex-col items-center text-gray-600 hover:text-sky-500 transition-colors"
          title="Hesabım"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-xs font-medium">Hesabım</span>
        </Link>
        <button 
          onClick={() => signOut()}
          className="flex flex-col items-center text-gray-600 hover:text-red-500 transition-colors"
          title="Çıkış Yap"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-xs font-medium">Çıkış Yap</span>
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={openAuthModal}
      className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors"
    >
      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="text-xs font-medium">Giriş Yap</span>
    </button>
  );
}
