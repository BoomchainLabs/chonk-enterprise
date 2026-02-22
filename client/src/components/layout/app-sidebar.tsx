import { Link, useLocation } from "wouter";
import { LayoutDashboard, ArrowLeftRight, Trophy, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Swap Tokens", url: "/swap", icon: ArrowLeftRight },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-border/40 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="flex h-20 items-center justify-center border-b border-border/40 px-6">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Zap className="h-6 w-6" fill="currentColor" />
          </div>
          <span className="font-display text-2xl font-bold tracking-wider text-glow">CHONK</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Enterprise dApp
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`h-12 rounded-xl px-4 transition-all duration-200 ${
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold shadow-[inset_0_0_0_1px_rgba(34,197,94,0.3)]" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-6">
        <div className="rounded-xl bg-secondary/30 p-4 ring-1 ring-white/5">
          <p className="font-display text-sm font-semibold text-foreground">Chonk Network</p>
          <p className="mt-1 text-xs text-muted-foreground">Mainnet Beta v1.0.0</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-primary">System Operational</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
