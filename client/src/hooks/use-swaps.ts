import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSwap } from "@shared/routes";
import { MOCK_WALLET_ADDRESS } from "./use-wallet";

export function useSwapHistory(walletAddress: string = MOCK_WALLET_ADDRESS) {
  return useQuery({
    queryKey: [api.swaps.history.path, walletAddress],
    queryFn: async () => {
      const url = buildUrl(api.swaps.history.path, { walletAddress });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch swap history");
      return api.swaps.history.responses[200].parse(await res.json());
    },
    enabled: !!walletAddress,
  });
}

export function useExecuteSwap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertSwap) => {
      const validated = api.swaps.execute.input.parse(data);
      const res = await fetch(api.swaps.execute.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to execute swap");
      }
      
      return api.swaps.execute.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.swaps.history.path, variables.walletAddress] });
      queryClient.invalidateQueries({ queryKey: [api.tokens.get.path, variables.walletAddress] });
    },
  });
}
