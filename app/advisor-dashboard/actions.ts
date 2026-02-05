"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type BookingFilter = "today" | "all" | "pending" | "confirmed";

export async function getAdvisorBookings(advisorId: string, filter: BookingFilter = "all", date?: Date) {
    try {
        const whereClause: any = {
            advisorId: advisorId,
        };

        if (filter === "pending") {
            whereClause.status = "PENDING";
        } else if (filter === "confirmed") {
            whereClause.status = "ACCEPTED";
        } else if (filter === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            whereClause.preferredDate = {
                gte: start,
                lte: end,
            };
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            whereClause.preferredDate = {
                gte: start,
                lte: end
            };
        }

        const bookings = await prisma.consultationBooking.findMany({
            where: whereClause,
            orderBy: {
                preferredDate: "asc",
            },
        });

        return { success: true, data: bookings };
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return { success: false, error: "Failed to fetch bookings" };
    }
}

export async function getAdvisorAvailability(advisorId: string, date: Date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const availability = await prisma.advisorAvailability.findMany({
            where: {
                advisorId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                isAvailable: true,
            },
        });

        return { success: true, data: availability.map(a => a.timeSlot) };
    } catch (error) {
        console.error("Error fetching availability:", error);
        return { success: false, error: "Failed to fetch availability" };
    }
}

export async function saveAdvisorAvailability(advisorId: string, date: Date, slots: string[]) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        await prisma.$transaction(async (tx) => {
            await tx.advisorAvailability.deleteMany({
                where: {
                    advisorId,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            if (slots.length > 0) {
                await tx.advisorAvailability.createMany({
                    data: slots.map((slot) => ({
                        advisorId,
                        date: startOfDay,
                        timeSlot: slot,
                        isAvailable: true,
                    })),
                });
            }
        });

        revalidatePath("/advisor-dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error saving availability:", error);
        return { success: false, error: "Failed to save availability" };
    }
}

export async function getAdvisorProfile(advisorId: string) {
    try {
        const advisor = await prisma.admin.findUnique({
            where: { id: advisorId },
        });

        if (!advisor) return { success: false, error: "Advisor not found" };

        const bookingCount = await prisma.consultationBooking.count({
            where: { advisorId: advisorId }
        });

        return {
            success: true,
            data: {
                ...advisor,
                totalBookings: bookingCount,
                rating: 5.0
            }
        };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateAdvisorProfile(advisorId: string, data: { name?: string; position?: string; phoneNumber?: string; image?: string; }) {
    try {
        await prisma.admin.update({
            where: { id: advisorId },
            data: data
        });
        revalidatePath("/advisor-dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function getAvailableAdvisors(date: Date | string, timeSlot: string) {
    try {
        const d = new Date(date);
        const startOfDay = new Date(d);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(d);
        endOfDay.setHours(23, 59, 59, 999);

        const availabilities = await prisma.advisorAvailability.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                timeSlot: timeSlot,
                isAvailable: true,
                advisor: {
                    // role: "advisor" // Should we filter by role? Prompt implies Admin table used by Advisors
                    // Assuming 'admin' table stores advisors
                }
            },
            include: {
                advisor: true
            }
        });

        return {
            success: true,
            data: availabilities.map(a => ({
                id: a.advisor.id,
                name: a.advisor.name || "Unknown Advisor",
                image: a.advisor.image || "",
                rating: 5.0, // Mock
                experience: "N/A", // Mock
                specialization: a.advisor.position || "General",
                email: a.advisor.email,
                phone: a.advisor.phoneNumber || "N/A",
                isAvailable: true,
                availableTimes: [a.timeSlot]
            }))
        };
    } catch (error) {
        console.error("Error fetching available advisors:", error);
        return { success: false, error: "Failed to fetch advisors" };
    }
}
