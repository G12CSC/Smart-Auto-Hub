export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-4 w-64 bg-muted rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-border">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Content skeleton - appointment cards */}
          <div className="lg:col-span-3 space-y-6">
            <div className="h-8 w-48 bg-muted rounded mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="space-y-3">
                  <div className="h-6 w-40 bg-muted rounded"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="h-8 w-24 bg-muted rounded"></div>
                    <div className="h-8 w-24 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
