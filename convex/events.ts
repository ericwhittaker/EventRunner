import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all events
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").order("desc").collect();
  },
});

// Query to get a single event by ID
export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query to get events with their venue information
export const listWithVenues = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").order("desc").collect();
    
    const eventsWithVenues = await Promise.all(
      events.map(async (event) => {
        let venue = null;
        if (event.venueId) {
          venue = await ctx.db.get(event.venueId);
        }
        return {
          ...event,
          venue,
        };
      })
    );
    
    return eventsWithVenues;
  },
});

// Mutation to create a new event
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    eventType: v.optional(v.union(
      v.literal("concert"),
      v.literal("corporate"),
      v.literal("conference"),
      v.literal("festival"), 
      v.literal("wedding"),
      v.literal("other")
    )),
    status: v.optional(v.union(
      v.literal("tentative"),
      v.literal("confirmed"), 
      v.literal("postshow"),
      v.literal("nogo")
    )),
    venueId: v.optional(v.id("venues")),
    eventDate: v.optional(v.number()),
    eventTime: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("events", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to update an event
export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    eventType: v.optional(v.union(
      v.literal("concert"),
      v.literal("corporate"),
      v.literal("conference"),
      v.literal("festival"), 
      v.literal("wedding"),
      v.literal("other")
    )),
    status: v.optional(v.union(
      v.literal("tentative"),
      v.literal("confirmed"), 
      v.literal("postshow"),
      v.literal("nogo")
    )),
    venueId: v.optional(v.id("venues")),
    eventDate: v.optional(v.number()),
    eventTime: v.optional(v.string()),
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to delete an event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
