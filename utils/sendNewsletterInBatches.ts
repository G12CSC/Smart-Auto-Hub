import { sendEmail } from "@/lib/email";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendInBatches(
  emails: string[],
  subject: string,
  message: string,
  batchSize = 2,
  delayMs = 1500
) {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    for (const email of batch) {
      await sendEmail(email, subject, message);
    }

    // ⏳ Delay before next batch
    await sleep(delayMs);
  }
}
