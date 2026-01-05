import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../src/lib/db/client.js";
import { attendee } from "../src/lib/db/schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const reqBody = req.body as {
      eventId: number;
      name: string;
      email: string;
      phonenumber: string;
    };

    if (!reqBody.name || !reqBody.email || !reqBody.phonenumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await db.insert(attendee).values({
        ...reqBody,
      });

      return res
        .status(200)
        .json({ message: "registration successful", data: reqBody });
    } catch (error: any) {
      if (
        error?.code === "SQLITE_CONSTRAINT" ||
        error?.cause?.code === "SQLITE_CONSTRAINT"
      ) {
        const errorMessage = error?.cause.message;

        if (errorMessage.includes("attendee.phonenumber")) {
          return res.status(409).json({
            error: "Phone number already registered",
            field: "phonenumber",
            message:
              "This phone number is already registered for this event. Please use a different phone number.",
          });
        }

        if (errorMessage.includes("attendee.email")) {
          return res.status(409).json({
            error: "Email already registered",
            field: "email",
            message:
              "This email is already registered for this event. Please use a different email.",
          });
        }
      }

      return res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}
