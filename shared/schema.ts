import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Leaderboard Entries ---
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  score: integer("score").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({ 
  id: true,
  lastUpdated: true,
});

export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;

// --- User Tokens / Balances (Mock for frontend) ---
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  balance: integer("balance").notNull().default(0),
});

export const insertTokenSchema = createInsertSchema(tokens).omit({ id: true });
export type TokenBalance = typeof tokens.$inferSelect;
export type InsertTokenBalance = z.infer<typeof insertTokenSchema>;

// --- Swap History ---
export const swaps = pgTable("swaps", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSwapSchema = createInsertSchema(swaps).omit({ 
  id: true,
  timestamp: true,
});
export type Swap = typeof swaps.$inferSelect;
export type InsertSwap = z.infer<typeof insertSwapSchema>;

// --- API Contracts ---
export type RewardPopupRequest = {
  walletAddress: string;
  rewardAmount: number;
};
