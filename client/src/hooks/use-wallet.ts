import { useState, useEffect } from 'react';

// For the CHONK Enterprise prototype, we use a mock wallet.
// In a real dApp, this would integrate with wagmi, viem, or solana/wallet-adapter
export const MOCK_WALLET_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Auto-connect for demo purposes
  useEffect(() => {
    setIsConnecting(true);
    const timer = setTimeout(() => {
      setAddress(MOCK_WALLET_ADDRESS);
      setIsConnecting(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const disconnect = () => setAddress(null);
  
  const connect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setAddress(MOCK_WALLET_ADDRESS);
      setIsConnecting(false);
    }, 800);
  };

  return {
    address,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    isConnected: !!address,
    isConnecting,
    connect,
    disconnect
  };
}
