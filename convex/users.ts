import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query to get current user info
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Query to check if user is authenticated
export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null;
  },
});

// Mutation to update user profile (after auth is handled by Convex Auth)
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Convex Auth users table uses 'name' field instead of firstName/lastName
    const updateData: any = {};
    
    if (args.name) {
      updateData.name = args.name;
    } else if (args.firstName || args.lastName) {
      // Combine firstName and lastName into name field
      updateData.name = `${args.firstName || ''} ${args.lastName || ''}`.trim();
    }
    
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(userId, updateData);
    }
    
    return { success: true };
  },
});

// Admin helper to check current auth state (temporary for debugging)
export const getCurrentAuthState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const isAuth = userId !== null;
    
    return {
      userId,
      isAuthenticated: isAuth,
      timestamp: Date.now()
    };
  },
});

// Admin helper to delete a user by email (temporary for debugging)
export const deleteUserByEmail = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (user) {
      await ctx.db.delete(user._id);
      return { success: true, message: "User deleted" };
    } else {
      return { success: false, message: "User not found" };
    }
  },
});

// Admin helper to list all users (temporary for debugging)
export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Admin-only mutation to create users manually (for initial setup)
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // For now, allow anyone to create the first user
    // In production, this should check if the caller is an admin
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Combine firstName and lastName into name field for Convex Auth
    const name = args.name || `${args.firstName || ''} ${args.lastName || ''}`.trim();
    
    // Create the user in the users table
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: name || undefined,
    });
    
    return { success: true, userId };
  },
});
