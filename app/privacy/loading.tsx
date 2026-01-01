export default function PrivacyLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-24">
        <div className="bg-card rounded-lg p-8 border border-border animate-pulse">
          {/* Title skeleton */}
          <div className="h-10 w-64 bg-muted rounded mb-8"></div>

          {/* Content sections */}
          <div className="space-y-8">
            {[...Array(6)].map((_, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                {/* Section heading */}
                <div className="h-7 w-48 bg-muted rounded"></div>

                {/* Paragraph lines */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                </div>

                {/* Bullet points */}
                <div className="space-y-2 pl-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-muted rounded-full mt-2"></div>
                      <div className="h-4 flex-1 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
