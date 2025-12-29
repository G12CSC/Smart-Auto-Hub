"use client"

/**
 * Vehicle Comparison Component
 *
 * Allows users to select and compare up to 3 vehicles side-by-side.
 * Features:
 * - Add/remove vehicles from comparison
 * - Side-by-side specs comparison table
 * - Persistent comparison list in localStorage
 * - Responsive design for mobile and desktop
 */

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { X } from 'lucide-react'

export function VehicleCompare() {
    const [compareList, setCompareList] = useState([])

    //Load comparison list from localStorage on mount and when storage/custom events fire
    useEffect(() => {
      const syncFromStorage = () => {
        const saved = localStorage.getItem("compareVehicles")
        setCompareList(saved ? JSON.parse(saved) : [])
      }

      // initial load
      syncFromStorage()

      const handleStorageChange = (e) => {
        // React only when compareVehicles changes or when our custom event fires
        if (e?.key && e.key !== "compareVehicles") return
        syncFromStorage()
      }

      window.addEventListener("storage", handleStorageChange)
      window.addEventListener("compareVehiclesUpdated", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("compareVehiclesUpdated", handleStorageChange)
      }
    }, [])

    //Save to localStorage whenever list changes
    useEffect(() => {
        if (compareList.length > 0 || localStorage.getItem("compareVehicles")) {
            localStorage.setItem("compareVehicles", JSON.stringify(compareList))
        }
    }, [compareList])

    // Remove a vehicle from comparison
    const removeFromCompare = (id) => {
        setCompareList((prev) => prev.filter((v) => v.id !== id))
    }

    // Clear all vehicles from comparison
    const clearAll = () => {
        setCompareList([])
        localStorage.removeItem("compareVehicles")
    }

    // Don't show the bar if comparison list is empty
    if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-primary shadow-2xl z-40 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Compare Vehicles ({compareList.length}/3)</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} className="bg-transparent">
              Clear All
            </Button>
            <Button asChild size="sm">
              <Link href="/vehicles/compare">Compare Now</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {compareList.map((vehicle) => (
            <div key={vehicle.id} className="bg-background rounded-lg p-3 flex items-center gap-3 border border-border">
              <img
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{vehicle.name}</p>
                <p className="text-xs text-primary font-bold">LKR {vehicle.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => removeFromCompare(vehicle.id)}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Helper function to add vehicle to comparison list
 * Call this from vehicle cards or detail pages
 */

export function addToCompare(vehicle) {
  const saved = localStorage.getItem("compareVehicles")
  const compareList = saved ? JSON.parse(saved) : []

  // Check if already in list
  if (compareList.find((v) => v.id === vehicle.id)) {
    return { success: false, message: "Vehicle already in comparison" }
  }

  // Check if list is full (max 3 vehicles)
  if (compareList.length >= 3) {
    return { success: false, message: "Maximum 3 vehicles can be compared" }
  }

  // Add vehicle to list
  compareList.push({
    id: vehicle.id,
    name: vehicle.name,
    price: vehicle.price,
    image: vehicle.image,
  })

  localStorage.setItem("compareVehicles", JSON.stringify(compareList))

  // Dispatch custom event so the compare bar updates in the same tab
  window.dispatchEvent(new CustomEvent("compareVehiclesUpdated", { detail: compareList }))

  return { success: true, message: "Added to comparison" }
}