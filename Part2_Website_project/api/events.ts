import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../src/lib/db/client.js";
import { event } from "../src/lib/db/schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const reqBody = req.body as {
      name: string;
      description: string;
      date: string;
      categoryId: number;
      location: string;
      cost: number;
    };

    if (
      !reqBody.name ||
      !reqBody.description ||
      !reqBody.date ||
      !reqBody.categoryId ||
      !reqBody.location ||
      reqBody.cost === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.insert(event).values({
      ...reqBody,
      slug: reqBody.name.toLowerCase().replaceAll(" ", "-"),
      date: new Date(reqBody.date),
    });

    return res.status(200).json({ message: "Event created", data: reqBody });
  } else if (req.method === "GET") {
    const events = await db.select().from(event);
    return res.status(200).json({ data: events });
  }
}
