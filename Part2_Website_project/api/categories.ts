import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc, eq, like, sql } from "drizzle-orm";
import { db } from "../src/lib/db/client.js";
import { event, event_category } from "../src/lib/db/schema.js";

type CategoryBody = {
    name?: unknown;
};

type QueryString = {
    search?: string | string[];
    includeCounts?: string | string[];
};

const parseBooleanFlag = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
        return value.some((item) => parseBooleanFlag(item));
    }
    if (typeof value !== "string") {
        return false;
    }
    return ["1", "true", "yes"].includes(value.toLowerCase());
};

const parseSearch = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
};

const getCategories = async (query: QueryString) => {
    const includeCounts = parseBooleanFlag(query.includeCounts);
    const searchTerm = parseSearch(query.search).trim();
    if (includeCounts) {
        let builder = db
            .select({
                id: event_category.id,
                name: event_category.name,
                eventCount: sql<number>`count(${event.id})`,
            })
            .from(event_category)
            .leftJoin(event, eq(event.categoryId, event_category.id));
        if (searchTerm !== "") {
            builder = builder.where(like(event_category.name, `%${searchTerm}%`));
        }
        const rows = await builder.groupBy(event_category.id).orderBy(asc(event_category.name));
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            eventCount: Number(row.eventCount) || 0,
        }));
    }
    let builder = db
        .select({
            id: event_category.id,
            name: event_category.name,
        })
        .from(event_category);
    if (searchTerm !== "") {
        builder = builder.where(like(event_category.name, `%${searchTerm}%`));
    }
    const rows = await builder.orderBy(asc(event_category.name));
    return rows;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "GET") {
        try {
            const query = req.query as QueryString;
            const categories = await getCategories(query);
            return res.status(200).json({ data: categories });
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch categories" });
        }
    }
    if (req.method === "POST") {
        try {
            const body: CategoryBody = req.body ?? {};
            if (typeof body.name !== "string" || body.name.trim() === "") {
                return res.status(400).json({ error: "Name is required" });
            }
            const trimmedName = body.name.trim();
            const [existing] = await db
                .select({ id: event_category.id })
                .from(event_category)
                .where(eq(event_category.name, trimmedName))
                .limit(1);
            if (existing) {
                return res.status(409).json({ error: "Category already exists" });
            }
            const [created] = await db
                .insert(event_category)
                .values({ name: trimmedName })
                .returning({ id: event_category.id, name: event_category.name });
            return res.status(201).json({ data: created });
        } catch (error) {
            return res.status(500).json({ error: "Failed to create category" });
        }
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
}
