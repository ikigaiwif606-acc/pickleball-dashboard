export default function OfflinePage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">You're Offline</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        This page isn't available offline. Please check your internet connection and try again.
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        Court listings and your saved reviews are still available from the home page.
      </p>
    </div>
  );
}
