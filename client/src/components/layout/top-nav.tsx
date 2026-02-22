import { Wallet, Coins } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useTokenBalance } from "@/hooks/use-tokens";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const { isConnected, shortAddress, connect } = useWallet();
  const { data: balanceData } = useTokenBalance();

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-display text-xl font-bold tracking-tight md:hidden text-primary text-glow">
          CHONK
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 sm:flex shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <Coins className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-primary">
              {balanceData?.balance?.toLocaleString() || 0} $CHNK
            </span>
          </div>
        )}

        <Button 
          variant={isConnected ? "outline" : "default"}
          onClick={isConnected ? undefined : connect}
          className={`rounded-full px-6 font-semibold active-press ${
            isConnected 
              ? "border-primary/30 text-foreground hover:bg-primary/10" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          }`}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? shortAddress : "Connect Wallet"}
        </Button>
      </div>
    </header>
  );
}
