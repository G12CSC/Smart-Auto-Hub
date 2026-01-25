export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-24">
        <div className="bg-card rounded-lg p-8 border border-border animate-pulse">
          <div className="h-10 w-96 bg-muted rounded mb-8 mx-auto"></div>

          <div className="space-y-4">
            {/* Category sections */}
            {[...Array(3)].map((categoryIdx) => (
              <div key={categoryIdx} className="space-y-4">
                <div className="h-6 w-48 bg-muted rounded mb-4"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-3/4 bg-muted rounded"></div>
                      <div className="h-5 w-5 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
