import { mutation } from "./_generated/server";

// Clear all data from all tables - USE WITH CAUTION!
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('🚨 CLEARING ALL DATA FROM DATABASE - THIS CANNOT BE UNDONE!');
    
    let deletedCounts = {
      events: 0,
      venues: 0,
      contacts: 0,
      vehicles: 0,
      users: 0,
    };

    // Clear events
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
      deletedCounts.events++;
    }

    // Clear venues
    const venues = await ctx.db.query("venues").collect();
    for (const venue of venues) {
      await ctx.db.delete(venue._id);
      deletedCounts.venues++;
    }

    // Clear contacts
    const contacts = await ctx.db.query("contacts").collect();
    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
      deletedCounts.contacts++;
    }

    // Clear vehicles
    const vehicles = await ctx.db.query("vehicles").collect();
    for (const vehicle of vehicles) {
      await ctx.db.delete(vehicle._id);
      deletedCounts.vehicles++;
    }

    // Clear users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
      deletedCounts.users++;
    }

    console.log('✅ Database cleared successfully:', deletedCounts);
    return deletedCounts;
  },
});

// Clear only events table
export const clearEvents = mutation({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    let count = 0;
    
    for (const event of events) {
      await ctx.db.delete(event._id);
      count++;
    }
    
    console.log(`🗑️ Deleted ${count} events`);
    return count;
  },
});

// Clear only venues table
export const clearVenues = mutation({
  args: {},
  handler: async (ctx) => {
    const venues = await ctx.db.query("venues").collect();
    let count = 0;
    
    for (const venue of venues) {
      await ctx.db.delete(venue._id);
      count++;
    }
    
    console.log(`🗑️ Deleted ${count} venues`);
    return count;
  },
});
