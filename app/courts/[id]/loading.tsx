export default function CourtDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="h-56 sm:h-72 bg-gray-200 dark:bg-slate-700" />
        <div className="p-6 space-y-4">
          <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            ))}
          </div>
          <div className="h-[300px] bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
