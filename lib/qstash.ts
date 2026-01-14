import { Client } from "@upstash/qstash";

export const qstash =
  process.env.USE_QSTASH === "true"
    ? new Client({
        token: process.env.QSTASH_TOKEN!,
      })
    : null;
