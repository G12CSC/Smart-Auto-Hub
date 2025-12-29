export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
        {/* Story section skeleton */}
        <section className="animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded mt-6"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded-2xl"></div>
          </div>
        </section>

        {/* Team section skeleton */}
        <section className="animate-pulse">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-72 w-full bg-muted rounded-2xl mb-4"></div>
                <div className="h-5 w-32 bg-muted rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-muted rounded mx-auto mb-2"></div>
                <div className="h-3 w-40 bg-muted rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Values section skeleton */}
        <section className="animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-8 border border-border text-center"
              >
                <div className="h-20 w-20 bg-muted rounded-2xl mx-auto mb-6"></div>
                <div className="h-6 w-24 bg-muted rounded mx-auto mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
