"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDisconnect, useAccount } from "wagmi";
import { useEffect, useState } from "react";

export function Header() {
  const { isConnected, address } = useAccount();
  const [localIsConnected, setLocalIsConnected] = useState(isConnected);

  useEffect(() => {
    setLocalIsConnected(isConnected);
  }, [isConnected]);
  function shortenAddress(addr: string) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    setLocalIsConnected(false);
    console.log("Attempted to disconnect. Check if wallet is disconnected.");
  };

  useEffect(() => {
    console.log("Connection state:", localIsConnected, "Address:", address);
  }, [localIsConnected, address]);

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs, contracts, payments..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
              3
            </Badge>
          </Button>

          <div className="flex items-center gap-2">
            {localIsConnected ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Connected{" "}
                  <span>{address ? shortenAddress(address) : ""}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <w3m-button />
            )}
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
