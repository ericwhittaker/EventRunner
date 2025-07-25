import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth required tables
  ...authTables,
  
  events: defineTable({
    // Event Details
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
    
    // Dates and Times
    artistsDoorsDate: v.optional(v.number()),
    artistsDoorsTime: v.optional(v.string()),
    artistsInDate: v.optional(v.number()),
    artistsInTime: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    eventTime: v.optional(v.string()),
    loadInDate: v.optional(v.number()),
    loadInTime: v.optional(v.string()),
    loadOutDate: v.optional(v.number()),
    loadOutTime: v.optional(v.string()),
    
    // Billing Information
    billingEntity: v.optional(v.string()),
    billingCity: v.optional(v.string()),
    billingDeposit: v.optional(v.string()),
    billingInfoFrom: v.optional(v.string()),
    
    // Venue reference
    venueId: v.optional(v.id("venues")),
    
    // System fields - REQUIRED
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
  }),

  venues: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    
    // Contact Information
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    
    // Venue Details
    capacity: v.optional(v.number()),
    venueType: v.optional(v.string()),
    description: v.optional(v.string()),
    
    // System fields - REQUIRED
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
  }),

  contacts: defineTable({
    firstName: v.string(),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    type: v.optional(v.string()), // 'client', 'crew', 'vendor', etc.
    
    // System fields - REQUIRED
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
  }),

  vehicles: defineTable({
    name: v.string(),
    type: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    description: v.optional(v.string()),
    
    // System fields - REQUIRED
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    updatedBy: v.optional(v.string()),
  }),

  // Note: users table is provided by authTables from Convex Auth
  // Don't define it here to avoid conflicts
});
