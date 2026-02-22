import { db } from "./db";
import { 
  leaderboard, tokens, swaps,
  type InsertLeaderboardEntry,
  type InsertTokenBalance,
  type InsertSwap,
  type LeaderboardEntry,
  type TokenBalance,
  type Swap
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  updateLeaderboardScore(walletAddress: string, scoreToAdd: number): Promise<LeaderboardEntry>;
  
  getTokenBalance(walletAddress: string): Promise<TokenBalance | undefined>;
  addTokens(walletAddress: string, amount: number): Promise<TokenBalance>;
  removeTokens(walletAddress: string, amount: number): Promise<TokenBalance>;
  
  getSwapHistory(walletAddress: string): Promise<Swap[]>;
  createSwap(swap: InsertSwap): Promise<Swap>;
}

export class DatabaseStorage implements IStorage {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return await db.select().from(leaderboard).orderBy(desc(leaderboard.score)).limit(100);
  }

  async updateLeaderboardScore(walletAddress: string, scoreToAdd: number): Promise<LeaderboardEntry> {
    const existing = await db.select().from(leaderboard).where(eq(leaderboard.walletAddress, walletAddress));
    
    if (existing.length === 0) {
      const [newEntry] = await db.insert(leaderboard).values({
        walletAddress,
        score: scoreToAdd
      }).returning();
      return newEntry;
    }
    
    const [updated] = await db.update(leaderboard)
      .set({ score: existing[0].score + scoreToAdd, lastUpdated: new Date() })
      .where(eq(leaderboard.walletAddress, walletAddress))
      .returning();
      
    return updated;
  }

  async getTokenBalance(walletAddress: string): Promise<TokenBalance | undefined> {
    const [balance] = await db.select().from(tokens).where(eq(tokens.walletAddress, walletAddress));
    return balance;
  }

  async addTokens(walletAddress: string, amount: number): Promise<TokenBalance> {
    const existing = await this.getTokenBalance(walletAddress);
    
    if (!existing) {
      const [newBalance] = await db.insert(tokens).values({
        walletAddress,
        balance: amount
      }).returning();
      return newBalance;
    }
    
    const [updated] = await db.update(tokens)
      .set({ balance: existing.balance + amount })
      .where(eq(tokens.walletAddress, walletAddress))
      .returning();
      
    return updated;
  }

  async removeTokens(walletAddress: string, amount: number): Promise<TokenBalance> {
    const existing = await this.getTokenBalance(walletAddress);
    
    if (!existing || existing.balance < amount) {
      throw new Error("Insufficient balance");
    }
    
    const [updated] = await db.update(tokens)
      .set({ balance: existing.balance - amount })
      .where(eq(tokens.walletAddress, walletAddress))
      .returning();
      
    return updated;
  }

  async getSwapHistory(walletAddress: string): Promise<Swap[]> {
    return await db.select().from(swaps)
      .where(eq(swaps.walletAddress, walletAddress))
      .orderBy(desc(swaps.timestamp))
      .limit(50);
  }

  async createSwap(swap: InsertSwap): Promise<Swap> {
    const [newSwap] = await db.insert(swaps).values(swap).returning();
    return newSwap;
  }
}

export const storage = new DatabaseStorage();
