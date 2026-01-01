import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Spinner className="size-6 text-primary" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  )
}
