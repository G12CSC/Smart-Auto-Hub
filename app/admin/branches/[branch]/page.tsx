import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import ChatBot from "@/components/ChatBot"
import { vehicleAPI } from "@/lib/api/vehicles"
import { getBranchBySlug } from "@/lib/branches"
import { Car, CheckCircle, ChevronLeft, Clock, MapPin, Truck } from "lucide-react"

const formatBranchName = (value) => {
  if (!value) return ""
  return String(value)
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-500/20 text-green-700 dark:text-green-400"
    case "Shipped":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
    case "Reserved":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
    default:
      return "bg-red-500/20 text-red-700 dark:text-red-400"
  }
}

export default async function BranchInventoryPage({ params }) {
  const resolvedParams = await params
  const branchParam = Array.isArray(resolvedParams?.branch) ? resolvedParams.branch[0] : resolvedParams?.branch
  const branchInfo = getBranchBySlug(branchParam)
  const branchName = branchInfo?.name || formatBranchName(branchParam) || "Branch"
  const branchLocation = branchInfo?.location || branchName

  const result = await vehicleAPI.searchVehicles({ location: branchLocation })
  const vehicles = result.success ? result.data : []

  const totalCount = vehicles.length
  const availableCount = vehicles.filter((vehicle) => vehicle.status === "Available").length
  const shippedCount = vehicles.filter((vehicle) => vehicle.status === "Shipped").length
  const reservedCount = vehicles.filter((vehicle) => vehicle.status === "Reserved").length

  const stats = [
    {
      label: "Total Vehicles",
      value: totalCount,
      icon: Car,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      label: "Available",
      value: availableCount,
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      label: "Shipped",
      value: shippedCount,
      icon: Truck,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      label: "Reserved",
      value: reservedCount,
      icon: Clock,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin">
            <ChevronLeft size={18} className="mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{branchName} Branch Inventory</h1>
            <p className="text-muted-foreground">Branch Location: {branchLocation}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/40 px-4 py-2 rounded-full">
            <MapPin size={16} className="text-primary" />
            {branchLocation}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Vehicles at {branchName}</h2>
              <p className="text-sm text-muted-foreground">
                Showing {totalCount} {totalCount === 1 ? "vehicle" : "vehicles"}
              </p>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vehicles are currently listed for this branch.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-3 text-left font-semibold text-sm">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Year</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Mileage</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-border last:border-0 hover:bg-secondary/10 transition">
                      <td className="px-4 py-3 text-sm font-medium">{vehicle.name}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.type}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.year}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.mileage?.toLocaleString?.()} km</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        LKR {vehicle.price?.toLocaleString?.()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ChatBot />
      <Footer />
    </div>
  )
}
