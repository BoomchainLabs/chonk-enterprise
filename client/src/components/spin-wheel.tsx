import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useSpinWheel } from "@/hooks/use-tokens";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";

const SEGMENTS = [
  { label: "1000 CHNK", value: 1000, color: "hsl(48 96% 53%)" }, // Gold
  { label: "0 CHNK", value: 0, color: "hsl(240 10% 15%)" },
  { label: "50 CHNK", value: 50, color: "hsl(142 71% 45%)" },    // Green
  { label: "500 CHNK", value: 500, color: "hsl(142 50% 30%)" },
  { label: "0 CHNK", value: 0, color: "hsl(240 10% 15%)" },
  { label: "100 CHNK", value: 100, color: "hsl(142 71% 45%)" },
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const { address } = useWallet();
  const { mutateAsync: spinToken } = useSpinWheel();
  const { toast } = useToast();
  const controls = useAnimation();
  const currentRotation = useRef(0);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#eab308', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#eab308', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSpin = async () => {
    if (!address || isSpinning) return;
    setIsSpinning(true);

    try {
      // Pick a random segment mathematically
      const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
      const winningSegment = SEGMENTS[winningIndex];
      
      // Calculate rotation
      const sliceAngle = 360 / SEGMENTS.length;
      const targetRotation = 360 * 5 + (360 - (winningIndex * sliceAngle)); // Spin 5 times then stop at target
      
      currentRotation.current += targetRotation;

      // Start physical animation
      await controls.start({
        rotate: currentRotation.current,
        transition: { duration: 4, type: "spring", bounce: 0.1, damping: 20, mass: 100 }
      });

      // Submit result to backend
      await spinToken({ walletAddress: address, reward: winningSegment.value });

      if (winningSegment.value > 0) {
        triggerConfetti();
        toast({
          title: "🎉 You Won!",
          description: `Added ${winningSegment.value} CHNK to your wallet.`,
          className: "bg-primary text-primary-foreground border-none shadow-[0_0_30px_rgba(34,197,94,0.4)]",
        });
      } else {
        toast({
          title: "Aww, Tough Luck!",
          description: "You didn't win anything this time. Try again!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while claiming your reward.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative mb-8 aspect-square w-full max-w-[320px] drop-shadow-2xl">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 z-20 h-10 w-8 -translate-x-1/2 drop-shadow-lg">
          <div className="h-full w-full bg-foreground" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
        </div>

        {/* Wheel Container */}
        <div className="h-full w-full overflow-hidden rounded-full ring-8 ring-card-border shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <motion.div 
            animate={controls}
            className="relative h-full w-full origin-center"
          >
            {SEGMENTS.map((segment, i) => {
              const rotation = (i * 360) / SEGMENTS.length;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 h-1/2 w-full origin-bottom -translate-x-1/2"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
                    backgroundColor: segment.color,
                  }}
                >
                  <span 
                    className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap font-display text-sm font-bold text-white drop-shadow-md"
                    style={{ transform: 'rotate(90deg)' }}
                  >
                    {segment.label}
                  </span>
                </div>
              );
            })}
            
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card-border bg-background shadow-inner z-10 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleSpin}
        disabled={isSpinning || !address}
        className="h-14 rounded-full px-12 font-display text-lg font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        {isSpinning ? "SPINNING..." : "SPIN TO WIN"}
      </Button>
    </div>
  );
}
