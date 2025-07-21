import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const body = req.body;

  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });

    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });

  res.json({ message: "Webhook Received" });
});

app.listen(5000);
