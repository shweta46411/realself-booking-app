import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-3 sm:mb-4">404</h1>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-6 sm:mb-8 uppercase tracking-wide px-4">Service not found</p>
        <Link
          href="/"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] text-white rounded-xl hover:bg-[#FF5722] transition-colors font-semibold text-base sm:text-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

