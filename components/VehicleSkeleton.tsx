/**
 * VehicleSkeleton Component
 *
 * Displays a loading skeleton placeholder for vehicle cards
 * Shows a shimmer animation effect while vehicle data is being fetched
 * Improves perceived performance by showing structure before content loads
 */
export function VehicleSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
      {/* Image skeleton with shimmer effect */}
      <div className="relative h-56 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted rounded w-3/4"></div>

        {/* Price skeleton */}
        <div className="h-6 bg-muted rounded w-1/2"></div>

        {/* Details skeleton */}
        <div className="h-4 bg-muted rounded w-2/3"></div>

        {/* Button skeleton */}
        <div className="h-10 bg-muted rounded w-full mt-4"></div>
      </div>
    </div>
  )
}