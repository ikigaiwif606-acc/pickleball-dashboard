"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
