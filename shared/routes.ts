import { z } from 'zod';
import { 
  insertLeaderboardSchema, leaderboard,
  insertTokenSchema, tokens,
  insertSwapSchema, swaps
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  leaderboard: {
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      responses: {
        200: z.array(z.custom<typeof leaderboard.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/leaderboard' as const,
      input: z.object({ walletAddress: z.string(), score: z.number() }),
      responses: {
        200: z.custom<typeof leaderboard.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  tokens: {
    get: {
      method: 'GET' as const,
      path: '/api/tokens/:walletAddress' as const,
      responses: {
        200: z.custom<typeof tokens.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    spin: {
      method: 'POST' as const,
      path: '/api/tokens/spin' as const,
      input: z.object({ walletAddress: z.string(), reward: z.number() }),
      responses: {
        200: z.custom<typeof tokens.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  swaps: {
    history: {
      method: 'GET' as const,
      path: '/api/swaps/:walletAddress' as const,
      responses: {
        200: z.array(z.custom<typeof swaps.$inferSelect>()),
      },
    },
    execute: {
      method: 'POST' as const,
      path: '/api/swaps' as const,
      input: insertSwapSchema,
      responses: {
        201: z.custom<typeof swaps.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LeaderboardListResponse = z.infer<typeof api.leaderboard.list.responses[200]>;
export type TokenBalanceResponse = z.infer<typeof api.tokens.get.responses[200]>;
export type SwapHistoryResponse = z.infer<typeof api.swaps.history.responses[200]>;
