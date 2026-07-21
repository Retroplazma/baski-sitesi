export default function BlogPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Çok Yakında!</h1>
      <p className="text-gray-500 max-w-md mx-auto">
        Baskı teknolojileri, tasarım trendleri, ilham verici dekorasyon fikirleri ve sanat dolu içeriklerle çok yakında karşınızda olacağız.
      </p>
      <div className="mt-8">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Hazırlıklar devam ediyor...
        </span>
      </div>
    </div>
  );
}
