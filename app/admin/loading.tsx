export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-muted rounded"></div>
            <div className="h-4 w-80 bg-muted rounded"></div>
          </div>
          <div className="h-10 w-10 rounded-full bg-muted"></div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-muted rounded-lg"></div>
              </div>
              <div className="h-4 w-24 bg-muted rounded mb-2"></div>
              <div className="h-8 w-16 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </div>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="bg-card rounded-t-lg border-x border-t border-border">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-card rounded-b-lg border-x border-b border-border p-6">
          <div className="h-8 w-48 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-16 w-24 bg-muted rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-48 bg-muted rounded"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-20 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
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
