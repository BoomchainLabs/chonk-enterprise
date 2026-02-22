import { motion } from "framer-motion";
import { ArrowRight, Trophy, Zap, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { SpinWheel } from "@/components/spin-wheel";
import { useWallet } from "@/hooks/use-wallet";
import { useTokenBalance } from "@/hooks/use-tokens";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isConnected } = useWallet();
  const { data: balanceData } = useTokenBalance();

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col gap-2"
      >
        <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
          Welcome to <span className="text-primary text-glow">CHONK</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          The most robust staking, swapping, and rewards ecosystem on the network.
          Connect your wallet to start earning $CHNK today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Action Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel flex flex-col items-center justify-center rounded-3xl p-8 lg:col-span-2"
        >
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Daily Spin & Win</h2>
            <p className="text-muted-foreground mt-2">Test your luck to win up to 1000 $CHNK instantly.</p>
          </div>
          
          <SpinWheel />
          
          {!isConnected && (
            <p className="mt-6 text-sm text-destructive font-medium">
              * Connect wallet to enable spinning
            </p>
          )}
        </motion.div>

        {/* Side Stats & Links */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Balance Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-accent rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all" />
            <h3 className="font-display text-lg font-medium text-primary">Your Balance</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-foreground">
                {balanceData?.balance?.toLocaleString() || "0"}
              </span>
              <span className="text-xl text-primary font-medium">$CHNK</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 flex-1"
          >
            <h3 className="font-display text-lg font-medium mb-6">Quick Actions</h3>
            
            <div className="flex flex-col gap-4">
              <Link href="/swap">
                <Button variant="secondary" className="w-full h-14 justify-between rounded-xl group hover-elevate bg-secondary/50">
                  <span className="flex items-center gap-3 font-medium">
                    <div className="p-2 rounded-lg bg-background text-foreground">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    Swap Tokens
                  </span>
                  <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </Link>
              
              <Link href="/leaderboard">
                <Button variant="secondary" className="w-full h-14 justify-between rounded-xl group hover-elevate bg-secondary/50">
                  <span className="flex items-center gap-3 font-medium">
                    <div className="p-2 rounded-lg bg-background text-accent">
                      <Trophy className="w-4 h-4" />
                    </div>
                    Leaderboard
                  </span>
                  <Zap className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
