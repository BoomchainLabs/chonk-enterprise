import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Leaderboard Routes ---
  app.get(api.leaderboard.list.path, async (req, res) => {
    const entries = await storage.getLeaderboard();
    res.json(entries);
  });

  app.post(api.leaderboard.update.path, async (req, res) => {
    try {
      const input = api.leaderboard.update.input.parse(req.body);
      const updated = await storage.updateLeaderboardScore(input.walletAddress, input.score);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Token Routes ---
  app.get(api.tokens.get.path, async (req, res) => {
    const { walletAddress } = req.params;
    let balance = await storage.getTokenBalance(walletAddress);
    
    // Auto-create balance for mock purposes if it doesn't exist
    if (!balance) {
      balance = await storage.addTokens(walletAddress, 1000); // Give 1000 starting tokens
    }
    
    res.json(balance);
  });

  app.post(api.tokens.spin.path, async (req, res) => {
    try {
      const input = api.tokens.spin.input.parse(req.body);
      
      // A spin costs 50 tokens
      const SPIN_COST = 50;
      
      try {
        await storage.removeTokens(input.walletAddress, SPIN_COST);
      } catch (e) {
        return res.status(400).json({ message: "Insufficient balance for spin (needs 50 tokens)" });
      }
      
      // Add the reward if they won
      if (input.reward > 0) {
        await storage.addTokens(input.walletAddress, input.reward);
      }
      
      // Update leaderboard score with the reward amount
      if (input.reward > 0) {
         await storage.updateLeaderboardScore(input.walletAddress, input.reward);
      }
      
      const newBalance = await storage.getTokenBalance(input.walletAddress);
      res.json(newBalance);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Swap Routes ---
  app.get(api.swaps.history.path, async (req, res) => {
    const { walletAddress } = req.params;
    const history = await storage.getSwapHistory(walletAddress);
    res.json(history);
  });

  app.post(api.swaps.execute.path, async (req, res) => {
    try {
      const input = api.swaps.execute.input.parse(req.body);
      
      // Mock logic: deduct from token balance if swapping FROM our mock token
      if (input.fromToken === 'CHONK') {
        try {
          await storage.removeTokens(input.walletAddress, input.amount);
        } catch (e) {
          return res.status(400).json({ message: "Insufficient CHONK balance" });
        }
      } else if (input.toToken === 'CHONK') {
         // Mock logic: add to token balance if swapping TO our mock token
         // (Assume 1:1 ratio for simplicity of mock)
         await storage.addTokens(input.walletAddress, input.amount);
      }
      
      const swap = await storage.createSwap(input);
      res.status(201).json(swap);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}