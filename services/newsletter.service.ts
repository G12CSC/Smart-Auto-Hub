import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function sendNewsletter(newsletterId: string) {
  const newsletter = await prisma.newsletterBroadcast.findUnique({
    where: { id: newsletterId },
  });

  if (!newsletter) throw new Error("Newsletter not found");

  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
  });

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: { status: "SENDING" },
  });

  for (const subscriber of subscribers) {
    try {
      await sendEmail(
        subscriber.email,
        newsletter.subject,
        newsletter.content
      );

      await prisma.newsletterDelivery.create({
        data: {
          newsletterId,
          subscriberId: subscriber.id,
          status: "SUCCESS",
        },
      });
    } catch (error: any) {
      await prisma.newsletterDelivery.create({
        data: {
          newsletterId,
          subscriberId: subscriber.id,
          status: "FAILED",
          error: error.message,
        },
      });
    }
  }

  await prisma.newsletter.update({
    where: { id: newsletterId },
    data: { status: "SENT", sentAt: new Date() },
  });
}
