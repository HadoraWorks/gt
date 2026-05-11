export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
      <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-3" />
      <div className="h-3 bg-slate-100 rounded-full w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded-full w-5/6" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-200 rounded-lg mb-2" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-slate-100 rounded-lg mb-1" />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-slate-200 rounded-full"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-100 rounded-full w-24" />
      </div>
    </div>
  )
}
