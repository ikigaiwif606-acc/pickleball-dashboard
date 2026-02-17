export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-4">
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg mb-3" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-slate-700" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
