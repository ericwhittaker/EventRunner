import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all venues
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("venues").order("asc").collect();
  },
});

// Query to get a single venue by ID
export const get = query({
  args: { id: v.id("venues") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to create a new venue
export const create = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    capacity: v.optional(v.number()),
    venueType: v.optional(v.string()),
    description: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("venues", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to update a venue
export const update = mutation({
  args: {
    id: v.id("venues"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    capacity: v.optional(v.number()),
    venueType: v.optional(v.string()),
    description: v.optional(v.string()),
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

// Mutation to delete a venue
export const remove = mutation({
  args: { id: v.id("venues") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
