import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useWallet } from "@/hooks/use-wallet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function truncateWallet(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { address } = useWallet();

  const sortedLeaderboard = leaderboard ? [...leaderboard].sort((a, b) => b.score - a.score) : [];

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-accent/10 text-accent rounded-full mb-4 ring-1 ring-accent/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Top CHONKers</h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          The most active participants in the ecosystem. Earn points by swapping and spinning the daily wheel.
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      {!isLoading && sortedLeaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-12 mt-12 items-end max-w-3xl mx-auto px-4">
          {/* Second Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center order-1 sm:order-1"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-300 flex items-center justify-center ring-4 ring-background z-10 shadow-lg shadow-zinc-300/20">
              <Medal className="w-8 h-8 text-zinc-600" />
            </div>
            <div className="bg-card w-full pt-10 pb-6 px-2 text-center rounded-t-2xl border-t border-x border-border/50 mt-[-2rem] flex-1 min-h-[140px] flex flex-col justify-end">
              <div className="font-mono text-xs text-muted-foreground mb-1">
                {truncateWallet(sortedLeaderboard[1].walletAddress)}
              </div>
              <div className="font-display font-bold text-xl text-zinc-300">
                {sortedLeaderboard[1].score.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* First Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center order-2 sm:order-2 z-20"
          >
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center ring-4 ring-background shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              <Crown className="w-10 h-10 text-accent-foreground" />
            </div>
            <div className="bg-gradient-to-t from-card to-accent/10 w-full pt-12 pb-8 px-2 text-center rounded-t-2xl border-t border-x border-accent/30 mt-[-2.5rem] min-h-[180px] flex flex-col justify-end">
              <div className="font-mono text-sm text-foreground mb-1 font-bold">
                {truncateWallet(sortedLeaderboard[0].walletAddress)}
              </div>
              <div className="font-display font-bold text-3xl text-accent text-glow-accent">
                {sortedLeaderboard[0].score.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Third Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center order-3 sm:order-3"
          >
            <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center ring-4 ring-background z-10 shadow-lg shadow-amber-700/20">
              <Medal className="w-8 h-8 text-amber-900" />
            </div>
            <div className="bg-card w-full pt-10 pb-6 px-2 text-center rounded-t-2xl border-t border-x border-border/50 mt-[-2rem] min-h-[120px] flex flex-col justify-end">
              <div className="font-mono text-xs text-muted-foreground mb-1">
                {truncateWallet(sortedLeaderboard[2].walletAddress)}
              </div>
              <div className="font-display font-bold text-xl text-amber-600">
                {sortedLeaderboard[2].score.toLocaleString()}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/40">
          <h2 className="font-display text-xl font-semibold">Global Rankings</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-[100px] text-center">Rank</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeaderboard.map((entry, index) => {
                  const isCurrentUser = entry.walletAddress === address;
                  return (
                    <TableRow 
                      key={entry.id} 
                      className={`border-border/40 transition-colors ${isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : ""}`}
                    >
                      <TableCell className="text-center font-display font-bold text-muted-foreground">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                            ${index === 0 ? "bg-accent text-accent-foreground" : 
                              index === 1 ? "bg-zinc-300 text-zinc-800" :
                              index === 2 ? "bg-amber-700 text-amber-100" : "bg-secondary text-secondary-foreground"}`}>
                            {index + 1}
                          </div>
                          <span className={`font-mono text-sm ${isCurrentUser ? "text-primary font-bold" : "text-foreground"}`}>
                            {truncateWallet(entry.walletAddress)}
                            {isCurrentUser && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-sans">YOU</span>}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-display font-semibold text-lg">
                        {entry.score.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sortedLeaderboard.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      No leaderboard data found. Be the first to spin!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
