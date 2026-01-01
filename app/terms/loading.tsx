export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-r from-green-500/20 to-teal-500/20 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-24">
        <div className="bg-card rounded-lg p-8 border border-border animate-pulse">
          {/* Title skeleton */}
          <div className="h-10 w-80 bg-muted rounded mb-8"></div>

          {/* Last updated */}
          <div className="h-4 w-40 bg-muted rounded mb-8"></div>

          {/* Content sections */}
          <div className="space-y-8">
            {[...Array(8)].map((_, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                {/* Section number and heading */}
                <div className="flex items-center gap-3">
                  <div className="h-7 w-8 bg-muted rounded"></div>
                  <div className="h-7 w-56 bg-muted rounded"></div>
                </div>

                {/* Paragraph lines */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-4/5 bg-muted rounded"></div>
                </div>

                {/* Sub-sections */}
                {sectionIdx % 2 === 0 && (
                  <div className="space-y-2 pl-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 w-40 bg-muted rounded"></div>
                        <div className="h-4 w-full bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
