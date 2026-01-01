export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg p-6 border border-border animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-8 border border-border animate-pulse">
              <div className="h-8 w-64 bg-muted rounded mb-6"></div>
              <div className="space-y-5">
                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-12 w-full bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-12 w-full bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-12 w-full bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-12 w-full bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-32 w-full bg-muted rounded"></div>
                </div>
                <div className="h-12 w-full bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
