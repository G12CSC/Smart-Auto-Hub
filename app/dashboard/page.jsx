import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import DashboardClient from "@/components/dashboard/dashboard-client";

async function getDashboardData(userId) {
  if (!userId) {
    return { upcoming: [], history: [] };
  }

  try {
    await prisma.consultationBooking.updateMany({
      where: {
        status: { in: ["PENDING", "ACCEPTED", "REJECTED"] },
        preferredDate: { lt: new Date() },
        userId,
      },
      data: { status: "COMPLETED" },
    });

    const upcoming = await prisma.consultationBooking.findMany({
      where: {
        status: { in: ["PENDING", "ACCEPTED", "REJECTED"] },
        preferredDate: { gte: new Date() },
        userId,
      },
      orderBy: { createdAt: "desc" },
    });

    const history = await prisma.consultationBooking.findMany({
      where: {
        status: "COMPLETED",
        userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      upcoming: JSON.parse(JSON.stringify(upcoming)),
      history: JSON.parse(JSON.stringify(history)),
    };
  } catch (error) {
    console.error("Failed to load dashboard data", error);
    return { upcoming: [], history: [] };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { upcoming, history } = await getDashboardData(session.user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardClient
        session={session}
        initialUpcoming={upcoming}
        initialHistory={history}
      />
      <Footer />
    </div>
  );
}
