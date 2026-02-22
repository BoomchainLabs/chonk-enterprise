import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { MOCK_WALLET_ADDRESS } from "./use-wallet";

export function useTokenBalance(walletAddress: string = MOCK_WALLET_ADDRESS) {
  return useQuery({
    queryKey: [api.tokens.get.path, walletAddress],
    queryFn: async () => {
      const url = buildUrl(api.tokens.get.path, { walletAddress });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) {
        return { walletAddress, balance: 0 }; // Return default if not found
      }
      if (!res.ok) throw new Error("Failed to fetch token balance");
      return api.tokens.get.responses[200].parse(await res.json());
    },
    enabled: !!walletAddress,
  });
}

export function useSpinWheel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ walletAddress, reward }: { walletAddress: string, reward: number }) => {
      const res = await fetch(api.tokens.spin.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, reward }),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to process spin reward");
      }
      
      return api.tokens.spin.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate both token balance and leaderboard to reflect new scores/balances
      queryClient.invalidateQueries({ queryKey: [api.tokens.get.path, variables.walletAddress] });
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.list.path] });
    },
  });
}
