import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hesabım</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/profile" 
                className="px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors bg-white border border-gray-200 shadow-sm"
              >
                Hesap Bilgilerim
              </Link>
              <Link 
                href="/profile/orders" 
                className="px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors bg-white border border-gray-200 shadow-sm"
              >
                Siparişlerim
              </Link>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
