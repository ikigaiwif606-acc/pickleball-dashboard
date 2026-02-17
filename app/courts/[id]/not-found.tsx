import Link from "next/link";

export default function CourtNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Court Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The court you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
      >
        Back to All Courts
      </Link>
    </div>
  );
}
