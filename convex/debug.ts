import { query } from "./_generated/server";

// Debug query to see what tables exist in the database
export const listAllTables = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Get some basic info about what tables have data
      const tableInfo: Record<string, any> = {};
      
      // Try common table names
      const tableNames = [
        "users",
        "authSessions", 
        "authAccounts",
        "authRefreshTokens",
        "authVerificationCodes",
        "authVerifiers",
        "authRateLimits",
        "events",
        "venues"
      ];
      
      for (const tableName of tableNames) {
        try {
          const count = await ctx.db.query(tableName as any).take(1);
          tableInfo[tableName] = {
            exists: true,
            hasData: count.length > 0,
            sampleData: count
          };
        } catch (error) {
          tableInfo[tableName] = {
            exists: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
      
      return tableInfo;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});
