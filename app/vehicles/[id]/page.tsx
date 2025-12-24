import VehicleDetailsClient from "./VehicleDetailsClient"
import { vehicleAPI } from "../../../lib/api/vehicles"

export default async function VehicleDetailsPage({ params }) {
  const resolvedParams = await params
  const vehicleId = Array.isArray(resolvedParams?.id)
    ? resolvedParams.id[0]
    : resolvedParams?.id
  const result = await vehicleAPI.getVehicleById(vehicleId)

  return (
    <VehicleDetailsClient
      vehicleId={vehicleId}
      initialVehicle={result.success ? result.data : null}
      initialError={result.success ? null : result.error}
    />
  )
}
