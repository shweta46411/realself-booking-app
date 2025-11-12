'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Error is required by Next.js error boundary API but may not always be used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = error;
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl sm:text-5xl font-black text-black mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] text-white rounded-xl hover:bg-[#FF5722] transition-colors font-semibold text-base sm:text-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

