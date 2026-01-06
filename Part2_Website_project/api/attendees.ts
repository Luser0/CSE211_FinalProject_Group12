import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, eq, like, or } from "drizzle-orm";
import { db } from "../src/lib/db/client.js";
import { attendee, event } from "../src/lib/db/schema.js";

type QueryString = {
  eventId?: string | string[];
  search?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
};

type ParsedQuery = {
  eventId: number | null;
  search: string;
  page: number;
  pageSize: number;
};

const parseNumberParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return parseNumberParam(value[0]);
  }
  if (typeof value !== "string" || value.trim() === "") {
    return NaN;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const parseQuery = (query: QueryString): ParsedQuery => {
  const rawEventId = parseNumberParam(query.eventId);
  const rawPage = parseNumberParam(query.page);
  const rawPageSize = parseNumberParam(query.pageSize);
  const searchValue = Array.isArray(query.search)
    ? (query.search[0] ?? "")
    : (query.search ?? "");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSize =
    Number.isInteger(rawPageSize) && rawPageSize > 0 && rawPageSize <= 100
      ? rawPageSize
      : 25;
  return {
    eventId: Number.isInteger(rawEventId) ? rawEventId : null,
    search: searchValue.trim(),
    page,
    pageSize,
  };
};

const buildFilters = (parsed: ParsedQuery) => {
  const clauses = [] as any[];
  if (parsed.eventId !== null) {
    clauses.push(eq(attendee.eventId, parsed.eventId));
  }
  if (parsed.search !== "") {
    const likePattern = `%${parsed.search}%`;
    clauses.push(
      or(
        like(attendee.name, likePattern),
        like(attendee.email, likePattern),
        like(attendee.phonenumber, likePattern),
      ),
    );
  }
  if (!clauses.length) {
    return undefined;
  }
  if (clauses.length === 1) {
    return clauses[0];
  }
  return and(...clauses);
};

const getAttendees = async (parsed: ParsedQuery) => {
  const whereClause = buildFilters(parsed);
  const offset = (parsed.page - 1) * parsed.pageSize;
  const baseQuery = db
    .select({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email,
      phonenumber: attendee.phonenumber,
      eventId: attendee.eventId,
      eventName: event.name,
    })
    .from(attendee)
    .leftJoin(event, eq(attendee.eventId, event.id));
  const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;
  const rows = await filteredQuery
    .orderBy(attendee.id)
    .limit(parsed.pageSize)
    .offset(offset);
  return rows;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const parsed = parseQuery(req.query as QueryString);
      const rows = await getAttendees(parsed);
      return res
        .status(200)
        .json({
          data: rows,
          pagination: { page: parsed.page, pageSize: parsed.pageSize },
        });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch attendees" });
    }
  }
  res.setHeader("Allow", "GET");
  return res.status(405).json({ error: "Method not allowed" });
}
