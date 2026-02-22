import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Settings2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { useTokenBalance } from "@/hooks/use-tokens";
import { useExecuteSwap, useSwapHistory } from "@/hooks/use-swaps";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Swap() {
  const [amount, setAmount] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { address } = useWallet();
  const { data: balanceData } = useTokenBalance();
  const { data: swapHistory } = useSwapHistory();
  const { mutate: executeSwap, isPending } = useExecuteSwap();
  const { toast } = useToast();

  const handleSwap = () => {
    if (!address || !amount || isNaN(Number(amount))) return;
    
    const numAmount = Number(amount);
    
    // Basic mock validation
    if (!isFlipped && numAmount > (balanceData?.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough $CHNK for this swap.",
        variant: "destructive"
      });
      return;
    }

    const fromToken = isFlipped ? "USDC" : "CHNK";
    const toToken = isFlipped ? "CHNK" : "USDC";

    executeSwap({
      walletAddress: address,
      fromToken,
      toToken,
      amount: numAmount
    }, {
      onSuccess: () => {
        toast({
          title: "Swap Successful",
          description: `Successfully swapped ${amount} ${fromToken} for ${toToken}.`,
          className: "bg-primary text-primary-foreground border-none"
        });
        setAmount("");
      },
      onError: (err) => {
        toast({
          title: "Swap Failed",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleMax = () => {
    if (!isFlipped && balanceData?.balance) {
      setAmount(balanceData.balance.toString());
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold">Swap</h1>
        <p className="text-muted-foreground mt-2">Trade instantly with deep liquidity and low slippage.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Swap Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glass-panel rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-semibold">Exchange</h2>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground">
                <Settings2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {/* Top Token */}
              <div className="bg-background/50 rounded-2xl p-4 ring-1 ring-border/50 transition-all focus-within:ring-primary/50">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>You pay</span>
                  <span>Balance: {isFlipped ? "0.00" : (balanceData?.balance?.toLocaleString() || "0")}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0" 
                    className="border-0 bg-transparent text-3xl font-display font-medium shadow-none focus-visible:ring-0 px-0"
                  />
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-full py-1 pr-4 pl-1 ring-1 ring-border">
                    <img 
                      src={isFlipped ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029" : "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=029"} 
                      alt="token" 
                      className="w-8 h-8 rounded-full bg-white p-1"
                    />
                    <span className="font-bold">{isFlipped ? "USDC" : "CHNK"}</span>
                  </div>
                </div>
                {!isFlipped && (
                  <button onClick={handleMax} className="text-xs text-primary font-medium mt-2 hover:underline">MAX</button>
                )}
              </div>

              {/* Swap Button */}
              <div className="relative flex justify-center -my-3 z-10">
                <Button 
                  size="icon" 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="rounded-full bg-card border-4 border-background h-12 w-12 hover:bg-card hover:scale-110 transition-transform active:scale-95 text-foreground shadow-lg"
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </div>

              {/* Bottom Token */}
              <div className="bg-background/50 rounded-2xl p-4 ring-1 ring-border/50">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>You receive</span>
                  <span>Balance: {!isFlipped ? "0.00" : (balanceData?.balance?.toLocaleString() || "0")}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input 
                    readOnly
                    value={amount ? (Number(amount) * (isFlipped ? 10 : 0.1)).toFixed(4) : ""}
                    placeholder="0.0" 
                    className="border-0 bg-transparent text-3xl font-display font-medium shadow-none focus-visible:ring-0 px-0 text-foreground/70"
                  />
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-full py-1 pr-4 pl-1 ring-1 ring-border">
                    <img 
                      src={!isFlipped ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029" : "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=029"} 
                      alt="token" 
                      className="w-8 h-8 rounded-full bg-white p-1"
                    />
                    <span className="font-bold">{!isFlipped ? "USDC" : "CHNK"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">Exchange Rate <Info className="w-3 h-3"/></span>
                <span className="font-medium text-foreground">1 CHNK = 0.1 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="font-medium text-foreground">0.001 CHNK</span>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleSwap}
              disabled={isPending || !address || !amount}
              className="w-full mt-6 h-14 rounded-2xl font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.2)] hover-elevate disabled:opacity-50 disabled:transform-none"
            >
              {!address ? "Connect Wallet" : isPending ? "Swapping..." : "Confirm Swap"}
            </Button>
          </div>
        </motion.div>

        {/* History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
            <h2 className="font-display text-xl font-semibold mb-4">Recent Swaps</h2>
            
            {!address ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm py-12 text-center">
                <ArrowDown className="w-12 h-12 mb-4 opacity-20" />
                <p>Connect wallet to view history</p>
              </div>
            ) : !swapHistory?.length ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm py-12">
                <p>No recent swaps found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {swapHistory.map((swap) => (
                      <TableRow key={swap.id} className="border-border/40">
                        <TableCell>
                          <div className="font-medium">{swap.fromToken} → {swap.toToken}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(swap.timestamp).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-display font-semibold">
                          {swap.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
