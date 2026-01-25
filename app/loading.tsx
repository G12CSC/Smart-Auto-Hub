import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated car icon */}
        <div className="flex justify-center">
          <div className="relative">
            <svg
              className="w-24 h-24 text-primary animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Car body */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l1.5-6h11l1.5 6H5z"
              />
              {/* Car top/cabin */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 13v-4h10v4"
              />
              {/* Front wheel */}
              <circle
                cx="6.5"
                cy="17"
                r="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
              {/* Back wheel */}
              <circle
                cx="17.5"
                cy="17"
                r="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
              {/* Windshield */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12L8.5 8.5"
              />
              {/* Rear window */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 12L15.5 8.5"
              />
            </svg>
            <div className="absolute inset-0 animate-ping opacity-30">
              <svg
                className="w-24 h-24 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6.5 17a2 2 0 100-4 2 2 0 000 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.5 17a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Loading</h2>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
